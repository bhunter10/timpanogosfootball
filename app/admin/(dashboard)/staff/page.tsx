import { getStaffMembers } from "@/lib/data/staff";
import { createStaffMember, deleteStaffMember, updateStaffMember } from "../actions";

type AdminStaffPageProps = {
  searchParams: Promise<{ staffError?: string | string[] }>;
};

export default async function AdminStaffPage({ searchParams }: AdminStaffPageProps) {
  const { staffError } = await searchParams;
  const uploadError = Array.isArray(staffError) ? staffError[0] : staffError;
  const staff = await getStaffMembers();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white">Staff</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Upload JPG, PNG, or WebP staff photos up to 5 MB. Uploaded photos are stored in
        Firebase Storage and optimized by the frontend image pipeline.
      </p>

      {uploadError ? (
        <div className="mt-6 rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-100">
          {uploadError}
        </div>
      ) : null}

      <section className="mt-10 rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
        <h2 className="text-sm font-semibold text-white">Add staff member</h2>
        <form action={createStaffMember} className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="text-xs font-medium text-zinc-400">
            Name
            <input
              name="name"
              required
              className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="text-xs font-medium text-zinc-400">
            Role
            <input
              name="role"
              required
              placeholder="Head Coach"
              className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="text-xs font-medium text-zinc-400 md:col-span-2">
            Bio
            <textarea
              name="bio"
              rows={3}
              className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="text-xs font-medium text-zinc-400 md:col-span-2">
            Photo upload
            <input
              name="photoFile"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-white/15"
            />
          </label>
          <label className="text-xs font-medium text-zinc-400 md:col-span-2">
            Photo URL override
            <input
              name="photoUrl"
              placeholder="https://firebasestorage.googleapis.com/..."
              className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="text-xs font-medium text-zinc-400">
            Email
            <input
              name="email"
              type="email"
              className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="text-xs font-medium text-zinc-400">
            Sort order
            <input
              name="sortOrder"
              type="number"
              defaultValue={0}
              className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
            />
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white hover:bg-white/15"
            >
              Add staff
            </button>
          </div>
        </form>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold text-white">Directory</h2>
        {staff.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">No staff yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {staff.map((m) => (
              <li
                key={m.id}
                className="rounded-xl border border-white/10 bg-zinc-900/40 p-4 text-sm text-zinc-200"
              >
                <div className="flex items-start gap-2">
                  <details className="min-w-0 flex-1">
                    <summary className="grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-white">
                          {m.name}
                        </span>
                        <span className="block truncate text-xs text-zinc-500">
                          {m.role}
                        </span>
                      </span>
                      <span className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-white/10">
                        Edit
                      </span>
                    </summary>
                    <form action={updateStaffMember} className="mt-4 grid gap-3 md:grid-cols-2">
                      <input type="hidden" name="id" value={m.id} />
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
                      <label className="text-xs font-medium text-zinc-400 md:col-span-2">
                        Sort order
                        <input
                          name="sortOrder"
                          type="number"
                          defaultValue={m.sortOrder}
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
        )}
      </section>
    </div>
  );
}
