import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      // 👇 Add the domain where your character images are hosted
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Example: Replace with your actual image domain
        pathname: "/**",
      },
      // You can add as many as you need...
    ],
  },
};

export default nextConfig;