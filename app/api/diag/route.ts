import { getOwnerAddress } from "@/lib/auth";
import { readdirSync, existsSync } from "node:fs";
import path from "node:path";

// TEMPORARY diagnostic route — delete after debugging the 503 on Vercel.
export const dynamic = "force-dynamic";

function listEngines(dir: string): string[] | null {
  try {
    if (!existsSync(dir)) return null;
    return readdirSync(dir)
      .filter((f) => f.includes("libquery_engine") || f.endsWith(".so.node"))
      .sort();
  } catch {
    return null;
  }
}

export async function GET() {
  const info: Record<string, unknown> = {
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasPrivateKey: !!process.env.PRIVATE_KEY,
    node: process.version,
    cwd: process.cwd(),
    ownerAddress: getOwnerAddress(),
    candidateDirs: {} as Record<string, unknown>,
  };
  const dirs = [
    "/vercel/path0/lib/generated/prisma",
    "/var/task/lib/generated/prisma",
    "/ROOT/lib/generated/prisma",
    path.join(process.cwd(), "lib/generated/prisma"),
    "/vercel/path0/node_modules/.prisma/client",
  ];
  for (const dir of dirs) {
    (info.candidateDirs as Record<string, unknown>)[dir] = listEngines(dir);
  }
  try {
    const { prisma } = await import("@/lib/prisma");
    info.dbQuery = `ok count=${await prisma.user.count()}`;
  } catch (error) {
    info.dbError =
      error instanceof Error
        ? error.message.split("\n").slice(0, 12).join("\n")
        : String(error);
  }
  return Response.json(info);
}
