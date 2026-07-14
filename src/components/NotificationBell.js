"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, Megaphone, Briefcase } from "lucide-react";

const TYPE_ICON = { announcement: Megaphone, application: Briefcase };

export default function NotificationBell({ email }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  function load() {
    fetch(`/api/notifications?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => setNotifications(data.notifications || []));
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function toggleOpen() {
    const next = !open;
    setOpen(next);
    if (next && unreadCount > 0) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, markAll: true }),
      });
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggleOpen}
        title="Notifications"
        className="relative flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-rose-500" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-neutral-200 bg-white p-2 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
          <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Notifications
          </p>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-2 py-4 text-center text-sm text-neutral-400">You&apos;re all caught up.</p>
            ) : (
              notifications.map((n) => {
                const Icon = TYPE_ICON[n.type] || Bell;
                return (
                  <Link
                    key={n.id}
                    href={n.link || "#"}
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-2.5 rounded-lg px-2 py-2 transition hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                      <Icon size={13} strokeWidth={2.25} />
                    </span>
                    <div>
                      <p className="text-xs font-medium text-neutral-800 dark:text-neutral-100">{n.title}</p>
                      <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">{n.message}</p>
                      <p className="mt-0.5 text-[11px] text-neutral-400">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
