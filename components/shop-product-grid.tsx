import Image from "next/image";
import type { PrintifyProductPreview } from "@/lib/printify/catalog";

export function ShopProductGrid({
  products,
}: {
  products: PrintifyProductPreview[];
}) {
  if (products.length === 0) return null;

  return (
    <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <article
          key={p.id}
          className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="relative aspect-square w-full bg-slate-100">
            {p.imageSrc ? (
              <Image
                src={p.imageSrc}
                alt={p.title}
                fill
                sizes="(max-width:768px) 100vw, 33vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                Image unavailable
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col p-5">
            <h2 className="font-display text-lg font-semibold text-slate-900">
              {p.title}
            </h2>
            {p.externalUrl ? (
              <a
                href={p.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center text-sm font-semibold text-[var(--tf-navy)] hover:underline"
              >
                View on Printify →
              </a>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
