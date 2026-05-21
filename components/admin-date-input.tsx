"use client";

import { useRef, type InputHTMLAttributes } from "react";

type AdminDateInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className" | "type"
> & {
  className: string;
  type: "date" | "datetime-local";
};

export function AdminDateInput({
  className,
  type,
  ...props
}: AdminDateInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function openPicker() {
    const input = inputRef.current;
    if (!input) return;

    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }

    input.focus();
  }

  return (
    <span className="relative mt-1 block">
      <input ref={inputRef} type={type} className={className} {...props} />
      <button
        type="button"
        aria-label="Open date picker"
        onClick={openPicker}
        className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-zinc-50 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--tf-neon)]"
      >
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        >
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="M3 10h18" />
        </svg>
      </button>
    </span>
  );
}
