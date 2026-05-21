import type { Metadata } from "next";
import { createElement } from "react";
import { getPublicSiteOrigin } from "@/lib/site-url";

export const siteName = "Timpanogos Football";
export const siteDescription =
  "Official Timpanogos High School football site for schedules, roster, staff, tickets, recruiting, records, and team gear.";
export const siteImage = "/images/timpanogos-football-hero-option1.jpg";

type PageMetadata = {
  title: string;
  description: string;
  path: string;
  image?: string;
};

export function getSiteUrl(path = "/") {
  return new URL(path, getPublicSiteOrigin());
}

export function createPageMetadata({
  title,
  description,
  path,
  image = siteImage,
}: PageMetadata): Metadata {
  const url = getSiteUrl(path);
  const fullTitle = title === siteName ? siteName : `${title} | ${siteName}`;

  return {
    title: title === siteName ? { absolute: siteName } : title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

export function JsonLd({ data }: { data: unknown }) {
  return createElement("script", {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  });
}
