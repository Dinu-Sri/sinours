/**
 * Sinours catalogue seed.
 * Source: prisma/catalog.json, built from the agent quotation.
 * Prices are intentionally absent. Re-running wipes Product and Agent rows
 * so a redeploy picks up catalogue changes. Contact messages are kept.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { PrismaClient, ProductCategory } from "@prisma/client";

const prisma = new PrismaClient();

type FormatRow = { id: string; size: string; sku: string };

type PigmentRow = {
  slug: string;
  code: string;
  series: string;
  colorFamily: string;
  nameEn: string;
  nameZh: string;
  pigmentIndex: string | null;
  featured: boolean;
  sortOrder: number;
  image: string | null;
  shortDescEn: string;
  shortDescZh: string;
  formats: FormatRow[];
};

type NamedRow = {
  slug: string;
  nameEn: string;
  nameZh: string;
  shortDescEn: string;
  shortDescZh: string;
  featured: boolean;
  sortOrder: number;
  image: string | null;
  formats: FormatRow[];
};

type AgentRow = {
  name: string;
  region: string;
  country: string;
  contact: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  sortOrder: number;
};

type Catalog = {
  pigments: PigmentRow[];
  sets: NamedRow[];
  mediums: NamedRow[];
  agents: AgentRow[];
};

function loadCatalog(): Catalog {
  const raw = readFileSync(path.join(process.cwd(), "prisma", "catalog.json"), "utf8");
  return JSON.parse(raw) as Catalog;
}

async function main() {
  const catalog = loadCatalog();
  console.log("Seeding Sinours catalogue…");

  await prisma.product.deleteMany();

  for (const p of catalog.pigments) {
    await prisma.product.create({
      data: {
        slug: p.slug,
        category: ProductCategory.PIGMENT,
        colorFamily: p.colorFamily,
        nameEn: p.nameEn,
        nameZh: p.nameZh,
        shortDescEn: p.shortDescEn,
        shortDescZh: p.shortDescZh,
        pigmentIndex: p.pigmentIndex,
        series: p.series,
        image: p.image,
        featured: p.featured,
        sortOrder: p.sortOrder,
        specs: { code: p.code, formats: p.formats },
      },
    });
  }

  for (const s of catalog.sets) {
    await prisma.product.create({
      data: {
        slug: s.slug,
        category: ProductCategory.SET,
        nameEn: s.nameEn,
        nameZh: s.nameZh,
        shortDescEn: s.shortDescEn,
        shortDescZh: s.shortDescZh,
        series: "Set",
        image: s.image,
        featured: s.featured,
        sortOrder: s.sortOrder,
        specs: { formats: s.formats },
      },
    });
  }

  for (const m of catalog.mediums) {
    await prisma.product.create({
      data: {
        slug: m.slug,
        category: ProductCategory.MEDIUM,
        nameEn: m.nameEn,
        nameZh: m.nameZh,
        shortDescEn: m.shortDescEn,
        shortDescZh: m.shortDescZh,
        series: "Medium",
        image: m.image,
        featured: m.featured,
        sortOrder: m.sortOrder,
        specs: { formats: m.formats },
      },
    });
  }

  await prisma.agent.deleteMany();
  for (const a of catalog.agents) {
    await prisma.agent.create({ data: a });
  }

  console.log(
    `Seeded ${catalog.pigments.length} colours, ${catalog.mediums.length} mediums, ${catalog.sets.length} sets, ${catalog.agents.length} contacts.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
