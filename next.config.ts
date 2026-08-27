import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'],
  },
  experimental: {
    optimizePackageImports: ['recharts', 'lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
