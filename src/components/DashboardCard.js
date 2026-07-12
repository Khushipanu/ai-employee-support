const ACCENTS = {
  indigo: "bg-indigo-50 text-indigo-600",
  amber: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600",
  rose: "bg-rose-50 text-rose-600",
};

export default function DashboardCard({ title, value, subtitle, icon: Icon, accent = "indigo" }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-300 hover:shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-neutral-500">{title}</p>
        {Icon && (
          <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${ACCENTS[accent] || ACCENTS.indigo}`}>
            <Icon size={16} strokeWidth={2.25} />
          </span>
        )}
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900">{value}</p>
      {subtitle && <p className="mt-1 text-xs text-neutral-400">{subtitle}</p>}
    </div>
  );
}
