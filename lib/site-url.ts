const productionSiteOrigin = "https://timpanogosfootball.com";

function normalizeOrigin(value?: string) {
  if (!value) return undefined;
  const trimmed = value.trim().replace(/\/+$/, "");
  if (!trimmed) return undefined;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function getPublicSiteOrigin() {
  return (
    normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL) ??
    normalizeOrigin(process.env.SITE_URL) ??
    normalizeOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    normalizeOrigin(process.env.VERCEL_URL) ??
    productionSiteOrigin
  );
}

export function getRequestOrigin(request: Request) {
  return normalizeOrigin(request.headers.get("origin") ?? undefined) ?? new URL(request.url).origin;
}

export function getHeadersOrigin(headersList: Headers) {
  const host =
    headersList.get("x-forwarded-host") ??
    headersList.get("host") ??
    undefined;
  if (!host) return getPublicSiteOrigin();

  const protocol = headersList.get("x-forwarded-proto") ?? "https";
  return normalizeOrigin(`${protocol}://${host}`) ?? getPublicSiteOrigin();
}
