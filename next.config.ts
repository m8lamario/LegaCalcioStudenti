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
        source: "/partite/:path*",
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
    ];
  },
};

export default nextConfig;
