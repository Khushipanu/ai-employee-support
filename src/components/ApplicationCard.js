"use client";

import { FileText } from "lucide-react";

const STATUS_STYLES = {
  Applied: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
  Shortlisted: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  Rejected: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
  Selected: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
};

const ACTIONS = ["Shortlisted", "Rejected", "Selected"];

export default function ApplicationCard({ application, onStatusChange }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 dark:hover:shadow-none">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{application.applicantName}</p>
          <p className="mt-0.5 text-xs text-neutral-400">{application.applicantEmail}</p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{application.jobTitle}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-medium ${
            STATUS_STYLES[application.status] || STATUS_STYLES.Applied
          }`}
        >
          {application.status}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-neutral-100 pt-3 dark:border-neutral-800">
        <div className="flex items-center gap-2 text-[11px] text-neutral-400">
          <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
          <a
            href={application.resume.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-1 font-medium text-neutral-600 transition hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            <FileText size={11} /> Resume
          </a>
        </div>
        {onStatusChange && (
          <div className="flex flex-wrap gap-1.5">
            {ACTIONS.filter((s) => s !== application.status).map((s) => (
              <button
                key={s}
                onClick={() => onStatusChange(application.id, s)}
                className="rounded-md border border-neutral-200 px-2 py-1 text-[11px] font-medium text-neutral-600 transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:bg-neutral-800"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
