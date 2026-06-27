import type { NextConfig } from "next"

const nextConfig: NextConfig & { eslint?: { ignoreDuringBuilds?: boolean } } = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
  },
}

export default nextConfig