"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, User, Moon, Sun, LogOut } from "lucide-react";
import { getStoredTheme, setStoredTheme } from "@/lib/theme";

function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    setDark(getStoredTheme() === "dark");
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleTheme() {
    const next = dark ? "light" : "dark";
    setStoredTheme(next);
    setDark(next === "dark");
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-semibold text-white dark:bg-indigo-600">
          {initials(user.name)}
        </span>
        <div className="hidden text-left leading-tight sm:block">
          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{user.name}</p>
          <p className="text-xs text-neutral-400">{user.role}</p>
        </div>
        <ChevronDown size={14} className="hidden text-neutral-400 sm:block" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
          <div className="border-b border-neutral-100 px-2.5 py-2 dark:border-neutral-800 sm:hidden">
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{user.name}</p>
            <p className="text-xs text-neutral-400">{user.email}</p>
          </div>

          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-neutral-700 transition hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-800/60"
          >
            <User size={15} strokeWidth={2.25} /> Profile
          </Link>

          <button
            onClick={toggleTheme}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-neutral-700 transition hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-800/60"
          >
            {dark ? <Sun size={15} strokeWidth={2.25} /> : <Moon size={15} strokeWidth={2.25} />}
            {dark ? "Light mode" : "Dark mode"}
          </button>

          <div className="my-1 border-t border-neutral-100 dark:border-neutral-800" />

          <button
            onClick={onLogout}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
          >
            <LogOut size={15} strokeWidth={2.25} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}
