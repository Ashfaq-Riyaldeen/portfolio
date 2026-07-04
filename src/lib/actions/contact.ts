"use server";

import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";

export interface ContactState {
  ok: boolean;
  error?: string;
}

// Per-IP cooldown. In-memory is fine here: worst case a serverless cold start
// resets it, and the honeypot still filters bots.
const lastSentByIp = new Map<string, number>();
const COOLDOWN_MS = 60_000;

async function notifyByEmail(name: string, email: string, subject: string, message: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFICATION_EMAIL;
  if (!apiKey || !to) return;

  // Message is already stored in the inbox — a failed email must not fail the send.
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: [to],
        reply_to: email,
        subject: `[Portfolio] ${subject || `New message from ${name}`}`,
        text: `${message}\n\n— ${name} <${email}>\nSent from the portfolio contact form.`,
      }),
    });
  } catch {
    // ignored — the message is safe in the admin inbox
  }
}

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot: bots fill every field — humans never see this one.
  // Pretend success so bots don't retry.
  if (formData.get("website")) return { ok: true };

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { ok: false, error: "Please fill in your name, email, and message." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "That email address doesn't look right." };
  }
  if (message.length > 5000) {
    return { ok: false, error: "That message is a little too long — please shorten it." };
  }

  const ip = ((await headers()).get("x-forwarded-for") ?? "local").split(",")[0].trim();
  const last = lastSentByIp.get(ip);
  if (last && Date.now() - last < COOLDOWN_MS) {
    return { ok: false, error: "Please wait a minute before sending another message." };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return { ok: false, error: "The contact form isn't set up yet — email me instead." };
  }

  // Plain anon client: the RLS "Anyone can send" policy allows exactly this insert.
  const supabase = createClient(url, key);
  const { error } = await supabase.from("messages").insert({
    name: name.slice(0, 200),
    email: email.slice(0, 200),
    subject: subject.slice(0, 300) || null,
    message,
  });
  if (error) {
    return { ok: false, error: "Couldn't send your message — please try again in a moment." };
  }

  lastSentByIp.set(ip, Date.now());
  await notifyByEmail(name, email, subject, message);
  return { ok: true };
}
