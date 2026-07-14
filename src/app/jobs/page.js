"use client";

import { useEffect, useState } from "react";
import { Briefcase } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import JobCard from "@/components/JobCard";
import Modal from "@/components/Modal";
import Loader from "@/components/Loader";

const inputClass =
  "w-full rounded-lg border border-neutral-200 bg-neutral-50/50 px-3 py-2 text-sm outline-none transition placeholder:text-neutral-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-indigo-500 dark:focus:bg-neutral-900 dark:focus:ring-indigo-500/20";

function ApplyModal({ job, user, onClose, onApplied }) {
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;
    setError("");
    setSubmitting(true);
    try {
      const body = new FormData();
      body.append("jobId", job.id);
      body.append("applicantName", user.name);
      body.append("applicantEmail", user.email);
      body.append("resume", file);

      const res = await fetch("/api/applications", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not submit application.");
        return;
      }
      onApplied(data.application);
      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal title={`Apply — ${job.title}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Applying as <span className="font-medium text-neutral-700 dark:text-neutral-200">{user.name}</span> (
          {user.email})
        </p>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">
            Resume — PDF
          </label>
          <input
            required
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
          disabled={submitting || !file}
          className="w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60 dark:bg-indigo-600 dark:hover:bg-indigo-500"
        >
          {submitting ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </Modal>
  );
}

function JobsContent({ user }) {
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingTo, setApplyingTo] = useState(null);

  function loadJobs() {
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data.jobs || []));
  }

  function loadApplications() {
    fetch(`/api/applications?applicantEmail=${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then((data) => setMyApplications(data.applications || []));
  }

  useEffect(() => {
    Promise.all([loadJobs(), loadApplications()]).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusByJob = myApplications.reduce((acc, a) => {
    acc[a.jobId] = a.status;
    return acc;
  }, {});

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        Internal Job Postings
      </h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        Open vacancies across the company. Apply directly with your resume.
      </p>

      <div className="mt-6">
        {loading ? (
          <Loader label="Loading job postings..." />
        ) : jobs.length === 0 ? (
          <p className="text-sm text-neutral-400">No open positions right now.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {jobs.map((j) => (
              <JobCard
                key={j.id}
                job={j}
                appliedStatus={statusByJob[j.id]}
                onApply={() => setApplyingTo(j)}
              />
            ))}
          </div>
        )}
      </div>

      {myApplications.length > 0 && (
        <div className="mt-9">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
            My Applications
          </h2>
          <div className="space-y-2">
            {myApplications.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                    <Briefcase size={14} strokeWidth={2.25} />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{a.jobTitle}</p>
                    <p className="text-xs text-neutral-400">
                      Applied {new Date(a.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {applyingTo && (
        <ApplyModal
          job={applyingTo}
          user={user}
          onClose={() => setApplyingTo(null)}
          onApplied={(application) => setMyApplications((prev) => [application, ...prev])}
        />
      )}
    </div>
  );
}

export default function JobsPage() {
  return (
    <ProtectedRoute allowedRoles={["Employee", "HR", "IT"]}>
      {(user) => <JobsContent user={user} />}
    </ProtectedRoute>
  );
}
