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

export async function getPrintifyCatalog(): Promise<{
  configured: boolean;
  error?: string;
  products: PrintifyProductPreview[];
}> {
  const key = process.env.PRINTIFY_API_KEY;
  const shopId = process.env.PRINTIFY_SHOP_ID;
  if (!key || !shopId) {
    return { configured: false, products: [] };
  }

  try {
    const res = await fetch(
      `https://api.printify.com/v1/shops/${shopId}/products.json`,
      {
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          "User-Agent": "TimpanogosFootballSite",
        },
        next: { revalidate: 300 },
      },
    );

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
}
