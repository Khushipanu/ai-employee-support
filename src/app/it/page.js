"use client";

import { useEffect, useState } from "react";
import { Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardCard from "@/components/DashboardCard";
import TicketCard from "@/components/TicketCard";
import Sidebar from "@/components/Sidebar";
import Loader from "@/components/Loader";

function ITContent({ user }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  function loadTickets() {
    setLoading(true);
    fetch("/api/ticket?category=IT")
      .then((res) => res.json())
      .then((data) => setTickets(data.tickets || []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadTickets();
  }, []);

  async function patchTicket(body) {
    const res = await fetch("/api/ticket", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.ticket) {
      setTickets((prev) => prev.map((t) => (t.id === body.id ? data.ticket : t)));
    }
  }

  function handleStatusChange(id, status, replyText) {
    return patchTicket({
      id,
      status,
      reply: replyText ? { authorName: user.name, authorRole: user.role, text: replyText } : undefined,
    });
  }

  function handleReply(id, text) {
    return patchTicket({ id, reply: { authorName: user.name, authorRole: user.role, text } });
  }

  const filtered =
    filter === "All" ? tickets : tickets.filter((t) => t.status === filter);

  const filters = [
    { value: "All", label: "All", count: tickets.length },
    { value: "Open", label: "Open", count: tickets.filter((t) => t.status === "Open").length },
    {
      value: "In Progress",
      label: "In Progress",
      count: tickets.filter((t) => t.status === "In Progress").length,
    },
    {
      value: "Resolved",
      label: "Resolved",
      count: tickets.filter((t) => t.status === "Resolved").length,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">IT Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        All IT tickets raised by employees across the company.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <DashboardCard
          title="Open"
          value={tickets.filter((t) => t.status === "Open").length}
          icon={Clock}
          accent="amber"
        />
        <DashboardCard
          title="High Priority"
          value={tickets.filter((t) => t.priority === "High" && t.status !== "Resolved").length}
          icon={AlertTriangle}
          accent="rose"
        />
        <DashboardCard
          title="Resolved"
          value={tickets.filter((t) => t.status === "Resolved").length}
          icon={CheckCircle2}
          accent="emerald"
        />
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <Sidebar
          title="Filter"
          filters={filters}
          activeFilter={filter}
          onFilterChange={setFilter}
        />

        <div className="flex-1">
          {loading ? (
            <Loader label="Loading tickets..." />
          ) : filtered.length === 0 ? (
            <p className="text-sm text-neutral-400">No IT tickets found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {filtered.map((t) => (
                <TicketCard
                  key={t.id}
                  ticket={t}
                  showEmployee
                  onStatusChange={handleStatusChange}
                  onReply={handleReply}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ITPage() {
  return (
    <ProtectedRoute allowedRoles={["IT"]}>{(user) => <ITContent user={user} />}</ProtectedRoute>
  );
}
