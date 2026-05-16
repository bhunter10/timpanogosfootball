import Image from "next/image";
import type { PrintifyProductPreview } from "@/lib/printify/catalog";

function resolveProductHref(productUrl?: string, storefrontUrl?: string) {
  if (!productUrl) return storefrontUrl;
  if (!productUrl.startsWith("/")) return productUrl;
  if (!storefrontUrl) return undefined;

  try {
    return new URL(productUrl, storefrontUrl).toString();
  } catch {
    return storefrontUrl;
  }
}

export function ShopProductGrid({
  products,
  storefrontUrl,
}: {
  products: PrintifyProductPreview[];
  storefrontUrl?: string;
}) {
  if (products.length === 0) return null;
  const showAdminFallback = process.env.NODE_ENV !== "production";

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => {
        const publicHref = resolveProductHref(p.externalUrl, storefrontUrl);
        const href = publicHref ?? (showAdminFallback ? p.adminUrl : undefined);
        const label = publicHref ? "View Details" : "Manage in Printify";
        const content = (
          <>
            <div className="relative aspect-square w-full bg-white/5">
              {p.imageSrc ? (
                <Image
                  src={p.imageSrc}
                  alt={p.title}
                  fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                  Image unavailable
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h2 className="font-display mb-5 text-xl font-bold uppercase leading-none text-white">
                {p.title}
              </h2>
              {href ? (
                <span className="mt-auto inline-flex items-center justify-center bg-[var(--tf-neon)] px-5 py-3 text-xs font-black uppercase tracking-wide text-[var(--tf-navy)] transition group-hover:brightness-110">
                  {label}
                </span>
              ) : (
                <p className="mt-auto text-sm font-medium text-zinc-500">
                  Add the storefront URL in admin to enable shopping.
                </p>
              )}
            </div>
          </>
        );

        if (!href) {
          return (
            <article
              key={p.id}
              className="group flex flex-col overflow-hidden border border-white/10 bg-white/[0.055] shadow-xl shadow-black/20 transition hover:border-[var(--tf-neon)]/50"
            >
              {content}
            </article>
          );
        }

        return (
          <a
            key={p.id}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col overflow-hidden border border-white/10 bg-white/[0.055] shadow-xl shadow-black/20 transition hover:border-[var(--tf-neon)]/50 focus:outline-none focus-visible:border-[var(--tf-neon)] focus-visible:ring-2 focus-visible:ring-[var(--tf-neon)]/50"
          >
            {content}
          </a>
        );
      })}
    </div>
  );
}
