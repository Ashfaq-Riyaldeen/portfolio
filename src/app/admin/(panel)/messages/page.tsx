import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MessagesInbox, type MessageRow } from "./messages-client";

export const metadata = { title: "Messages · Admin" };

export default async function MessagesPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  const messages = (data ?? []) as MessageRow[];
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Messages</h1>
        <p className="mt-2 text-sm text-muted">
          {unread > 0
            ? `${unread} unread ${unread === 1 ? "message" : "messages"} — sent from the site's contact form.`
            : "Everything sent from the site's contact form lands here."}
        </p>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-red-400">
          Couldn&apos;t load messages: {error.message}
        </p>
      ) : (
        <MessagesInbox initial={messages} />
      )}
    </div>
  );
}
