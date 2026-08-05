// The schema uses the new `prisma-client` generator which outputs to
// lib/generated/prisma (see prisma/schema.prisma). The classic
// `@prisma/client` entry point is only a throwing stub unless the
// `prisma-client-js` generator is configured, so import from the generated
// client directly.
//
// On Vercel, outputFileTracingIncludes ships the engine binary into the
// lambda at <cwd>/lib/generated/prisma, but Turbopack rewrites the client's
// import.meta.url to a synthetic "/ROOT" root, so Prisma's own engine
// resolution looks in the wrong place and throws "could not locate the
// Query Engine". Point it at the deployed binary explicitly instead.
import { existsSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "./generated/prisma/client";

const engineDir = path.resolve(process.cwd(), "lib/generated/prisma");
const candidates = [
  path.join(engineDir, "libquery_engine-rhel-openssl-3.0.x.so.node"),
  path.join(engineDir, "libquery_engine-debian-openssl-1.1.x.so.node"),
];
const deployedEngine = candidates.find((p) => existsSync(p));
if (deployedEngine && !process.env.PRISMA_QUERY_ENGINE_LIBRARY) {
  process.env.PRISMA_QUERY_ENGINE_LIBRARY = deployedEngine;
}

export const prisma = new PrismaClient();
