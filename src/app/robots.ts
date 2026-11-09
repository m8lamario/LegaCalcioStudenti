import type { MetadataRoute } from "next";
import { absoluteUrl, isProductionIndexable } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  if (!isProductionIndexable()) {
    return {
      rules: {
        userAgent: "*",
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
