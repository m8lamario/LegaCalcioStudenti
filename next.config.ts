import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [
      {
        source: "/competitions/roma-school-cup",
        destination: "/competizioni/colosseo-cup",
        statusCode: 301,
      },
      {
        source: "/competitions/roma-school-cup/:path*",
        destination: "/competizioni/colosseo-cup",
        statusCode: 301,
      },
      {
        source: "/competitions/:slug/blog/:post",
        destination: "/competizioni/:slug/blog/:post",
        statusCode: 301,
      },
      {
        source: "/competitions/:slug/squadre/:team",
        destination: "/competizioni/:slug/squadre/:team",
        statusCode: 301,
      },
      {
        source: "/competitions/:slug/partite",
        destination: "/competizioni/:slug/partite",
        statusCode: 301,
      },
      {
        source: "/competitions/:slug/classifica",
        destination: "/competizioni/:slug/classifica",
        statusCode: 301,
      },
      {
        source: "/competitions/:slug/squadre",
        destination: "/competizioni/:slug/squadre",
        statusCode: 301,
      },
      {
        source: "/competitions/:slug/blog",
        destination: "/competizioni/:slug/blog",
        statusCode: 301,
      },
      {
        source: "/competitions/:slug/staff",
        destination: "/competizioni/:slug/staff",
        statusCode: 301,
      },
      {
        source: "/competitions/:slug/info",
        destination: "/competizioni/:slug/info",
        statusCode: 301,
      },
      {
        source: "/competitions/:slug/statistiche",
        destination: "/competizioni/:slug/statistiche",
        statusCode: 301,
      },
      {
        source: "/competitions/:slug/:path*",
        destination: "/competizioni/:slug",
        statusCode: 301,
      },
      {
        source: "/competitions/:slug",
        destination: "/competizioni/:slug",
        statusCode: 301,
      },
      {
        source: "/competitions",
        destination: "/#competizioni",
        statusCode: 301,
      },
      {
        source: "/partite",
        destination: "/#competizioni",
        statusCode: 301,
      },
      {
        source: "/squadre",
        destination: "/#competizioni",
        statusCode: 301,
      },
      {
        source: "/classifica",
        destination: "/#competizioni",
        statusCode: 301,
      },
      {
        source: "/team",
        destination: "/#mission",
        statusCode: 301,
      },
      {
        source: "/partner",
        destination: "/collabora",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
