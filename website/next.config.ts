import { withContentCollections } from "@content-collections/next";
import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "placehold.co" },
      { hostname: "images.unsplash.com" },
      { hostname: "cdn.cosmos.so" },
    ],
  },
};

export default withContentCollections(config);
