"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        placeholder="Ask about leave, payroll, VPN, password reset..."
        className="flex-1 rounded-full border border-neutral-200 bg-neutral-50/60 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400"
      >
        <Send size={16} strokeWidth={2.25} />
      </button>
    </form>
  );
}
