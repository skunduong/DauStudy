import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    localPatterns: [{ pathname: "/cards/**", search: "?v=3" }],
  },
  devIndicators: false,
  // Workers cancel Cache Components requests. Local `next dev` keeps them.
  cacheComponents: process.env.CF_BUILD === "1" ? false : true,
  partialPrefetching: process.env.CF_BUILD === "1" ? false : true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
