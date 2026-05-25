"use client";

import { useState, useTransition } from "react";
import type { DragEvent } from "react";
import type { Announcement } from "@/types/firestore";
import {
  deleteAnnouncement,
  reorderAnnouncements,
  updateAnnouncement,
} from "../actions";

const inputClass =
  "mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white [color-scheme:dark]";
const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});
const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});
const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
  const [openItemIds, setOpenItemIds] = useState<Set<string>>(new Set());
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
    if (!draggedId || openItemIds.has(overId)) return;

    const nextItems = reorderItems(items, draggedId, overId);
    setItems(nextItems);
    setDraggedId(null);
    setDropTargetId(null);
    persistOrder(nextItems);
  }

  function handleDetailsToggle(id: string, isOpen: boolean) {
    setOpenItemIds((current) => {
      const next = new Set(current);
      if (isOpen) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });

    if (isOpen) {
      setDropTargetId((current) => (current === id ? null : current));
    }
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
        {items.map((announcement) => {
          const isOpen = openItemIds.has(announcement.id);
          const dateSummary = (
            announcement.dateISOs?.length
              ? announcement.dateISOs
              : [announcement.dateStartISO ?? announcement.dateISO, announcement.dateEndISO]
          )
            .filter(Boolean)
            .join(", ");

          return (
            <li
              key={announcement.id}
              draggable={!isOpen}
              aria-label={isOpen ? undefined : `Drag ${announcement.title} to reorder`}
              onDragStart={(event) => {
                if (isOpen) {
                  event.preventDefault();
                  return;
                }

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
                if (draggedId && draggedId !== announcement.id && !isOpen) {
                  setDropTargetId(announcement.id);
                }
              }}
              onDragOver={(event) => {
                event.preventDefault();
                if (draggedId && draggedId !== announcement.id && !isOpen) {
                  setDropTargetId(announcement.id);
                }
              }}
              onDrop={(event) => handleDrop(event, announcement.id)}
              className={`relative rounded-xl border bg-zinc-900/40 p-4 text-sm text-zinc-100 transition ${
                isOpen ? "cursor-default" : "cursor-grab active:cursor-grabbing"
              } ${
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
                <details
                  className="min-w-0 flex-1"
                  onToggle={(event) =>
                    handleDetailsToggle(announcement.id, event.currentTarget.open)
                  }
                >
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
                        dateSummary,
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
          );
        })}
      </ul>
    </>
  );
}

function initialAnnouncementDates(announcement?: Announcement) {
  const dates = announcement?.dateISOs?.length
    ? announcement.dateISOs
    : [
        announcement?.dateStartISO ?? announcement?.dateISO,
        announcement?.dateEndISO,
      ].filter((date): date is string => Boolean(date));

  return dates;
}

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateInput(dateISO?: string) {
  if (!dateISO) return undefined;
  const [year, month, day] = dateISO.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
}

function monthGridDates(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const start = new Date(year, month, 1 - firstOfMonth.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

export function AnnouncementFields({
  announcement,
}: {
  announcement?: Announcement;
}) {
  const [dates, setDates] = useState(() => initialAnnouncementDates(announcement));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const firstSelectedDate = parseDateInput(initialAnnouncementDates(announcement)[0]);
    const today = new Date();
    return new Date(
      firstSelectedDate?.getFullYear() ?? today.getFullYear(),
      firstSelectedDate?.getMonth() ?? today.getMonth(),
      1,
    );
  });
  const selectedDates = new Set(dates);
  const selectedDateLabels = dates
    .map((date) => ({ iso: date, date: parseDateInput(date) }))
    .filter((item): item is { iso: string; date: Date } => Boolean(item.date))
    .sort((a, b) => a.iso.localeCompare(b.iso))
    .map((item) => shortDateFormatter.format(item.date));

  function toggleDate(dateISO: string) {
    setDates((current) => {
      const next = current.includes(dateISO)
        ? current.filter((date) => date !== dateISO)
        : [...current, dateISO];
      return next.sort();
    });
  }

  function moveMonth(monthOffset: number) {
    setVisibleMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() + monthOffset, 1),
    );
  }

  return (
    <>
      <div className="grid gap-2 rounded-lg border border-white/10 bg-zinc-950 px-3 py-3 md:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-zinc-300">Dates</p>
            <p className="mt-1 text-xs text-zinc-500">
              {selectedDateLabels.length > 0
                ? selectedDateLabels.join(", ")
                : "No dates selected"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCalendarOpen((current) => !current)}
            className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-zinc-100 hover:bg-white/10"
          >
            {isCalendarOpen ? "Hide calendar" : "Choose dates"}
          </button>
        </div>

        {isCalendarOpen ? (
          <div className="max-w-[280px] rounded-lg border border-white/10 bg-black/20 p-2">
            <div className="mb-2 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => moveMonth(-1)}
                className="grid size-7 place-items-center rounded-md border border-white/15 text-sm leading-none text-zinc-100 hover:bg-white/10"
                aria-label="Previous month"
              >
                &lt;
              </button>
              <p className="text-xs font-semibold text-white">
                {monthFormatter.format(visibleMonth)}
              </p>
              <button
                type="button"
                onClick={() => moveMonth(1)}
                className="grid size-7 place-items-center rounded-md border border-white/15 text-sm leading-none text-zinc-100 hover:bg-white/10"
                aria-label="Next month"
              >
                &gt;
              </button>
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-center">
              {weekdayLabels.map((day) => (
                <div key={day} className="py-0.5 text-[10px] font-semibold text-zinc-500">
                  {day}
                </div>
              ))}
              {monthGridDates(visibleMonth).map((date) => {
                const dateISO = formatDateInput(date);
                const isSelected = selectedDates.has(dateISO);
                const isCurrentMonth = date.getMonth() === visibleMonth.getMonth();

                return (
                  <button
                    key={dateISO}
                    type="button"
                    onClick={() => toggleDate(dateISO)}
                    className={`aspect-square rounded border text-[11px] font-semibold transition ${
                      isSelected
                        ? "border-[var(--tf-neon)] bg-[var(--tf-neon)] text-[var(--tf-navy)]"
                        : "border-white/10 text-zinc-200 hover:border-[var(--tf-neon)]/60 hover:bg-white/10"
                    } ${isCurrentMonth ? "" : "opacity-35"}`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setDates([])}
                className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-white/10"
              >
                Clear dates
              </button>
            </div>
          </div>
        ) : null}

        {dates.map((date) => (
          <input key={date} type="hidden" name="dateISOs" value={date} />
        ))}
      </div>

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
