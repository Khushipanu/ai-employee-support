"use client";

import { Clock, CheckCircle2 } from "lucide-react";
import TicketCard from "@/components/TicketCard";

// Default ("All") view splits tickets into two clearly labeled sides —
// unresolved (Open/In Progress) and Resolved — so it's easy to see what
// still needs attention vs what's already handled. Picking a specific
// status filter collapses back to a single list of just that status.
export default function TicketColumns({
  tickets,
  filter,
  showEmployee = false,
  onStatusChange,
  onReply,
  onDelete,
  deleteRestricted = false,
}) {
  const cardProps = { showEmployee, onStatusChange, onReply, onDelete, deleteRestricted };

  if (filter !== "All") {
    return tickets.length === 0 ? (
      <p className="text-sm text-neutral-400">No tickets found.</p>
    ) : (
      <div className="max-w-2xl space-y-3">
        {tickets.map((t) => (
          <TicketCard key={t.id} ticket={t} {...cardProps} />
        ))}
      </div>
    );
  }

  const unresolved = tickets.filter((t) => t.status !== "Resolved");
  const resolved = tickets.filter((t) => t.status === "Resolved");

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div>
        <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
          <Clock size={13} strokeWidth={2.25} />
          Unresolved
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
            {unresolved.length}
          </span>
        </div>
        {unresolved.length === 0 ? (
          <p className="text-sm text-neutral-400">Nothing waiting on you.</p>
        ) : (
          <div className="space-y-3">
            {unresolved.map((t) => (
              <TicketCard key={t.id} ticket={t} {...cardProps} />
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 size={13} strokeWidth={2.25} />
          Resolved
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
            {resolved.length}
          </span>
        </div>
        {resolved.length === 0 ? (
          <p className="text-sm text-neutral-400">No resolved tickets yet.</p>
        ) : (
          <div className="space-y-3">
            {resolved.map((t) => (
              <TicketCard key={t.id} ticket={t} {...cardProps} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
