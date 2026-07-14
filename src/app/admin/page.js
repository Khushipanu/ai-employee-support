"use client";

import { useEffect, useState } from "react";
import {
  UserPlus,
  Users,
  Shield,
  Wrench,
  UsersRound,
  Briefcase,
  Ticket,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardCard from "@/components/DashboardCard";
import TicketCard from "@/components/TicketCard";
import Sidebar from "@/components/Sidebar";
import Loader from "@/components/Loader";

const ROLES = ["Employee", "HR", "IT", "Admin"];

const ROLE_ICON = { Employee: Briefcase, HR: UsersRound, IT: Wrench, Admin: Shield };
const ROLE_STYLES = {
  Employee: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
  HR: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  IT: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
  Admin: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300",
};

const TABS = [
  { value: "tickets", label: "Tickets", icon: Ticket },
  { value: "employees", label: "Employees", icon: Users },
];

function TicketsTab({ user }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  function loadTickets() {
    setLoading(true);
    fetch("/api/ticket")
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

  const filtered = filter === "All" ? tickets : tickets.filter((t) => t.status === filter);

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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
        <Sidebar title="Filter" filters={filters} activeFilter={filter} onFilterChange={setFilter} />

        <div className="flex-1">
          {loading ? (
            <Loader label="Loading tickets..." />
          ) : filtered.length === 0 ? (
            <p className="text-sm text-neutral-400">No tickets found.</p>
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

function EmployeesTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Employee",
    department: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function loadUsers() {
    setLoading(true);
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.users || []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not add employee.");
        return;
      }
      setSuccess(`${data.user.name} was added successfully.`);
      setForm({ name: "", email: "", password: "", role: "Employee", department: "" });
      loadUsers();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const counts = ROLES.reduce((acc, r) => {
    acc[r] = users.filter((u) => u.role === r).length;
    return acc;
  }, {});

  const inputClass =
    "w-full rounded-lg border border-neutral-200 bg-neutral-50/50 px-3 py-2 text-sm outline-none transition placeholder:text-neutral-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-indigo-500 dark:focus:bg-neutral-900 dark:focus:ring-indigo-500/20";

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <DashboardCard title="Total" value={users.length} icon={Users} accent="indigo" />
        <DashboardCard title="HR" value={counts.HR || 0} icon={UsersRound} accent="amber" />
        <DashboardCard title="IT" value={counts.IT || 0} icon={Wrench} accent="emerald" />
        <DashboardCard title="Admins" value={counts.Admin || 0} icon={Shield} accent="rose" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
        <div className="h-fit rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <UserPlus size={16} />
            </span>
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Add Employee</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              required
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
            />
            <input
              required
              type="text"
              placeholder="Temporary password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={inputClass}
            />
            <input
              required
              placeholder="Department"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className={inputClass}
            />
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className={inputClass}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            {error && (
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                {error}
              </p>
            )}
            {success && (
              <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60 dark:bg-indigo-600 dark:hover:bg-indigo-500"
            >
              {submitting ? "Adding..." : "Add Employee"}
            </button>
          </form>
        </div>

        <div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
            All Employees
          </h2>
          {loading ? (
            <Loader label="Loading employees..." />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {users.map((u) => {
                const RoleIcon = ROLE_ICON[u.role] || Briefcase;
                return (
                  <div
                    key={u.id}
                    className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                        <RoleIcon size={15} strokeWidth={2.25} />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{u.name}</p>
                        <p className="text-xs text-neutral-400">{u.email}</p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-[11px] font-medium ${
                        ROLE_STYLES[u.role] || ROLE_STYLES.Employee
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminContent({ user }) {
  const [tab, setTab] = useState("tickets");

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        Admin Dashboard
      </h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        Monitor company-wide tickets and manage employee accounts.
      </p>

      <div className="mt-6 inline-flex gap-1 rounded-full border border-neutral-200 bg-white p-1 dark:border-neutral-800 dark:bg-neutral-900">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.value;
          return (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
              }`}
            >
              <Icon size={15} strokeWidth={2.25} />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">{tab === "tickets" ? <TicketsTab user={user} /> : <EmployeesTab />}</div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={["Admin"]}>{(user) => <AdminContent user={user} />}</ProtectedRoute>
  );
}
