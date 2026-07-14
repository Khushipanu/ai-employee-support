"use client";

import { useEffect, useState } from "react";
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Ticket,
  Megaphone,
  Briefcase,
  Plus,
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardCard from "@/components/DashboardCard";
import TicketCard from "@/components/TicketCard";
import AnnouncementCard from "@/components/AnnouncementCard";
import JobCard from "@/components/JobCard";
import ApplicationCard from "@/components/ApplicationCard";
import Sidebar from "@/components/Sidebar";
import Loader from "@/components/Loader";
import { DEPARTMENTS } from "@/lib/departments";

const TABS = [
  { value: "tickets", label: "Tickets", icon: Ticket },
  { value: "announcements", label: "Announcements", icon: Megaphone },
  { value: "jobs", label: "Job Postings", icon: Briefcase },
];

const inputClass =
  "w-full rounded-lg border border-neutral-200 bg-neutral-50/50 px-3 py-2 text-sm outline-none transition placeholder:text-neutral-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-indigo-500 dark:focus:bg-neutral-900 dark:focus:ring-indigo-500/20";

function TicketsTab({ user }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  function loadTickets() {
    setLoading(true);
    fetch("/api/ticket?category=HR")
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
            <p className="text-sm text-neutral-400">No HR tickets found.</p>
          ) : (
            <div className="max-w-2xl space-y-3">
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

function AnnouncementsTab({ user }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "", priority: "Normal", expiryDate: "" });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function loadAnnouncements() {
    setLoading(true);
    fetch("/api/announcements?all=true")
      .then((res) => res.json())
      .then((data) => setAnnouncements(data.announcements || []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const body = new FormData();
      body.append("title", form.title);
      body.append("description", form.description);
      body.append("priority", form.priority);
      if (form.expiryDate) body.append("expiryDate", form.expiryDate);
      body.append("createdByName", user.name);
      body.append("createdByEmail", user.email);
      if (file) body.append("attachment", file);

      const res = await fetch("/api/announcements", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not post announcement.");
        return;
      }
      setForm({ title: "", description: "", priority: "Normal", expiryDate: "" });
      setFile(null);
      loadAnnouncements();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    await fetch(`/api/announcements?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
      <div className="h-fit rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <Plus size={16} />
          </span>
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">New Announcement</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            required
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputClass}
          />
          <textarea
            required
            rows={3}
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={`${inputClass} resize-none`}
          />
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            className={inputClass}
          >
            <option value="Normal">Normal</option>
            <option value="Urgent">Urgent</option>
          </select>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">
              Expiry date (optional)
            </label>
            <input
              type="date"
              value={form.expiryDate}
              onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">
              Attachment — PDF (optional)
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-neutral-500 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-100 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-neutral-600 dark:text-neutral-400 dark:file:bg-neutral-800 dark:file:text-neutral-300"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60 dark:bg-indigo-600 dark:hover:bg-indigo-500"
          >
            {submitting ? "Posting..." : "Post to All Employees"}
          </button>
        </form>
      </div>

      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Posted Announcements
        </h2>
        {loading ? (
          <Loader label="Loading announcements..." />
        ) : announcements.length === 0 ? (
          <p className="text-sm text-neutral-400">No announcements posted yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {announcements.map((a) => (
              <AnnouncementCard key={a.id} announcement={a} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function JobsTab({ user }) {
  const [subTab, setSubTab] = useState("postings");
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApps, setLoadingApps] = useState(true);
  const [form, setForm] = useState({
    title: "",
    department: "",
    eligibility: "",
    experience: "",
    deadline: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function loadJobs() {
    setLoadingJobs(true);
    fetch("/api/jobs?all=true")
      .then((res) => res.json())
      .then((data) => setJobs(data.jobs || []))
      .finally(() => setLoadingJobs(false));
  }

  function loadApplications() {
    setLoadingApps(true);
    fetch("/api/applications")
      .then((res) => res.json())
      .then((data) => setApplications(data.applications || []))
      .finally(() => setLoadingApps(false));
  }

  useEffect(() => {
    loadJobs();
    loadApplications();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, createdByName: user.name, createdByEmail: user.email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not publish job posting.");
        return;
      }
      setForm({ title: "", department: "", eligibility: "", experience: "", deadline: "", description: "" });
      loadJobs();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteJob(id) {
    await fetch(`/api/jobs?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    setJobs((prev) => prev.filter((j) => j.id !== id));
  }

  async function handleStatusChange(id, status) {
    const res = await fetch("/api/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const data = await res.json();
    if (data.application) {
      setApplications((prev) => prev.map((a) => (a.id === id ? data.application : a)));
    }
  }

  const applicantCountByJob = applications.reduce((acc, a) => {
    acc[a.jobId] = (acc[a.jobId] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-4 inline-flex gap-1 rounded-full border border-neutral-200 bg-white p-1 dark:border-neutral-800 dark:bg-neutral-900">
        {[
          { value: "postings", label: "Postings" },
          { value: "applications", label: "Applications" },
        ].map((t) => (
          <button
            key={t.value}
            onClick={() => setSubTab(t.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              subTab === t.value
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {subTab === "postings" ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
          <div className="h-fit rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                <Plus size={16} />
              </span>
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">New Job Posting</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                required
                placeholder="Job title (e.g. Senior Software Engineer)"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputClass}
              />
              <select
                required
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className={inputClass}
              >
                <option value="" disabled>
                  Select department
                </option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <input
                required
                placeholder="Eligibility criteria"
                value={form.eligibility}
                onChange={(e) => setForm({ ...form, eligibility: e.target.value })}
                className={inputClass}
              />
              <input
                required
                placeholder="Required experience (e.g. 3+ years)"
                value={form.experience}
                onChange={(e) => setForm({ ...form, experience: e.target.value })}
                className={inputClass}
              />
              <div>
                <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                  Application deadline (optional)
                </label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  className={inputClass}
                />
              </div>
              <textarea
                required
                rows={3}
                placeholder="Role description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={`${inputClass} resize-none`}
              />

              {error && (
                <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60 dark:bg-indigo-600 dark:hover:bg-indigo-500"
              >
                {submitting ? "Publishing..." : "Publish Vacancy"}
              </button>
            </form>
          </div>

          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Open Vacancies
            </h2>
            {loadingJobs ? (
              <Loader label="Loading job postings..." />
            ) : jobs.length === 0 ? (
              <p className="text-sm text-neutral-400">No job postings yet.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {jobs.map((j) => (
                  <JobCard
                    key={j.id}
                    job={j}
                    applicantCount={applicantCountByJob[j.id] || 0}
                    onDelete={handleDeleteJob}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : loadingApps ? (
        <Loader label="Loading applications..." />
      ) : applications.length === 0 ? (
        <p className="text-sm text-neutral-400">No applications received yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {applications.map((a) => (
            <ApplicationCard key={a.id} application={a} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </div>
  );
}

function HRContent({ user }) {
  const [tab, setTab] = useState("tickets");

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">HR Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        Manage tickets, company announcements, and internal job postings.
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

      <div className="mt-6">
        {tab === "tickets" && <TicketsTab user={user} />}
        {tab === "announcements" && <AnnouncementsTab user={user} />}
        {tab === "jobs" && <JobsTab user={user} />}
      </div>
    </div>
  );
}

export default function HRPage() {
  return (
    <ProtectedRoute allowedRoles={["HR"]}>{(user) => <HRContent user={user} />}</ProtectedRoute>
  );
}
