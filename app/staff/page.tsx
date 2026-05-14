import type { Metadata } from "next";
import { StaffCard } from "@/components/staff-card";
import { getStaffMembers } from "@/lib/data/staff";

export const metadata: Metadata = {
  title: "Staff",
  description: "Coaching staff and program leadership for Timpanogos football.",
};

export default async function StaffPage() {
  const staff = await getStaffMembers();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--tf-neon)]">
        Staff
      </p>
      <h1 className="font-display mt-2 text-4xl font-bold text-slate-900">
        Coaches & staff
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Leadership contact information is provided when available. Reach out through the
        athletic office for general program questions.
      </p>

      {staff.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
          Staff bios are being prepared. Check back soon.
        </div>
      ) : (
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {staff.map((member) => (
            <StaffCard key={member.id} member={member} />
          ))}
        </div>
      )}
    </main>
  );
}
