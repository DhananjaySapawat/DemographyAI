import type { Metadata } from "next";
import Script from "next/script";
import Header from "@/src/components/layout/Header";
import Footer from "@/src/components/layout/Footer";
import { site, contact } from "@/src/config";
import "./globals.css";

// ── Page metadata ─────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
};

// ── JSON-LD structured data ───────────────────────────────────────────────────

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    // WebSite
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      description:
        "AI-powered face analysis platform. Detect age, gender, emotion, and ethnicity from photos and videos instantly.",
      inLanguage: "en-US",
    },

    // WebApplication
    {
      "@type": "WebApplication",
      "@id": `${site.url}/#app`,
      name: site.name,
      url: site.url,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web",
      browserRequirements: "Requires JavaScript",
      description:
        "Upload a photo or use your camera to run AI face analysis. Predicts age, age range, gender, emotion, and ethnicity using custom-trained PyTorch models.",
      featureList: [
        "Age estimation",
        "Age range classification",
        "Gender prediction",
        "Emotion detection",
        "Ethnicity classification",
        "Real-time webcam analysis",
        "Video frame analysis",
        "Private browser-side inference mode",
      ],
      screenshot: site.ogImage,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },

    // Organization
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      url: site.url,
      logo: {
        "@type": "ImageObject",
        url: `${site.url}/logo.png`,
        width: 512,
        height: 512,
      },
      founder: {
        "@type": "Person",
        name: "Dhananjay Sapawat",
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "Indian Institute of Technology Delhi",
          alternateName: "IIT Delhi",
        },
        knowsAbout: [
          "Machine Learning",
          "Computer Vision",
          "Full Stack Development",
          "PyTorch",
          "Next.js",
          "FastAPI",
        ],
      },
      sameAs: [
        contact.social.github,
        contact.social.linkedin,
        contact.social.instagram,
      ],
    },

    // BreadcrumbList — matches actual routes from app/
    {
      "@type": "BreadcrumbList",
      "@id": `${site.url}/#breadcrumbs`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: site.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Image Analysis",
          item: `${site.url}/image-analysis`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Camera Capture",
          item: `${site.url}/camera-capture`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: "Live Webcam",
          item: `${site.url}/live-webcam`,
        },
        {
          "@type": "ListItem",
          position: 5,
          name: "Video Analysis",
          item: `${site.url}/video-analysis`,
        },
        {
          "@type": "ListItem",
          position: 6,
          name: "How It Works",
          item: `${site.url}/how-it-works`,
        },
        {
          "@type": "ListItem",
          position: 7,
          name: "About",
          item: `${site.url}/about`,
        },
        {
          "@type": "ListItem",
          position: 8,
          name: "Privacy Policy",
          item: `${site.url}/privacy-policy`,
        },
      ],
    },
  ],
};

// ── Layout ────────────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          strategy="beforeInteractive"
        />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}