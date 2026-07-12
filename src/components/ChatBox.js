"use client";

import { Bot, User, CheckCircle2, Zap } from "lucide-react";

function Avatar({ role }) {
  if (role === "user") {
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white">
        <User size={14} strokeWidth={2.25} />
      </span>
    );
  }
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-600 to-violet-600 text-white">
      <Bot size={14} strokeWidth={2.25} />
    </span>
  );
}

function Row({ role, children }) {
  const isUser = role === "user";
  return (
    <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
      <Avatar role={role} />
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-sm bg-neutral-900 text-white"
            : "rounded-bl-sm border border-neutral-200 bg-white text-neutral-800"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default function ChatBox({ messages, thinking, onRaiseTicket, onDismissTicket }) {
  return (
    <div className="flex flex-col gap-4 overflow-y-auto p-1">
      {messages.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-14 text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <Bot size={18} />
          </span>
          <p className="max-w-xs text-sm text-neutral-400">
            Ask about leave, payroll, VPN, password resets, or anything else covered by
            company policy.
          </p>
        </div>
      )}

      {messages.map((m) => (
        <div key={m.id} className="animate-fade-in-up">
          <Row role={m.role}>
            <p className="whitespace-pre-wrap">{m.text}</p>

            {m.type === "ask-ticket" && !m.resolved && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => onRaiseTicket(m.id)}
                  className="rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-700"
                >
                  Yes, raise a ticket
                </button>
                <button
                  onClick={() => onDismissTicket(m.id)}
                  className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 transition hover:bg-neutral-50"
                >
                  No, thanks
                </button>
              </div>
            )}

            {m.type === "ticket-created" && (
              <div className="mt-2.5 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                <CheckCircle2 size={14} className="shrink-0" />
                <span>
                  Ticket <span className="font-mono">{m.ticket.id}</span> · {m.ticket.category} ·
                  Priority {m.ticket.priority}
                </span>
              </div>
            )}

            {m.type === "auto-ticket" && (
              <div className="mt-2.5 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                <Zap size={14} className="shrink-0" />
                <span>Auto-detected as urgent — raising an IT ticket right away</span>
              </div>
            )}
          </Row>
        </div>
      ))}

      {thinking && (
        <Row role="assistant">
          <span className="flex items-center gap-1 py-0.5">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-300 [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-300 [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-300" />
          </span>
        </Row>
      )}
    </div>
  );
}
