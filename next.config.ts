import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  // output: "standalone", // Uncomment this line if using docker
  images: {
    remotePatterns: [
      { hostname: "localhost" },
      { hostname: "lh3.googleusercontent.com" },
    ],
  },
}

export default nextConfig
