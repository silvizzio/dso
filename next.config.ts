import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  basePath: '/dso',
  // Pin the project root: a second package-lock.json in the parent folder confuses the root detection.
  turbopack: { root: __dirname },
  outputFileTracingIncludes: {
    "/api/pdf": ["./content/docs/**/*"],
  },
  serverExternalPackages: ["@sparticuz/chromium-min", "puppeteer-core", "pdf-lib"],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dso',
        basePath: false,
        permanent: false,
      },
    ];
  },
};
export default nextConfig;
