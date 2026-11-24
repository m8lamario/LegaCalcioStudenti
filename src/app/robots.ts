import type { MetadataRoute } from "next";
import { absoluteUrl, isProductionIndexable } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const brandAssets = [
    "/favicon.ico",
    "/icon.png",
    "/icon1.png",
    "/apple-icon.png",
    "/manifest.webmanifest",
    "/brand/",
  ];

  if (!isProductionIndexable()) {
    return {
      rules: {
        userAgent: "*",
        allow: brandAssets,
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/auth"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
