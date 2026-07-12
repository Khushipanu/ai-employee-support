export default function Sidebar({ title, filters, activeFilter, onFilterChange }) {
  return (
    <aside className="w-full shrink-0 rounded-2xl border border-neutral-200 bg-white p-3 sm:w-44">
      <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
        {title}
      </p>
      <div className="flex flex-row flex-wrap gap-1 sm:flex-col">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
              activeFilter === f.value
                ? "bg-indigo-50 text-indigo-700"
                : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
            }`}
          >
            {f.label}
            {typeof f.count === "number" && (
              <span className="ml-2 text-xs text-neutral-400">{f.count}</span>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
}
