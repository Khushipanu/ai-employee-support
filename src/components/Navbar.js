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
  Sparkles,
  Shield,
} from "lucide-react";
import { getSession, clearSession, onSessionChange } from "@/lib/session";
import { homeForRole } from "@/lib/roles";
import NotificationBell from "@/components/NotificationBell";
import UserMenu from "@/components/UserMenu";

const EMPLOYEE_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chat", label: "AI Chat", icon: MessagesSquare },
  { href: "/tickets", label: "Tickets", icon: Ticket },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
];

function linksForRole(role) {
  // Admin/HR/IT are scoped to their own management console only — they
  // resolve tickets raised by employees, they don't raise their own, so
  // they get no personal AI-chat/dashboard/ticket-history surface.
  if (role === "Admin") return [{ href: "/admin", label: "Admin", icon: Shield }];
  if (role === "HR") return [{ href: "/hr", label: "HR Dashboard", icon: Users }];
  if (role === "IT") return [{ href: "/it", label: "IT Dashboard", icon: Wrench }];

  return EMPLOYEE_LINKS;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getSession());
  }, [pathname]);

  useEffect(() => onSessionChange(() => setUser(getSession())), []);

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
          <Link href={homeForRole(user.role)} className="flex items-center gap-2">
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
          {user.role !== "Admin" && <NotificationBell email={user.email} />}
          <UserMenu user={user} onLogout={handleLogout} />
        </div>
      </div>
    </nav>
  );
}
