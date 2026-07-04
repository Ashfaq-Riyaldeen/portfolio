"use client";

import { Mail, MailOpen, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { deleteMessage, setMessageRead } from "./actions";

export interface MessageRow {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  created_at: string;
}

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Inbox: expand to read, toggle read state, reply by email, delete. */
export function MessagesInbox({ initial }: { initial: MessageRow[] }) {
  const router = useRouter();
  const [messages, setMessages] = useState(initial);
  const [openId, setOpenId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function toggleOpen(msg: MessageRow) {
    const opening = openId !== msg.id;
    setOpenId(opening ? msg.id : null);
    // Opening an unread message marks it read.
    if (opening && !msg.read) markRead(msg.id, true);
  }

  function markRead(id: string, read: boolean) {
    setError(null);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read } : m)));
    startTransition(async () => {
      const result = await setMessageRead(id, read);
      if (result.error) {
        setError(result.error);
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: !read } : m)));
      } else {
        router.refresh();
      }
    });
  }

  function remove(msg: MessageRow) {
    if (!window.confirm(`Delete the message from ${msg.name}? This can't be undone.`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteMessage(msg.id);
      if (result.error) {
        setError(result.error);
      } else {
        setMessages((prev) => prev.filter((m) => m.id !== msg.id));
        router.refresh();
      }
    });
  }

  if (messages.length === 0) {
    return (
      <div className="glass rounded-2xl p-10 text-center">
        <p className="text-sm text-muted">
          No messages yet — they&apos;ll appear here when someone uses the contact form.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div aria-live="polite" className="min-h-5">
        {error ? (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        ) : null}
      </div>

      <ul className="mt-3 space-y-2">
        {messages.map((msg) => {
          const open = openId === msg.id;
          return (
            <li key={msg.id} className={cn("glass rounded-xl", !msg.read && "border-primary/40")}>
              <button
                type="button"
                onClick={() => toggleOpen(msg)}
                aria-expanded={open}
                className="flex w-full items-center gap-3 px-4 py-3 text-left"
              >
                <span
                  className={cn(
                    "size-2 shrink-0 rounded-full",
                    msg.read ? "bg-white/15" : "bg-secondary",
                  )}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "truncate text-sm",
                      msg.read ? "font-normal text-muted" : "font-semibold text-foreground",
                    )}
                  >
                    {msg.name}
                    <span className="ml-2 font-mono text-[10px] font-normal text-subtle">
                      {msg.email}
                    </span>
                  </p>
                  <p className="truncate text-xs text-subtle">
                    {msg.subject || msg.message}
                  </p>
                </div>
                <span className="hidden shrink-0 font-mono text-[10px] text-subtle sm:block">
                  {formatWhen(msg.created_at)}
                </span>
              </button>

              {open ? (
                <div className="border-t border-line px-4 py-4">
                  {msg.subject ? (
                    <p className="mb-2 text-sm font-medium text-foreground">{msg.subject}</p>
                  ) : null}
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">
                    {msg.message}
                  </p>
                  <p className="mt-3 font-mono text-[10px] text-subtle sm:hidden">
                    {formatWhen(msg.created_at)}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <a
                      href={`mailto:${msg.email}?subject=${encodeURIComponent(`Re: ${msg.subject || "your message"}`)}`}
                      className="rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-2 text-xs font-semibold text-white shadow-md shadow-primary/25 transition-all hover:shadow-primary/45"
                    >
                      Reply by email
                    </a>
                    <button
                      type="button"
                      onClick={() => markRead(msg.id, !msg.read)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-line px-3.5 py-2 text-xs font-medium text-muted transition-colors hover:border-primary/40 hover:text-foreground"
                    >
                      {msg.read ? <Mail className="size-3.5" /> : <MailOpen className="size-3.5" />}
                      Mark as {msg.read ? "unread" : "read"}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(msg)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-line px-3.5 py-2 text-xs font-medium text-muted transition-colors hover:border-red-400/40 hover:text-red-400"
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
