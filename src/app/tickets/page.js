"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import TicketColumns from "@/components/TicketColumns";
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

  async function handleReply(id, text) {
    const res = await fetch("/api/ticket", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, reply: { authorName: user.name, authorRole: user.role, text } }),
    });
    const data = await res.json();
    if (data.ticket) {
      setTickets((prev) => prev.map((t) => (t.id === id ? data.ticket : t)));
    }
  }

  // Employees may only delete tickets that are already resolved — open ones
  // still need to be tracked/handled by HR or IT. Deleting only removes the
  // ticket from this employee's own view; HR/IT still see it on their side.
  async function handleDelete(id) {
    const scope = `employee:${user.email}`;
    await fetch(`/api/ticket?id=${encodeURIComponent(id)}&scope=${encodeURIComponent(scope)}`, {
      method: "DELETE",
    });
    setTickets((prev) => prev.filter((t) => t.id !== id));
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
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">Ticket History</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
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
          ) : (
            <TicketColumns
              tickets={filtered}
              filter={filter}
              onReply={handleReply}
              onDelete={handleDelete}
              deleteRestricted
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function TicketsPage() {
  return (
    <ProtectedRoute allowedRoles={["Employee"]}>
      {(user) => <TicketsContent user={user} />}
    </ProtectedRoute>
  );
}
