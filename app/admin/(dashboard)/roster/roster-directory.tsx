"use client";

import { useId, useState, useTransition } from "react";
import type { DragEvent } from "react";
import type { Prospect } from "@/lib/data/prospects";
import {
  deleteRosterPlayer,
  reorderRosterPlayers,
  updateRosterPlayer,
} from "../actions";

type RosterDirectoryProps = {
  players: Prospect[];
};

function listValue(values?: string[]) {
  return values?.join("\n") ?? "";
}

function reorderItems(items: Prospect[], activeId: string, overId: string): Prospect[] {
  const activeIndex = items.findIndex((item) => item.id === activeId);
  const overIndex = items.findIndex((item) => item.id === overId);
  if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) return items;

  const next = [...items];
  const [moved] = next.splice(activeIndex, 1);
  next.splice(overIndex, 0, moved);
  return next.map((item, index) => ({ ...item, sortOrder: index }));
}

export function RosterDirectory({ players }: RosterDirectoryProps) {
  const [items, setItems] = useState(players);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function persistOrder(nextItems: Prospect[]) {
    startTransition(async () => {
      await reorderRosterPlayers(nextItems.map((item) => item.id));
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
    return <p className="mt-4 text-sm text-zinc-400">No players yet.</p>;
  }

  return (
    <>
      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-zinc-400">
        <p>Drag player cards to change the roster and prospects display order.</p>
        {isPending ? <p className="shrink-0 text-[var(--tf-neon)]">Saving order...</p> : null}
      </div>
      <ul className="mt-4 space-y-3">
        {items.map((player) => (
          <li
            key={player.id}
            draggable
            aria-label={`Drag ${player.name} to reorder`}
            onDragStart={(event) => {
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/plain", player.id);
              setDraggedId(player.id);
            }}
            onDragEnd={() => {
              setDraggedId(null);
              setDropTargetId(null);
            }}
            onDragEnter={(event) => {
              event.preventDefault();
              if (draggedId && draggedId !== player.id) {
                setDropTargetId(player.id);
              }
            }}
            onDragOver={(event) => {
              event.preventDefault();
              if (draggedId && draggedId !== player.id) {
                setDropTargetId(player.id);
              }
            }}
            onDrop={(event) => handleDrop(event, player.id)}
            className={`relative cursor-grab rounded-xl border bg-zinc-900/40 p-4 text-sm text-zinc-100 transition active:cursor-grabbing ${
              draggedId === player.id ? "border-[var(--tf-neon)]/70 opacity-60" : "border-white/10"
            }`}
          >
            {dropTargetId === player.id ? (
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
                      {player.jerseyNumber ? `#${player.jerseyNumber} ` : ""}
                      {player.name}
                    </span>
                    <span className="block truncate text-xs text-zinc-400">
                      Class of {player.classYear} - {player.positions.join(" / ")}
                      {player.isProspect ? " - prospect" : ""}
                    </span>
                  </span>
                  <span className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold text-zinc-100 hover:bg-white/10">
                    Edit
                  </span>
                </summary>
                <form action={updateRosterPlayer} className="mt-4 grid gap-3 md:grid-cols-2">
                  <input type="hidden" name="id" value={player.id} />
                  <PlayerFields player={player} />
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
              <form action={deleteRosterPlayer} className="shrink-0">
                <input type="hidden" name="id" value={player.id} />
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

export function PlayerFields({ player }: { player?: Prospect }) {
  const prospectFieldId = useId();

  return (
    <>
      <label className="text-xs font-medium text-zinc-300">
        Name
        <input
          name="name"
          required
          defaultValue={player?.name ?? ""}
          className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="text-xs font-medium text-zinc-300">
        Jersey number
        <input
          name="jerseyNumber"
          defaultValue={player?.jerseyNumber ?? ""}
          placeholder="12"
          className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="text-xs font-medium text-zinc-300">
        Class year
        <input
          name="classYear"
          required
          defaultValue={player?.classYear ?? ""}
          placeholder="2027"
          className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="text-xs font-medium text-zinc-300">
        Positions
        <input
          name="positions"
          required
          defaultValue={player?.positions.join(", ") ?? ""}
          placeholder="WR, DB"
          className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="text-xs font-medium text-zinc-300">
        Height
        <input
          name="height"
          defaultValue={player?.height ?? ""}
          placeholder="6'1&quot;"
          className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="text-xs font-medium text-zinc-300">
        Weight
        <input
          name="weight"
          defaultValue={player?.weight ?? ""}
          placeholder="180"
          className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="text-xs font-medium text-zinc-300 md:col-span-2">
        Photo upload
        <input
          name="photoFile"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-white/15"
        />
      </label>
      <label className="text-xs font-medium text-zinc-300 md:col-span-2">
        Photo URL override
        <input
          name="photoUrl"
          defaultValue={player?.photoUrl ?? ""}
          placeholder="https://firebasestorage.googleapis.com/..."
          className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="text-xs font-medium text-zinc-300">
        Hudl URL
        <input
          name="hudlUrl"
          type="url"
          defaultValue={player?.hudlUrl ?? ""}
          className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="text-xs font-medium text-zinc-300">
        X profile URL
        <input
          name="xUrl"
          type="url"
          defaultValue={player?.xUrl ?? ""}
          className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="text-xs font-medium text-zinc-300">
        Instagram profile URL
        <input
          name="instagramUrl"
          type="url"
          defaultValue={player?.instagramUrl ?? ""}
          className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="text-xs font-medium text-zinc-300">
        Public contact email
        <input
          name="email"
          type="email"
          defaultValue={player?.email ?? ""}
          className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="text-xs font-medium text-zinc-300">
        Recruiting status
        <select
          name="status"
          defaultValue={player?.status ?? "available"}
          className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
        >
          <option value="available">Available</option>
          <option value="committed">Committed</option>
        </select>
      </label>
      <div className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-3 md:col-span-2">
        <label
          htmlFor={prospectFieldId}
          className="flex w-fit items-center gap-3 text-xs font-medium text-zinc-200"
        >
          <input
            id={prospectFieldId}
            name="isProspect"
            type="checkbox"
            defaultChecked={player?.isProspect ?? false}
            className="size-4 rounded border-white/20 bg-zinc-950 accent-[var(--tf-neon)]"
          />
          Show on prospects page
        </label>
        <p className="mt-2 text-xs leading-5 text-zinc-400">
          Adds this player to the public recruiting board.
        </p>
      </div>
      <label className="text-xs font-medium text-zinc-300 md:col-span-2">
        Honors
        <textarea
          name="honors"
          rows={2}
          defaultValue={listValue(player?.honors)}
          placeholder="One per line, or comma-separated"
          className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="text-xs font-medium text-zinc-300 md:col-span-2">
        Stats
        <textarea
          name="stats"
          rows={2}
          defaultValue={listValue(player?.stats)}
          placeholder="One per line, or comma-separated"
          className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
      </label>
      <input name="sortOrder" type="hidden" defaultValue={player?.sortOrder ?? 0} />
    </>
  );
}
