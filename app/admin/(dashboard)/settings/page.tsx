import { getSiteSettings } from "@/lib/data/site-settings";
import { SettingsForm } from "./settings-form";

export default async function AdminSettingsPage() {
  const s = await getSiteSettings();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white">Site settings</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Updates merge into Firestore document{" "}
        <code className="rounded bg-zinc-900 px-1 py-0.5 text-xs">siteSettings/main</code>.
      </p>

      <SettingsForm settings={s} />
    </div>
  );
}
