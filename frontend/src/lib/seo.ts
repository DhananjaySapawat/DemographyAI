import type { Metadata } from "next";
import { site } from "@/src/config";

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "";

// ── Types ─────────────────────────────────────────────────────────────────────

interface MetadataProps {
  title: string;
  description: string;
  keywords: string[];
  socialDescription: string;
  slug: string;
  ogImage?: string;
}

// ── Builder ───────────────────────────────────────────────────────────────────

export function buildMetadata({
  title,
  description,
  keywords,
  socialDescription,
  slug,
  ogImage,
}: MetadataProps): Metadata {

  const image = ogImage ?? site.ogImage;
  const pageUrl = `${site.url}${slug}`;

  return {
    metadataBase: new URL(site.url),

    title,
    description,
    keywords,

    ...(googleVerification && {
      verification: {
        google: googleVerification,
      },
    }),

    alternates: {
      canonical: pageUrl,
    },

    openGraph: {
      title,
      description: socialDescription,
      url:         pageUrl,
      siteName:    site.name,
      locale:      "en_US",
      type:        "website",
      images: [
        {
          url:    image,
          width:  1200,
          height: 630,
          alt:    `${site.name} - AI Face Analysis Platform`,
        },
      ],
    },

    robots: {
      index:  true,
      follow: true,
      googleBot: {
        index:               true,
        follow:              true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet":       -1,
      },
    },
  };
}