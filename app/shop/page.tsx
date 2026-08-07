import type { Metadata } from "next";
import Image from "next/image";
import { ShopProductGrid } from "@/components/shop-product-grid";
import { getSiteSettings } from "@/lib/data/site-settings";
import { getPrintifyCatalog } from "@/lib/printify/catalog";
import { createPageMetadata } from "@/lib/seo";

const shopHeroImage = "/images/shop-hero-l2q-0168-v4.webp";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Shop",
    description:
      "Shop Timpanogos Football apparel, fan gear, and Timberwolves team merchandise.",
    path: "/shop",
    image: shopHeroImage,
  }),
};

export default async function ShopPage() {
  const settings = await getSiteSettings();
  const catalog = await getPrintifyCatalog();
  const storefrontUrl =
    settings.shopPrimaryUrl ?? process.env.PRINTIFY_STOREFRONT_URL;

  return (
    <main className="bg-[var(--tf-black)] text-white">
      <section className="relative isolate h-[325px] overflow-hidden border-b border-white/10 bg-black">
        <Image
          src={shopHeroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:84px_84px]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,9,23,0.98)_0%,rgba(2,9,23,0.82)_42%,rgba(2,9,23,0.12)_72%,rgba(2,9,23,0)_100%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
          <p className="text-sm font-black uppercase tracking-[0.36em] text-[var(--tf-neon)]">
            Team Gear
          </p>
          <h1 className="font-display mt-4 max-w-4xl text-6xl font-bold uppercase leading-[0.88] tracking-tight text-white md:text-8xl">
            Shop
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-zinc-200 md:text-base">
            {settings.shopMessage}
          </p>
        </div>
      </section>

      <section className="relative isolate overflow-hidden px-4 py-12 md:px-6 lg:py-16">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(57,255,20,0.08),transparent_32%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-7 flex items-end justify-between gap-4 border-b border-white/15 pb-5">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.28em] text-[var(--tf-neon)]">
                Catalog
              </p>
              <h2 className="font-display mt-2 text-4xl font-bold uppercase leading-none text-white md:text-5xl">
                Timberwolves Gear
              </h2>
            </div>
          </div>

          {!catalog.configured ? (
            <div className="border border-dashed border-white/20 bg-white/[0.055] p-8 text-sm leading-6 text-zinc-300 md:p-10">
              <p className="font-display text-3xl font-bold uppercase leading-none text-white">
                Catalog preview is not connected.
              </p>
              <p className="mt-4 max-w-2xl">
                Connect{" "}
                <code className="bg-white/10 px-1.5 py-0.5 text-xs text-zinc-100">
                  PRINTIFY_API_KEY
                </code>{" "}
                and{" "}
                <code className="bg-white/10 px-1.5 py-0.5 text-xs text-zinc-100">
                  PRINTIFY_SHOP_ID
                </code>{" "}
                on Vercel to pull live products from Printify.
              </p>
            </div>
          ) : catalog.error ? (
            <div className="border border-red-400/40 bg-red-950/40 p-8 text-sm text-red-100 md:p-10">
              <p className="font-display text-3xl font-bold uppercase leading-none">
                Could not load Printify catalog.
              </p>
              <p className="mt-4">{catalog.error}</p>
            </div>
          ) : catalog.products.length > 0 ? (
            <ShopProductGrid
              products={catalog.products}
              storefrontUrl={storefrontUrl}
            />
          ) : (
            <div className="border border-dashed border-white/20 bg-white/[0.055] p-8 md:p-10">
              <p className="text-sm font-black uppercase tracking-[0.28em] text-[var(--tf-neon)]">
                Products Coming Soon
              </p>
              <h2 className="font-display mt-4 text-4xl font-bold uppercase leading-none text-white">
                Gear is being published.
              </h2>
              {storefrontUrl ? (
                <a
                  href={storefrontUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex bg-[var(--tf-neon)] px-5 py-3 text-xs font-black uppercase tracking-wide text-[var(--tf-navy)] transition hover:brightness-110"
                >
                  Open Storefront
                </a>
              ) : null}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
