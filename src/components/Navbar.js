"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  MessagesSquare,
  Ticket,
  Users,
  Wrench,
  Briefcase,
  LogOut,
  Sparkles,
  Shield,
  Sun,
  Moon,
} from "lucide-react";
import { getSession, clearSession } from "@/lib/session";
import { getStoredTheme, setStoredTheme } from "@/lib/theme";
import NotificationBell from "@/components/NotificationBell";

const EMPLOYEE_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chat", label: "AI Chat", icon: MessagesSquare },
  { href: "/tickets", label: "My Tickets", icon: Ticket },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
];

function linksForRole(role) {
  // Admin is scoped to the tickets/employees console only — no personal
  // AI-chat/dashboard surface, so it gets its own link set.
  if (role === "Admin") return [{ href: "/admin", label: "Admin", icon: Shield }];

  const links = [...EMPLOYEE_LINKS];
  if (role === "HR") links.push({ href: "/hr", label: "HR Dashboard", icon: Users });
  if (role === "IT") links.push({ href: "/it", label: "IT Dashboard", icon: Wrench });
  return links;
}

function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(getStoredTheme() === "dark");
  }, []);

  function toggle() {
    const next = dark ? "light" : "dark";
    setStoredTheme(next);
    setDark(next === "dark");
  }

  return (
    <button
      onClick={toggle}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getSession());
  }, [pathname]);

  if (pathname === "/login" || pathname === "/") return null;
  if (!user) return null;

  const links = linksForRole(user.role);

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-neutral-200/70 bg-white/80 backdrop-blur-md dark:border-neutral-800/70 dark:bg-neutral-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href={user.role === "Admin" ? "/admin" : "/dashboard"} className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-indigo-600 to-violet-600 text-white shadow-sm">
              <Sparkles size={15} strokeWidth={2.5} />
            </span>
            <span className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Zeera Support
            </span>
          </Link>

          <div className="hidden items-center gap-1 sm:flex">
            {links.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                      : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                  }`}
                >
                  <Icon size={15} strokeWidth={2.25} />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="hidden items-center gap-2 pr-1.5 sm:flex">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-semibold text-white dark:bg-indigo-600">
              {initials(user.name)}
            </span>
            <div className="leading-tight">
              <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{user.name}</p>
              <p className="text-xs text-neutral-400">{user.role}</p>
            </div>
          </div>
          {user.role !== "Admin" && <NotificationBell email={user.email} />}
          <ThemeToggle />
          <button
            onClick={handleLogout}
            title="Log out"
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}
