"use client";

import Image from "next/image";
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

function isRenderablePhotoUrl(value: string) {
  if (value.startsWith("/")) return true;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function StaffPhotoCropFields({ member }: { member: StaffMember }) {
  const [photoUrl, setPhotoUrl] = useState(member.photoUrl ?? "");
  const [focusX, setFocusX] = useState(member.photoFocusX);
  const [focusY, setFocusY] = useState(member.photoFocusY);
  const [zoom, setZoom] = useState(member.photoZoom);
  const canPreviewPhoto = isRenderablePhotoUrl(photoUrl);

  return (
    <div className="grid gap-4 rounded-xl border border-white/10 bg-black/20 p-4 md:col-span-2 md:grid-cols-[180px_minmax(0,1fr)]">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-zinc-950">
        {canPreviewPhoto ? (
          <Image
            src={photoUrl}
            alt=""
            fill
            sizes="180px"
            className="object-cover"
            style={{
              objectPosition: `${focusX}% ${focusY}%`,
              transform: `scale(${zoom})`,
              transformOrigin: `${focusX}% ${focusY}%`,
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-xs text-zinc-500">
            {photoUrl
              ? "Enter a full photo URL to preview the crop."
              : "Add a photo URL or upload a photo, then save to preview it here."}
          </div>
        )}
      </div>

      <div className="grid content-start gap-3">
        <label className="text-xs font-medium text-zinc-300">
          Photo URL override
          <input
            name="photoUrl"
            value={photoUrl}
            onChange={(event) => setPhotoUrl(event.target.value)}
            className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
          />
        </label>

        <label className="text-xs font-medium text-zinc-300">
          Face left / right
          <span className="float-right tabular-nums text-zinc-500">{focusX}%</span>
          <input
            name="photoFocusX"
            type="range"
            min="0"
            max="100"
            value={focusX}
            onChange={(event) => setFocusX(Number(event.target.value))}
            className="mt-2 w-full accent-[var(--tf-neon)]"
          />
        </label>

        <label className="text-xs font-medium text-zinc-300">
          Face up / down
          <span className="float-right tabular-nums text-zinc-500">{focusY}%</span>
          <input
            name="photoFocusY"
            type="range"
            min="0"
            max="100"
            value={focusY}
            onChange={(event) => setFocusY(Number(event.target.value))}
            className="mt-2 w-full accent-[var(--tf-neon)]"
          />
        </label>

        <label className="text-xs font-medium text-zinc-300">
          Zoom
          <span className="float-right tabular-nums text-zinc-500">{zoom.toFixed(2)}x</span>
          <input
            name="photoZoom"
            type="range"
            min="1"
            max="1.8"
            step="0.05"
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            className="mt-2 w-full accent-[var(--tf-neon)]"
          />
        </label>
      </div>
    </div>
  );
}

export function StaffDirectory({ staff }: StaffDirectoryProps) {
  const [items, setItems] = useState(staff);
  const [openItemIds, setOpenItemIds] = useState<Set<string>>(new Set());
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
    return <p className="mt-4 text-sm text-zinc-400">No staff yet.</p>;
  }

  return (
    <>
      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-zinc-400">
        <p>Drag staff cards to change the public display order.</p>
        {isPending ? <p className="shrink-0 text-[var(--tf-neon)]">Saving order...</p> : null}
      </div>
      <ul className="mt-4 space-y-3">
        {items.map((m) => {
          const isOpen = openItemIds.has(m.id);

          return (
            <li
              key={m.id}
              draggable={!isOpen}
              aria-label={isOpen ? undefined : `Drag ${m.name} to reorder`}
              onDragStart={(event) => {
                if (isOpen) {
                  event.preventDefault();
                  return;
                }

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
                if (draggedId && draggedId !== m.id && !isOpen) {
                  setDropTargetId(m.id);
                }
              }}
              onDragOver={(event) => {
                event.preventDefault();
                if (draggedId && draggedId !== m.id && !isOpen) {
                  setDropTargetId(m.id);
                }
              }}
              onDrop={(event) => handleDrop(event, m.id)}
              className={`relative rounded-xl border bg-zinc-900/40 p-4 text-sm text-zinc-100 transition ${
                isOpen ? "cursor-default" : "cursor-grab active:cursor-grabbing"
              } ${
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
                  className="mt-1 flex h-9 w-7 shrink-0 flex-col items-center justify-center gap-1 px-1 text-zinc-400 transition hover:text-[var(--tf-neon)]"
                >
                  <span className="h-0.5 w-4 rounded-full bg-current" />
                  <span className="h-0.5 w-4 rounded-full bg-current" />
                  <span className="h-0.5 w-4 rounded-full bg-current" />
                </span>
                <details
                  className="min-w-0 flex-1"
                  onToggle={(event) => handleDetailsToggle(m.id, event.currentTarget.open)}
                >
                <summary className="grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-white">{m.name}</span>
                    <span className="block truncate text-xs text-zinc-400">{m.role}</span>
                  </span>
                  <span className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold text-zinc-100 hover:bg-white/10">
                    Edit
                  </span>
                </summary>
                <form action={updateStaffMember} className="mt-4 grid gap-3 md:grid-cols-2">
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="sortOrder" value={m.sortOrder} />
                  <label className="text-xs font-medium text-zinc-300">
                    Name
                    <input
                      name="name"
                      defaultValue={m.name}
                      required
                      className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
                    />
                  </label>
                  <label className="text-xs font-medium text-zinc-300">
                    Role
                    <input
                      name="role"
                      defaultValue={m.role}
                      required
                      className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
                    />
                  </label>
                  <label className="text-xs font-medium text-zinc-300 md:col-span-2">
                    Bio
                    <textarea
                      name="bio"
                      rows={2}
                      defaultValue={m.bio ?? ""}
                      className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
                    />
                  </label>
                  <label className="text-xs font-medium text-zinc-300">
                    New photo upload
                    <input
                      name="photoFile"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-white/15"
                    />
                  </label>
                  <label className="text-xs font-medium text-zinc-300">
                    Email
                    <input
                      name="email"
                      type="email"
                      defaultValue={m.email ?? ""}
                      className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
                    />
                  </label>
                  <StaffPhotoCropFields member={m} />
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
          );
        })}
      </ul>
    </>
  );
}
