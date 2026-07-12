"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, MessagesSquare, Ticket, Users, Wrench, LogOut, Sparkles } from "lucide-react";
import { getSession, clearSession } from "@/lib/session";

const LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chat", label: "AI Chat", icon: MessagesSquare },
  { href: "/tickets", label: "My Tickets", icon: Ticket },
];

function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
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

  const links = [...LINKS];
  if (user.role === "HR") links.push({ href: "/hr", label: "HR Dashboard", icon: Users });
  if (user.role === "IT") links.push({ href: "/it", label: "IT Dashboard", icon: Wrench });

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-neutral-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-indigo-600 to-violet-600 text-white shadow-sm">
              <Sparkles size={15} strokeWidth={2.5} />
            </span>
            <span className="text-sm font-semibold tracking-tight text-neutral-900">
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
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                  }`}
                >
                  <Icon size={15} strokeWidth={2.25} />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-semibold text-white">
              {initials(user.name)}
            </span>
            <div className="leading-tight">
              <p className="text-sm font-medium text-neutral-800">{user.name}</p>
              <p className="text-xs text-neutral-400">{user.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}
