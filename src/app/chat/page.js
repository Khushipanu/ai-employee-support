"use client";

import { useState } from "react";
import { Bot } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ChatBox from "@/components/ChatBox";
import ChatInput from "@/components/ChatInput";

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `m${Date.now()}_${idCounter}`;
}

function ChatContent({ user }) {
  const [messages, setMessages] = useState([]);
  const [thinking, setThinking] = useState(false);

  async function createTicket(question, introText) {
    try {
      const res = await fetch("/api/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          employeeName: user.name,
          employeeEmail: user.email,
        }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "assistant",
          type: "ticket-created",
          text: introText,
          ticket: data.ticket,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "assistant",
          text: "I couldn't create the ticket due to a network error. Please try again.",
        },
      ]);
    }
  }

  async function handleSend(question) {
    setMessages((prev) => [...prev, { id: nextId(), role: "user", text: question }]);
    setThinking(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();

      if (data.canAnswer) {
        setMessages((prev) => [
          ...prev,
          { id: nextId(), role: "assistant", text: data.answer },
        ]);
      } else if (data.autoTicket) {
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: "assistant",
            type: "auto-ticket",
            text: "Sorry you're locked out — that's clearly blocking your work, so I'm raising this straight to the IT support team.",
          },
        ]);
        await createTicket(
          question,
          "Done — an IT support ticket has been raised automatically. They'll reach out shortly."
        );
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: "assistant",
            type: "ask-ticket",
            text:
              "I couldn't find an answer to that in our company policies. Would you like me to raise a support ticket?",
            question,
            resolved: false,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "assistant",
          text: "Something went wrong reaching the AI assistant. Please try again.",
        },
      ]);
    } finally {
      setThinking(false);
    }
  }

  async function handleRaiseTicket(messageId) {
    const msg = messages.find((m) => m.id === messageId);
    if (!msg) return;

    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, resolved: true } : m))
    );

    await createTicket(
      msg.question,
      "Done — I've raised a support ticket for you. You can track it in Ticket History."
    );
  }

  function handleDismissTicket(messageId) {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, resolved: true } : m))
    );
    setMessages((prev) => [
      ...prev,
      {
        id: nextId(),
        role: "assistant",
        text: "No problem — let me know if there's anything else I can help with.",
      },
    ]);
  }

  return (
    <div className="flex h-[calc(100vh-9.5rem)] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm shadow-neutral-200/40">
      <div className="flex items-center gap-2.5 border-b border-neutral-100 bg-white px-5 py-3.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-indigo-600 to-violet-600 text-white">
          <Bot size={16} strokeWidth={2.25} />
        </span>
        <div>
          <h1 className="text-sm font-semibold text-neutral-900">AI Support Assistant</h1>
          <p className="flex items-center gap-1 text-xs text-neutral-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online · HR & IT policies
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-neutral-50/50 px-5 py-5">
        <ChatBox
          messages={messages}
          thinking={thinking}
          onRaiseTicket={handleRaiseTicket}
          onDismissTicket={handleDismissTicket}
        />
      </div>

      <div className="border-t border-neutral-100 bg-white p-4">
        <ChatInput onSend={handleSend} disabled={thinking} />
      </div>
    </div>
  );
}

export default function ChatPage() {
  return <ProtectedRoute>{(user) => <ChatContent user={user} />}</ProtectedRoute>;
}
