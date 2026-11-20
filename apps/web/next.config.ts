import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/validations"],
  cacheComponents: true,
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error("NEXT_PUBLIC_API_URL is required");
    }
    const destination = apiUrl.replace(/\/$/, "");
    return [
      {
        source: "/auth/:path*",
        destination: `${destination}/auth/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_CDNHOST!,
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
