"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Ticket, Clock, CheckCircle2, MessagesSquare, History, ArrowRight } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardCard from "@/components/DashboardCard";
import TicketCard from "@/components/TicketCard";
import Loader from "@/components/Loader";

function DashboardContent({ user }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/ticket?employeeEmail=${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then((data) => setTickets(data.tickets || []))
      .finally(() => setLoading(false));
  }, [user.email]);

  const open = tickets.filter((t) => t.status !== "Resolved").length;
  const resolved = tickets.filter((t) => t.status === "Resolved").length;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
        Welcome back, {user.name.split(" ")[0]}
      </h1>
      <p className="mt-1 text-sm text-neutral-500">
        {user.department} · {user.role}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <DashboardCard title="Your Tickets" value={tickets.length} icon={Ticket} accent="indigo" />
        <DashboardCard title="Open / In Progress" value={open} icon={Clock} accent="amber" />
        <DashboardCard title="Resolved" value={resolved} icon={CheckCircle2} accent="emerald" />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/chat"
          className="group flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          <MessagesSquare size={15} />
          Ask AI Assistant
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link
          href="/tickets"
          className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50"
        >
          <History size={15} />
          View Ticket History
        </Link>
      </div>

      <div className="mt-9">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Recent Tickets
        </h2>
        {loading ? (
          <Loader label="Loading tickets..." />
        ) : tickets.length === 0 ? (
          <p className="text-sm text-neutral-400">
            No tickets yet. Ask the AI assistant a question to get started.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {tickets.slice(0, 4).map((t) => (
              <TicketCard key={t.id} ticket={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <ProtectedRoute>{(user) => <DashboardContent user={user} />}</ProtectedRoute>;
}
