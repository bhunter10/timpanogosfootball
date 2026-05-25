import Image from "next/image";
import type { StaffMember } from "@/types/firestore";

export function StaffCard({ member }: { member: StaffMember }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative aspect-[4/3] w-full bg-slate-100">
        {member.photoUrl ? (
          <Image
            src={member.photoUrl}
            alt={member.name}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover"
            style={{
              objectPosition: `${member.photoFocusX}% ${member.photoFocusY}%`,
              transform: `scale(${member.photoZoom})`,
              transformOrigin: `${member.photoFocusX}% ${member.photoFocusY}%`,
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 font-display text-4xl font-bold text-slate-400">
            {member.name
              .split(" ")
              .map((p) => p[0])
              .join("")
              .slice(0, 2)}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="font-display text-xl font-semibold text-slate-900">
          {member.name}
        </h2>
        <p className="text-sm font-medium uppercase tracking-wide text-[var(--tf-navy)]">
          {member.role}
        </p>
        {member.bio ? (
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{member.bio}</p>
        ) : null}
        {member.email ? (
          <a
            href={`mailto:${member.email}`}
            className="mt-4 text-sm font-medium text-[var(--tf-navy)] hover:underline"
          >
            Email
          </a>
        ) : null}
      </div>
    </article>
  );
}
