import type { NextConfig } from "next";

/** Set by `CF_BUILD=1 npm run deploy` for the Cloudflare Pages (OpenNext) build. */
const cloudflare = process.env.CF_BUILD === "1";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    localPatterns: [{ pathname: "/cards/**", search: "?v=3" }],
    // Cloudflare Pages has no image optimizer binding, so serve the card photos as they are.
    unoptimized: cloudflare,
  },
  devIndicators: false,
  // OpenNext does not support Cache Components yet: on Workers the page render hangs. The app uses no cache APIs.
  cacheComponents: !cloudflare,
  partialPrefetching: !cloudflare,
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
