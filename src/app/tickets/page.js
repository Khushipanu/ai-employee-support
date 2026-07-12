"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import TicketCard from "@/components/TicketCard";
import Sidebar from "@/components/Sidebar";
import Loader from "@/components/Loader";

function TicketsContent({ user }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch(`/api/ticket?employeeEmail=${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then((data) => setTickets(data.tickets || []))
      .finally(() => setLoading(false));
  }, [user.email]);

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
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Ticket History</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Support tickets you've raised through the AI assistant.
      </p>

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
            <p className="text-sm text-neutral-400">No tickets found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {filtered.map((t) => (
                <TicketCard key={t.id} ticket={t} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TicketsPage() {
  return <ProtectedRoute>{(user) => <TicketsContent user={user} />}</ProtectedRoute>;
}
