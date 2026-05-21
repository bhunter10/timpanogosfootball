"use client";

import { useState, useTransition } from "react";
import type { DragEvent } from "react";
import type { StaffMember } from "@/types/firestore";
import { deleteStaffMember, reorderStaffMembers, updateStaffMember } from "../actions";

type StaffDirectoryProps = {
  staff: StaffMember[];
};

function reorderItems(items: StaffMember[], activeId: string, overId: string): StaffMember[] {
  const activeIndex = items.findIndex((item) => item.id === activeId);
  const overIndex = items.findIndex((item) => item.id === overId);
  if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) return items;

  const next = [...items];
  const [moved] = next.splice(activeIndex, 1);
  next.splice(overIndex, 0, moved);
  return next.map((item, index) => ({ ...item, sortOrder: index }));
}

export function StaffDirectory({ staff }: StaffDirectoryProps) {
  const [items, setItems] = useState(staff);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function persistOrder(nextItems: StaffMember[]) {
    startTransition(async () => {
      await reorderStaffMembers(nextItems.map((item) => item.id));
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
    return <p className="mt-4 text-sm text-zinc-500">No staff yet.</p>;
  }

  return (
    <>
      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-zinc-500">
        <p>Drag staff cards to change the public display order.</p>
        {isPending ? <p className="shrink-0 text-[var(--tf-neon)]">Saving order...</p> : null}
      </div>
      <ul className="mt-4 space-y-3">
        {items.map((m) => (
          <li
            key={m.id}
            draggable
            aria-label={`Drag ${m.name} to reorder`}
            onDragStart={(event) => {
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/plain", m.id);
              setDraggedId(m.id);
            }}
            onDragEnd={() => {
              setDraggedId(null);
              setDropTargetId(null);
            }}
            onDragEnter={(event) => {
              event.preventDefault();
              if (draggedId && draggedId !== m.id) {
                setDropTargetId(m.id);
              }
            }}
            onDragOver={(event) => {
              event.preventDefault();
              if (draggedId && draggedId !== m.id) {
                setDropTargetId(m.id);
              }
            }}
            onDrop={(event) => handleDrop(event, m.id)}
            className={`relative cursor-grab rounded-xl border bg-zinc-900/40 p-4 text-sm text-zinc-200 transition active:cursor-grabbing ${
              draggedId === m.id
                ? "border-[var(--tf-neon)]/70 opacity-60"
                : dropTargetId === m.id
                  ? "border-white/10"
                  : "border-white/10"
            }`}
          >
            {dropTargetId === m.id ? (
              <span
                aria-hidden="true"
                className="absolute -top-2 left-4 right-4 h-1 rounded-full bg-[var(--tf-neon)] shadow-[0_0_14px_rgba(57,255,20,0.7)]"
              />
            ) : null}
            <div className="flex items-start gap-2">
              <span
                aria-hidden="true"
                className="mt-1 flex h-9 w-7 shrink-0 flex-col items-center justify-center gap-1 px-1 text-zinc-500 transition hover:text-[var(--tf-neon)]"
              >
                <span className="h-0.5 w-4 rounded-full bg-current" />
                <span className="h-0.5 w-4 rounded-full bg-current" />
                <span className="h-0.5 w-4 rounded-full bg-current" />
              </span>
              <details className="min-w-0 flex-1">
                <summary className="grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-white">{m.name}</span>
                    <span className="block truncate text-xs text-zinc-500">{m.role}</span>
                  </span>
                  <span className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-white/10">
                    Edit
                  </span>
                </summary>
                <form action={updateStaffMember} className="mt-4 grid gap-3 md:grid-cols-2">
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="sortOrder" value={m.sortOrder} />
                  <label className="text-xs font-medium text-zinc-400">
                    Name
                    <input
                      name="name"
                      defaultValue={m.name}
                      required
                      className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
                    />
                  </label>
                  <label className="text-xs font-medium text-zinc-400">
                    Role
                    <input
                      name="role"
                      defaultValue={m.role}
                      required
                      className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
                    />
                  </label>
                  <label className="text-xs font-medium text-zinc-400 md:col-span-2">
                    Bio
                    <textarea
                      name="bio"
                      rows={2}
                      defaultValue={m.bio ?? ""}
                      className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
                    />
                  </label>
                  <label className="text-xs font-medium text-zinc-400">
                    New photo upload
                    <input
                      name="photoFile"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-white/15"
                    />
                  </label>
                  <label className="text-xs font-medium text-zinc-400">
                    Photo URL override
                    <input
                      name="photoUrl"
                      defaultValue={m.photoUrl ?? ""}
                      className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
                    />
                  </label>
                  <label className="text-xs font-medium text-zinc-400">
                    Email
                    <input
                      name="email"
                      type="email"
                      defaultValue={m.email ?? ""}
                      className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
                    />
                  </label>
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
              <form action={deleteStaffMember} className="shrink-0">
                <input type="hidden" name="id" value={m.id} />
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
