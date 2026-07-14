"use client";

import { useState } from "react";
import { Users, Wrench, Send } from "lucide-react";

const STATUS_STYLES = {
  Open: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  "In Progress": "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  Resolved: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
};

const PRIORITY_STYLES = {
  High: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
  Medium: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  Low: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
};

const CATEGORY_ICON = { HR: Users, IT: Wrench };

export default function TicketCard({ ticket, onStatusChange, onReply, showEmployee = false }) {
  const CategoryIcon = CATEGORY_ICON[ticket.category] || Wrench;
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  // Legacy tickets stored a single `resolution` string before the reply
  // thread existed — fold it in as the first message so old data still shows.
  const thread = [
    ...(ticket.resolution
      ? [
          {
            id: "legacy-resolution",
            authorName: "Support",
            authorRole: ticket.category,
            text: ticket.resolution,
            createdAt: ticket.updatedAt || ticket.createdAt,
          },
        ]
      : []),
    ...(ticket.replies || []),
  ];

  async function handleReply() {
    const trimmed = text.trim();
    if (!trimmed || !onReply || busy) return;
    setBusy(true);
    await onReply(ticket.id, trimmed);
    setText("");
    setBusy(false);
  }

  async function handleStatus(status) {
    const trimmed = text.trim();
    if (status === "Resolved" && !trimmed) return;
    if (!onStatusChange || busy) return;
    setBusy(true);
    await onStatusChange(ticket.id, status, trimmed || undefined);
    setText("");
    setBusy(false);
  }

  const canCompose = Boolean(onReply || onStatusChange);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 dark:hover:shadow-none">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
            <CategoryIcon size={14} strokeWidth={2.25} />
          </span>
          <div>
            <p className="text-xs font-mono text-neutral-400">{ticket.id}</p>
            <p className="mt-0.5 text-sm font-medium text-neutral-800 dark:text-neutral-100">{ticket.subject}</p>
            {showEmployee && (
              <p className="mt-1 text-xs text-neutral-400">
                {ticket.employeeName} · {ticket.employeeEmail}
              </p>
            )}
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-medium ${
            PRIORITY_STYLES[ticket.priority] || PRIORITY_STYLES.Low
          }`}
        >
          {ticket.priority}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-neutral-100 px-2 py-1 text-[11px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
            {ticket.category}
          </span>
          <span
            className={`rounded-full px-2 py-1 text-[11px] font-medium ${
              STATUS_STYLES[ticket.status] || STATUS_STYLES.Open
            }`}
          >
            {ticket.status}
          </span>
        </div>
        <span className="text-[11px] text-neutral-400">
          {new Date(ticket.createdAt).toLocaleDateString()}
        </span>
      </div>

      {thread.length > 0 && (
        <div className="mt-3 space-y-2 border-t border-neutral-100 pt-3 dark:border-neutral-800">
          {thread.map((r, i) => (
            <div key={r.id || i} className="rounded-lg bg-neutral-50 px-3 py-2 dark:bg-neutral-800/60">
              <p className="flex items-center justify-between gap-2 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                <span>
                  {r.authorName}{" "}
                  <span className="font-normal text-neutral-400 dark:text-neutral-500">· {r.authorRole}</span>
                </span>
                <span className="shrink-0 font-normal">{new Date(r.createdAt).toLocaleString()}</span>
              </p>
              <p className="mt-1 text-xs leading-relaxed text-neutral-700 dark:text-neutral-200">{r.text}</p>
            </div>
          ))}
        </div>
      )}

      {canCompose && (
        <div className="mt-3 border-t border-neutral-100 pt-3 dark:border-neutral-800">
          <textarea
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a reply..."
            className="w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50/50 px-3 py-2 text-xs outline-none transition placeholder:text-neutral-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-indigo-500 dark:focus:bg-neutral-900 dark:focus:ring-indigo-500/20"
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {onReply && (
              <button
                onClick={handleReply}
                disabled={busy || !text.trim()}
                className="flex items-center gap-1 rounded-md bg-indigo-600 px-2.5 py-1 text-[11px] font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={11} /> Reply
              </button>
            )}
            {onStatusChange &&
              ["Open", "In Progress", "Resolved"]
                .filter((s) => s !== ticket.status)
                .map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatus(s)}
                    disabled={busy || (s === "Resolved" && !text.trim())}
                    title={s === "Resolved" && !text.trim() ? "Write a resolution note above first" : undefined}
                    className="rounded-md border border-neutral-200 px-2 py-1 text-[11px] font-medium text-neutral-600 transition hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:bg-neutral-800"
                  >
                    Mark {s}
                  </button>
                ))}
          </div>
        </div>
      )}
    </div>
  );
}
