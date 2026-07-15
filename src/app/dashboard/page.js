"use client";

import { useEffect, useState } from "react";
import { Megaphone, Mail, CalendarDays, UsersRound } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import AnnouncementCard from "@/components/AnnouncementCard";
import TodayTasks from "@/components/TodayTasks";
import Loader from "@/components/Loader";

function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

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

      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-center">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white dark:bg-indigo-600">
          {initials(user.name)}
        </span>
        <div className="grid flex-1 grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-3">
          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
            <UsersRound size={15} className="shrink-0 text-neutral-400" />
            {user.department}
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
            <Mail size={15} className="shrink-0 text-neutral-400" />
            {user.email}
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
            <CalendarDays size={15} className="shrink-0 text-neutral-400" />
            {user.joiningDate
              ? `Joined ${new Date(user.joiningDate).toLocaleDateString()}`
              : "Joining date not on file"}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <TodayTasks employeeEmail={user.email} />
      </div>

      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              <Megaphone size={16} strokeWidth={2.25} />
            </span>
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Announcements</h2>
          </div>
          {announcements.length > 0 && (
            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
              {announcements.length}
            </span>
          )}
        </div>

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
