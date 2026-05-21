"use client";

import { useState, useTransition } from "react";
import type { DragEvent } from "react";
import type { Announcement } from "@/types/firestore";
import { AdminDateInput } from "@/components/admin-date-input";
import {
  deleteAnnouncement,
  reorderAnnouncements,
  updateAnnouncement,
} from "../actions";

const inputClass =
  "mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white [color-scheme:dark]";
const dateInputClass =
  "admin-date-input w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 pr-11 text-sm text-white [color-scheme:dark]";

type AnnouncementListProps = {
  announcements: Announcement[];
};

function reorderItems(
  items: Announcement[],
  activeId: string,
  overId: string,
): Announcement[] {
  const activeIndex = items.findIndex((item) => item.id === activeId);
  const overIndex = items.findIndex((item) => item.id === overId);
  if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) return items;

  const next = [...items];
  const [moved] = next.splice(activeIndex, 1);
  next.splice(overIndex, 0, moved);
  return next.map((item, index) => ({ ...item, sortOrder: index }));
}

export function AnnouncementList({ announcements }: AnnouncementListProps) {
  const [items, setItems] = useState(announcements);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function persistOrder(nextItems: Announcement[]) {
    startTransition(async () => {
      await reorderAnnouncements(nextItems.map((item) => item.id));
    });
  }

  function handleDrop(event: DragEvent<HTMLLIElement>, overId: string) {
    event.preventDefault();
    if (!draggedId) return;

    const nextItems = reorderItems(items, draggedId, overId);
    setItems(nextItems);
    setDraggedId(null);
    setDropTargetId(null);
    persistOrder(nextItems);
  }

  if (items.length === 0) {
    return <p className="mt-4 text-sm text-zinc-400">No announcements yet.</p>;
  }

  return (
    <>
      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-zinc-400">
        <p>Drag announcement cards to change the home page display order.</p>
        {isPending ? <p className="shrink-0 text-[var(--tf-neon)]">Saving order...</p> : null}
      </div>
      <ul className="mt-4 space-y-3">
        {items.map((announcement) => (
          <li
            key={announcement.id}
            draggable
            aria-label={`Drag ${announcement.title} to reorder`}
            onDragStart={(event) => {
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/plain", announcement.id);
              setDraggedId(announcement.id);
            }}
            onDragEnd={() => {
              setDraggedId(null);
              setDropTargetId(null);
            }}
            onDragEnter={(event) => {
              event.preventDefault();
              if (draggedId && draggedId !== announcement.id) {
                setDropTargetId(announcement.id);
              }
            }}
            onDragOver={(event) => {
              event.preventDefault();
              if (draggedId && draggedId !== announcement.id) {
                setDropTargetId(announcement.id);
              }
            }}
            onDrop={(event) => handleDrop(event, announcement.id)}
            className={`relative cursor-grab rounded-xl border bg-zinc-900/40 p-4 text-sm text-zinc-100 transition active:cursor-grabbing ${
              draggedId === announcement.id
                ? "border-[var(--tf-neon)]/70 opacity-60"
                : "border-white/10"
            }`}
          >
            {dropTargetId === announcement.id ? (
              <span
                aria-hidden="true"
                className="absolute -top-2 left-4 right-4 h-1 rounded-full bg-[var(--tf-neon)] shadow-[0_0_14px_rgba(57,255,20,0.7)]"
              />
            ) : null}
            <div className="flex items-start gap-2">
              <span
                aria-hidden="true"
                className="mt-1 flex h-9 w-7 shrink-0 flex-col items-center justify-center gap-1 px-1 text-zinc-400 transition hover:text-[var(--tf-neon)]"
              >
                <span className="h-0.5 w-4 rounded-full bg-current" />
                <span className="h-0.5 w-4 rounded-full bg-current" />
                <span className="h-0.5 w-4 rounded-full bg-current" />
              </span>
              <details className="min-w-0 flex-1">
                <summary className="grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-white">
                      {announcement.title}
                    </span>
                    <span className="block truncate text-xs text-zinc-400">
                      {[
                        announcement.isPinned ? "Pinned" : undefined,
                        announcement.isPublished ? "Published" : "Draft",
                        announcement.label,
                        announcement.dateISO,
                      ]
                        .filter(Boolean)
                        .join(" - ")}
                    </span>
                  </span>
                  <span className="rounded-full border border-[var(--tf-neon)]/40 px-4 py-1.5 text-xs font-semibold text-[var(--tf-neon)] hover:bg-[var(--tf-neon)]/10">
                    Edit
                  </span>
                </summary>
                <form action={updateAnnouncement} className="mt-4 grid gap-3 md:grid-cols-2">
                  <input type="hidden" name="id" value={announcement.id} />
                  <AnnouncementFields announcement={announcement} />
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white hover:bg-white/15"
                    >
                      Save changes
                    </button>
                  </div>
                </form>
              </details>
              <form action={deleteAnnouncement} className="shrink-0">
                <input type="hidden" name="id" value={announcement.id} />
                <button
                  type="submit"
                  className="rounded-full border border-red-500/40 px-4 py-1.5 text-xs font-semibold text-red-200 hover:bg-red-950/40"
                >
                  Delete
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export function AnnouncementFields({
  announcement,
}: {
  announcement?: Announcement;
}) {
  return (
    <>
      <label className="text-xs font-medium text-zinc-300 md:col-span-2">
        Title
        <input
          name="title"
          required
          defaultValue={announcement?.title ?? ""}
          placeholder="Parent meeting Thursday"
          className={inputClass}
        />
      </label>
      <label className="text-xs font-medium text-zinc-300 md:col-span-2">
        Body
        <textarea
          name="body"
          required
          rows={4}
          defaultValue={announcement?.body ?? ""}
          placeholder="Add the short update people need to see on the home page."
          className={inputClass}
        />
      </label>
      <label className="text-xs font-medium text-zinc-300">
        Label
        <input
          name="label"
          defaultValue={announcement?.label ?? ""}
          placeholder="Game Week"
          className={inputClass}
        />
      </label>
      <label className="text-xs font-medium text-zinc-300">
        Date
        <AdminDateInput
          name="dateISO"
          type="date"
          defaultValue={announcement?.dateISO ?? ""}
          className={dateInputClass}
        />
      </label>
      <label className="text-xs font-medium text-zinc-300">
        Link URL
        <input
          name="href"
          defaultValue={announcement?.href ?? ""}
          placeholder="/schedule or https://..."
          className={inputClass}
        />
      </label>
      <label className="text-xs font-medium text-zinc-300">
        Link label
        <input
          name="linkLabel"
          defaultValue={announcement?.linkLabel ?? ""}
          placeholder="View details"
          className={inputClass}
        />
      </label>
      <input name="sortOrder" type="hidden" defaultValue={announcement?.sortOrder ?? 0} />
      <div className="grid content-end gap-3 sm:grid-cols-2">
        <label className="flex items-center gap-2 text-xs font-medium text-zinc-200">
          <input
            name="isPinned"
            type="checkbox"
            defaultChecked={announcement?.isPinned ?? false}
            className="h-4 w-4 rounded border-white/20 bg-zinc-950 accent-[var(--tf-neon)]"
          />
          Pin first
        </label>
        <label className="flex items-center gap-2 text-xs font-medium text-zinc-200">
          <input
            name="isPublished"
            type="checkbox"
            defaultChecked={announcement?.isPublished ?? true}
            className="h-4 w-4 rounded border-white/20 bg-zinc-950 accent-[var(--tf-neon)]"
          />
          Published
        </label>
      </div>
    </>
  );
}
