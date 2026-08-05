import { getOwnerAddress } from "@/lib/auth";

// TEMPORARY diagnostic route — delete after debugging the 503 on Vercel.
export const dynamic = "force-dynamic";

export async function GET() {
  const info: Record<string, unknown> = {
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasPrivateKey: !!process.env.PRIVATE_KEY,
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    ownerAddress: getOwnerAddress(),
  };
  try {
    const { prisma } = await import("@/lib/prisma");
    info.dbQuery = `ok count=${await prisma.user.count()}`;
  } catch (error) {
    info.dbError = error instanceof Error ? error.message : String(error);
    info.dbErrorStack =
      error instanceof Error
        ? error.stack?.split("\n").slice(0, 8).join("\n")
        : "";
  }
  return Response.json(info);
}
