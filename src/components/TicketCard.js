import { Users, Wrench } from "lucide-react";

const STATUS_STYLES = {
  Open: "bg-amber-50 text-amber-700",
  "In Progress": "bg-blue-50 text-blue-700",
  Resolved: "bg-emerald-50 text-emerald-700",
};

const PRIORITY_STYLES = {
  High: "bg-rose-50 text-rose-700",
  Medium: "bg-amber-50 text-amber-700",
  Low: "bg-neutral-100 text-neutral-600",
};

const CATEGORY_ICON = { HR: Users, IT: Wrench };

export default function TicketCard({ ticket, onStatusChange, showEmployee = false }) {
  const CategoryIcon = CATEGORY_ICON[ticket.category] || Wrench;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-300 hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
            <CategoryIcon size={14} strokeWidth={2.25} />
          </span>
          <div>
            <p className="text-xs font-mono text-neutral-400">{ticket.id}</p>
            <p className="mt-0.5 text-sm font-medium text-neutral-800">{ticket.subject}</p>
            {showEmployee && (
              <p className="mt-1 text-xs text-neutral-400">
                {ticket.employeeName} · {ticket.employeeEmail}
              </p>
            )}
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-medium ${
            PRIORITY_STYLES[ticket.priority] || PRIORITY_STYLES.Low
          }`}
        >
          {ticket.priority}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-neutral-100 px-2 py-1 text-[11px] font-medium text-neutral-600">
            {ticket.category}
          </span>
          <span
            className={`rounded-full px-2 py-1 text-[11px] font-medium ${
              STATUS_STYLES[ticket.status] || STATUS_STYLES.Open
            }`}
          >
            {ticket.status}
          </span>
        </div>
        <span className="text-[11px] text-neutral-400">
          {new Date(ticket.createdAt).toLocaleDateString()}
        </span>
      </div>

      {onStatusChange && (
        <div className="mt-3 flex gap-1.5 border-t border-neutral-100 pt-3">
          {["Open", "In Progress", "Resolved"]
            .filter((s) => s !== ticket.status)
            .map((s) => (
              <button
                key={s}
                onClick={() => onStatusChange(ticket.id, s)}
                className="rounded-md border border-neutral-200 px-2 py-1 text-[11px] font-medium text-neutral-600 transition hover:border-neutral-300 hover:bg-neutral-50"
              >
                Mark {s}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
