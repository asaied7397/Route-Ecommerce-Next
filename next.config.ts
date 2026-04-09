import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    domains: ["ecommerce.routemisr.com"],
  },
  async redirects() {
    return [
      {
        source: "/allorders",
        destination: "/orders",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
