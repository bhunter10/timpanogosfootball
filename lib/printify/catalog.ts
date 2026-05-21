import { unstable_cache } from "next/cache";

const PRINTIFY_CATALOG_LIMIT = 50;
const PRINTIFY_CATALOG_REVALIDATE_SECONDS = 300;

export type PrintifyProductPreview = {
  id: string;
  title: string;
  imageSrc?: string;
  /** Public sales-channel link when available (depends on Printify / connected channel). */
  externalUrl?: string;
  /** Printify dashboard link for local setup/debugging only. */
  adminUrl: string;
};

type PrintifyApiProduct = {
  id: string;
  title: string;
  images?: { src?: string; position?: string }[];
  variants?: { id: number }[];
  external?: { handle?: string } | { handle?: string }[];
};

function getPublicProductUrl(product: PrintifyApiProduct) {
  const external = Array.isArray(product.external)
    ? product.external[0]
    : product.external;
  const handle = external?.handle;

  if (!handle) return undefined;

  if (handle.startsWith("http://") || handle.startsWith("https://")) return handle;
  if (handle.startsWith("/")) return handle;

  return undefined;
}

type PrintifyCatalogResult = {
  configured: boolean;
  error?: string;
  products: PrintifyProductPreview[];
};

const getCachedPrintifyCatalog = unstable_cache(
  async (
    key: string,
    shopId: string,
    limit: number,
  ): Promise<PrintifyCatalogResult> => {
    try {
      const url = new URL(
        `https://api.printify.com/v1/shops/${shopId}/products.json`,
      );
      url.searchParams.set("limit", String(limit));

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          "User-Agent": "TimpanogosFootballSite",
        },
        cache: "no-store",
      });

      if (!res.ok) {
        const text = await res.text();
        return {
          configured: true,
          error: `Printify API error (${res.status}): ${text.slice(0, 200)}`,
          products: [],
        };
      }

      const data = (await res.json()) as { data?: PrintifyApiProduct[] };
      const rows = data.data ?? [];
      const products: PrintifyProductPreview[] = rows.map((p) => {
        const sorted = [...(p.images ?? [])].sort(
          (a, b) => Number(a.position ?? 0) - Number(b.position ?? 0),
        );
        const src = sorted.find((i) => i.src)?.src;
        return {
          id: String(p.id),
          title: p.title,
          imageSrc: src,
          externalUrl: getPublicProductUrl(p),
          adminUrl: `https://printify.com/app/products/${p.id}`,
        };
      });

      return { configured: true, products };
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      return { configured: true, error: message, products: [] };
    }
  },
  ["printify-catalog-preview-v1"],
  {
    revalidate: PRINTIFY_CATALOG_REVALIDATE_SECONDS,
    tags: ["printify-catalog"],
  },
);

export async function getPrintifyCatalog(): Promise<PrintifyCatalogResult> {
  const key = process.env.PRINTIFY_API_KEY;
  const shopId = process.env.PRINTIFY_SHOP_ID;
  if (!key || !shopId) {
    return { configured: false, products: [] };
  }

  return getCachedPrintifyCatalog(key, shopId, PRINTIFY_CATALOG_LIMIT);
}
