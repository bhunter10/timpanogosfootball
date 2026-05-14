import type { Metadata } from "next";
import { ShopProductGrid } from "@/components/shop-product-grid";
import { getSiteSettings } from "@/lib/data/site-settings";
import { getPrintifyCatalog } from "@/lib/printify/catalog";

export const metadata: Metadata = {
  title: "Shop",
  description: "Official Timpanogos football apparel and fan gear.",
};

export default async function ShopPage() {
  const settings = await getSiteSettings();
  const catalog = await getPrintifyCatalog();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--tf-neon)]">
        Shop
      </p>
      <h1 className="font-display mt-2 text-4xl font-bold text-slate-900">
        Team shop
      </h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
        {settings.shopMessage}
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        {settings.shopPrimaryUrl ? (
          <a
            href={settings.shopPrimaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-[var(--tf-navy)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--tf-black)]"
          >
            Open storefront
          </a>
        ) : (
          <span className="inline-flex items-center justify-center rounded-full border border-dashed border-slate-300 px-6 py-3 text-sm text-slate-500">
            Storefront link will appear here — configure in admin when ready.
          </span>
        )}
      </div>

      {!catalog.configured ? (
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          <p className="font-medium text-slate-900">Catalog preview</p>
          <p className="mt-2">
            Connect{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
              PRINTIFY_API_KEY
            </code>{" "}
            and{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
              PRINTIFY_SHOP_ID
            </code>{" "}
            on Vercel to pull live products from Printify with caching and optimized
            images.
          </p>
        </div>
      ) : catalog.error ? (
        <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-900">
          <p className="font-semibold">Could not load Printify catalog</p>
          <p className="mt-2">{catalog.error}</p>
        </div>
      ) : (
        <ShopProductGrid products={catalog.products} />
      )}
    </main>
  );
}
