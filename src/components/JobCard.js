"use client";

import { Briefcase, Calendar, GraduationCap, Trash2 } from "lucide-react";

export default function JobCard({ job, applicantCount, onApply, onDelete, appliedStatus }) {
  const pastDeadline = job.deadline && new Date(job.deadline) < new Date();

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 dark:hover:shadow-none">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
            <Briefcase size={14} strokeWidth={2.25} />
          </span>
          <div>
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{job.title}</p>
            <p className="mt-0.5 text-xs text-neutral-400">{job.department}</p>
          </div>
        </div>
        {typeof applicantCount === "number" && (
          <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-1 text-[11px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
            {applicantCount} applicant{applicantCount === 1 ? "" : "s"}
          </span>
        )}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">{job.description}</p>

      <div className="mt-3 space-y-1.5 border-t border-neutral-100 pt-3 text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        <p className="flex items-start gap-1.5">
          <GraduationCap size={13} className="mt-0.5 shrink-0" />
          <span>
            <span className="font-medium text-neutral-600 dark:text-neutral-300">Eligibility:</span>{" "}
            {job.eligibility} · {job.experience}
          </span>
        </p>
        {job.deadline && (
          <p className="flex items-center gap-1.5">
            <Calendar size={13} className="shrink-0" />
            <span>
              Apply by {new Date(job.deadline).toLocaleDateString()}
              {pastDeadline && " · closed"}
            </span>
          </p>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-neutral-100 pt-3 dark:border-neutral-800">
        <span className="text-[11px] text-neutral-400">
          Posted {new Date(job.createdAt).toLocaleDateString()}
        </span>
        <div className="flex items-center gap-1.5">
          {appliedStatus && (
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
              {appliedStatus}
            </span>
          )}
          {onApply && !appliedStatus && (
            <button
              onClick={onApply}
              disabled={pastDeadline}
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-[11px] font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Apply
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(job.id)}
              title="Delete posting"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
