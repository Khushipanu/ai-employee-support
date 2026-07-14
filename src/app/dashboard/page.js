"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessagesSquare, ArrowRight } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import AnnouncementCard from "@/components/AnnouncementCard";
import Loader from "@/components/Loader";

function DashboardContent({ user }) {
  const [announcements, setAnnouncements] = useState([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/announcements")
      .then((res) => res.json())
      .then((data) => setAnnouncements(data.announcements || []))
      .finally(() => setAnnouncementsLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        Welcome back, {user.name.split(" ")[0]}
      </h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        {user.department} · {user.role}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/chat"
          className="group flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-indigo-600 dark:hover:bg-indigo-500"
        >
          <MessagesSquare size={15} />
          Ask AI Assistant
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="mt-9">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Announcements
        </h2>
        {announcementsLoading ? (
          <Loader label="Loading announcements..." />
        ) : announcements.length === 0 ? (
          <p className="text-sm text-neutral-400">No announcements right now.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {announcements.map((a) => (
              <AnnouncementCard key={a.id} announcement={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["Employee"]}>
      {(user) => <DashboardContent user={user} />}
    </ProtectedRoute>
  );
}
