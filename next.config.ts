import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure the Prisma engine binaries (lib/generated/prisma) are always
  // copied into every API route's serverless bundle, matching whichever
  // platform the lambda runtime detects.
  outputFileTracingIncludes: {
    "/api/*": ["./lib/generated/prisma/**/*"],
  },
};

export default nextConfig;
