import { prisma } from "@/lib/db";

export async function getAgents(opts?: { region?: string; country?: string }) {
  const where: { region?: string; country?: string; active?: boolean } = { active: true };
  if (opts?.region && opts.region !== "all") where.region = opts.region;
  if (opts?.country) where.country = opts.country;

  return prisma.agent.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function getAgentRegions(): Promise<string[]> {
  const rows = await prisma.agent.findMany({
    where: { active: true },
    distinct: ["region"],
    orderBy: { region: "asc" },
  });
  return rows.map((r) => r.region);
}
