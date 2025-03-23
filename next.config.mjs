/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gs2mzagonmuf4l1k.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
