import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  serverExternalPackages: ["isomorphic-dompurify", "jsdom"],
};

export default nextConfig;
