"use client";

import { Megaphone, FileText, Trash2 } from "lucide-react";

export default function AnnouncementCard({ announcement, onDelete }) {
  const isUrgent = announcement.priority === "Urgent";

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 dark:hover:shadow-none">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
            <Megaphone size={14} strokeWidth={2.25} />
          </span>
          <div>
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{announcement.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              {announcement.description}
            </p>
          </div>
        </div>
        {isUrgent && (
          <span className="shrink-0 rounded-full bg-rose-50 px-2 py-1 text-[11px] font-medium text-rose-700 dark:bg-rose-500/10 dark:text-rose-400">
            Urgent
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-neutral-100 pt-3 dark:border-neutral-800">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-400">
          <span>{announcement.createdByName}</span>
          <span>·</span>
          <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
          {announcement.expiryDate && (
            <>
              <span>·</span>
              <span>Expires {new Date(announcement.expiryDate).toLocaleDateString()}</span>
            </>
          )}
          {announcement.attachment && (
            <a
              href={announcement.attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-1 font-medium text-neutral-600 transition hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              <FileText size={11} /> {announcement.attachment.name}
            </a>
          )}
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(announcement.id)}
            title="Delete announcement"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
