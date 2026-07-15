"use client";

import { useEffect, useState } from "react";
import { ListChecks, Plus, Trash2, Check } from "lucide-react";
import Loader from "@/components/Loader";

function todayDateString() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function TodayTasks({ employeeEmail }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const date = todayDateString();

  useEffect(() => {
    fetch(`/api/tasks?employeeEmail=${encodeURIComponent(employeeEmail)}&date=${date}`)
      .then((res) => res.json())
      .then((data) => setTasks(data.tasks || []))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeEmail]);

  async function handleAdd(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeEmail, text: trimmed, date }),
      });
      const data = await res.json();
      if (data.task) {
        setTasks((prev) => [...prev, data.task]);
        setText("");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleDone(task) {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t)));
    await fetch("/api/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: task.id, done: !task.done }),
    });
  }

  async function handleDelete(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await fetch(`/api/tasks?id=${encodeURIComponent(id)}`, { method: "DELETE" });
  }

  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <ListChecks size={16} strokeWidth={2.25} />
          </span>
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Today&apos;s Tasks</h2>
        </div>
        {tasks.length > 0 && (
          <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
            {doneCount}/{tasks.length}
          </span>
        )}
      </div>

      <form onSubmit={handleAdd} className="mb-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a task for today..."
          className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 px-3 py-2 text-sm outline-none transition placeholder:text-neutral-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-indigo-500 dark:focus:bg-neutral-900 dark:focus:ring-indigo-500/20"
        />
        <button
          type="submit"
          disabled={submitting || !text.trim()}
          title="Add task"
          className="flex shrink-0 items-center justify-center rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-600 dark:hover:bg-indigo-500"
        >
          <Plus size={15} />
        </button>
      </form>

      {loading ? (
        <Loader label="Loading tasks..." />
      ) : tasks.length === 0 ? (
        <p className="text-sm text-neutral-400">Nothing on your list yet — add your first task for today.</p>
      ) : (
        <ul className="space-y-1">
          {tasks.map((t) => (
            <li
              key={t.id}
              className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
            >
              <button
                onClick={() => toggleDone(t)}
                title={t.done ? "Mark as not done" : "Mark as done"}
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                  t.done
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-neutral-300 dark:border-neutral-600"
                }`}
              >
                {t.done && <Check size={12} strokeWidth={3} />}
              </button>
              <span
                className={`flex-1 text-sm ${
                  t.done ? "text-neutral-400 line-through" : "text-neutral-700 dark:text-neutral-200"
                }`}
              >
                {t.text}
              </span>
              <button
                onClick={() => handleDelete(t.id)}
                title="Delete task"
                className="shrink-0 text-neutral-300 opacity-0 transition group-hover:opacity-100 hover:text-rose-500 dark:text-neutral-600"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
