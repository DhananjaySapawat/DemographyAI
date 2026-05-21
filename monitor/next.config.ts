import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['*.local', '192.168.0.*'],
};

export default nextConfig;
