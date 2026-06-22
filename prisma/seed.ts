/**
 * Sinours seed.
 * - 9 single-pigment colors (one per family)
 * - 2 mediums (repair, auxiliary)
 * - 2 sets (watercolor, medium)
 * - 5 sample agents across regions
 *
 * Specs use a simple { rating: 1-5, note } shape per attribute so the
 * product page can render a consistent spec table in both locales.
 */
import { PrismaClient, ProductCategory } from "@prisma/client";

const prisma = new PrismaClient();

type SpecEntry = { rating: number; note: string };
type LocalizedSpecs = {
  colorPowder: { en: SpecEntry; zh: SpecEntry };
  lightResistance: { en: SpecEntry; zh: SpecEntry };
  transparency: { en: SpecEntry; zh: SpecEntry };
  particleRegularity: { en: SpecEntry; zh: SpecEntry };
  coverage: { en: SpecEntry; zh: SpecEntry };
};

function specs(
  ratings: [number, number, number, number, number],
  enNotes: string[],
  zhNotes: string[],
): LocalizedSpecs {
  const [powder, light, trans, part, cov] = ratings;
  const keys = [
    "colorPowder",
    "lightResistance",
    "transparency",
    "particleRegularity",
    "coverage",
  ] as const;
  const out = {} as LocalizedSpecs;
  keys.forEach((k, i) => {
    out[k] = {
      en: { rating: ratings[i], note: enNotes[i] },
      zh: { rating: ratings[i], note: zhNotes[i] },
    };
  });
  return out;
}

const pigments = [
  {
    slug: "titanium-white",
    colorFamily: "white",
    pigmentIndex: "PW6",
    nameEn: "Titanium White",
    nameZh: "钛白",
    shortDescEn: "Opaque, high-coverage white for highlights and tints.",
    shortDescZh: "高覆盖、不透明的白色,适合提白与调浅。",
    ratings: [5, 5, 1, 5, 5],
    enNotes: ["Pure PW6 ground fine", "Excellent — no shift", "Opaque", "Very uniform", "Very high"],
    zhNotes: ["细磨纯 PW6", "极佳——无变色", "不透明", "颗粒均匀", "覆盖力强"],
    featured: true,
  },
  {
    slug: "cadmium-yellow",
    colorFamily: "yellow",
    pigmentIndex: "PY35",
    nameEn: "Cadmium Yellow",
    nameZh: "镉黄",
    shortDescEn: "Warm, lightfast yellow with strong tinting strength.",
    shortDescZh: "温暖耐光的黄色,着色力强。",
    ratings: [5, 5, 3, 4, 4],
    enNotes: ["Cadmium sulfide", "Excellent", "Semi-transparent", "Uniform", "High"],
    zhNotes: ["硫化镉", "极佳", "半透明", "颗粒均匀", "覆盖力较高"],
    featured: true,
  },
  {
    slug: "cadmium-orange",
    colorFamily: "orange",
    pigmentIndex: "PO20",
    nameEn: "Cadmium Orange",
    nameZh: "镉橙",
    shortDescEn: "Vivid orange that stays bright in washes.",
    shortDescZh: "在水洗中依旧明亮的鲜艳橙色。",
    ratings: [5, 5, 3, 4, 4],
    enNotes: ["Cadmium sulfoselenide", "Excellent", "Semi-transparent", "Uniform", "High"],
    zhNotes: ["镉磺硒化物", "极佳", "半透明", "颗粒均匀", "覆盖力较高"],
    featured: false,
  },
  {
    slug: "pyrrole-red",
    colorFamily: "red",
    pigmentIndex: "PR254",
    nameEn: "Pyrrole Red",
    nameZh: "吡咯红",
    shortDescEn: "Modern, extremely lightfast red with deep staining power.",
    shortDescZh: "现代耐光、着色力极强的红色。",
    ratings: [5, 5, 2, 5, 4],
    enNotes: ["Diketo-pyrrolo", "Excellent", "Low transparency", "Very uniform", "High"],
    zhNotes: ["二酮吡咯", "极佳", "透明度低", "颗粒均匀", "覆盖力较高"],
    featured: true,
  },
  {
    slug: "quinacridone-violet",
    colorFamily: "purple",
    pigmentIndex: "PV19",
    nameEn: "Quinacridone Violet",
    nameZh: "喹吖啶酮紫",
    shortDescEn: "Transparent, vivid violet with a glowing undertone.",
    shortDescZh: "透明、生动的紫色,底色通透。",
    ratings: [5, 5, 5, 5, 2],
    enNotes: ["Quinacridone", "Excellent", "Very transparent", "Very uniform", "Low"],
    zhNotes: ["喹吖啶酮", "极佳", "非常透明", "颗粒均匀", "覆盖力较低"],
    featured: false,
  },
  {
    slug: "ultramarine-blue",
    colorFamily: "blue",
    pigmentIndex: "PB29",
    nameEn: "Ultramarine Blue",
    nameZh: "群青",
    shortDescEn: "Granulating deep blue with a warm undertone.",
    shortDescZh: "具颗粒感的深蓝色,底色偏暖。",
    ratings: [5, 5, 4, 3, 3],
    enNotes: ["Complex sodium aluminosilicate", "Excellent", "Transparent", "Granulating", "Medium"],
    zhNotes: ["复合硅酸铝钠", "极佳", "透明", "具颗粒感", "覆盖力中等"],
    featured: true,
  },
  {
    slug: "phthalo-green",
    colorFamily: "green",
    pigmentIndex: "PG7",
    nameEn: "Phthalo Green",
    nameZh: "酞菁绿",
    shortDescEn: "Intense staining green, very transparent and lightfast.",
    shortDescZh: "着色力强、极透明且耐光的绿色。",
    ratings: [5, 5, 5, 5, 2],
    enNotes: ["Phthalocyanine", "Excellent", "Very transparent", "Very uniform", "Low"],
    zhNotes: ["酞菁", "极佳", "非常透明", "颗粒均匀", "覆盖力较低"],
    featured: false,
  },
  {
    slug: "lamp-black",
    colorFamily: "black",
    pigmentIndex: "PBk6",
    nameEn: "Lamp Black",
    nameZh: "灯黑",
    shortDescEn: "Soft, velvety black ideal for delicate shading.",
    shortDescZh: "柔和细腻的黑色,适合细腻的明暗过渡。",
    ratings: [5, 5, 3, 4, 4],
    enNotes: ["Carbon black", "Excellent", "Semi-transparent", "Uniform", "High"],
    zhNotes: ["碳黑", "极佳", "半透明", "颗粒均匀", "覆盖力较高"],
    featured: false,
  },
  {
    slug: "raw-sienna",
    colorFamily: "other",
    pigmentIndex: "PY43",
    nameEn: "Raw Sienna",
    nameZh: "生赭",
    shortDescEn: "Earth tone with beautiful granulation and warmth.",
    shortDescZh: "颗粒感丰富、温暖的土系色。",
    ratings: [4, 5, 4, 2, 3],
    enNotes: ["Natural iron oxide", "Excellent", "Transparent", "Granulating", "Medium"],
    zhNotes: ["天然氧化铁", "极佳", "透明", "具颗粒感", "覆盖力中等"],
    featured: false,
  },
];

const mediums = [
  {
    slug: "watercolor-repair-medium",
    nameEn: "Watercolor Repair Medium",
    nameZh: "水彩修复媒介剂",
    shortDescEn: "Re-wets and lifts dried watercolor for correction.",
    shortDescZh: "可重新激活并提起干燥水彩,便于修改。",
  },
  {
    slug: "auxiliary-painting-medium",
    nameEn: "Auxiliary Painting Medium",
    nameZh: "水彩辅助媒介剂",
    shortDescEn: "Slows drying and improves flow and blending.",
    shortDescZh: "延缓干燥、改善流动性与混色效果。",
  },
];

const sets = [
  {
    slug: "watercolor-set",
    nameEn: "Watercolor Set",
    nameZh: "水彩套装",
    shortDescEn: "A balanced palette of 12 Sinours pigments.",
    shortDescZh: "精选 12 色 Sinours 颜料套装。",
  },
  {
    slug: "medium-set",
    nameEn: "Medium Set",
    nameZh: "媒介剂套装",
    shortDescEn: "Both Sinours mediums in one set.",
    shortDescZh: "两款 Sinours 媒介剂组合套装。",
  },
];

async function main() {
  console.log("Seeding Sinours…");

  // Products — wipe and reseed for idempotency during phase 1.
  await prisma.product.deleteMany();

  for (let i = 0; i < pigments.length; i++) {
    const p = pigments[i];
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
        series: "Artists",
        image: `/products/${p.slug}.svg`,
        featured: p.featured,
        sortOrder: i,
        specs: specs(
          p.ratings,
          p.enNotes,
          p.zhNotes,
        ) as unknown as Record<string, unknown>,
      },
    });
  }

  for (let i = 0; i < mediums.length; i++) {
    const m = mediums[i];
    await prisma.product.create({
      data: {
        slug: m.slug,
        category: ProductCategory.MEDIUM,
        nameEn: m.nameEn,
        nameZh: m.nameZh,
        shortDescEn: m.shortDescEn,
        shortDescZh: m.shortDescZh,
        series: "Studio",
        image: `/products/${m.slug}.svg`,
        sortOrder: i,
        specs: {} as Record<string, unknown>,
      },
    });
  }

  for (let i = 0; i < sets.length; i++) {
    const s = sets[i];
    await prisma.product.create({
      data: {
        slug: s.slug,
        category: ProductCategory.SET,
        nameEn: s.nameEn,
        nameZh: s.nameZh,
        shortDescEn: s.shortDescEn,
        shortDescZh: s.shortDescZh,
        series: "Collection",
        image: `/products/${s.slug}.svg`,
        featured: i === 0,
        sortOrder: i,
        specs: {} as Record<string, unknown>,
      },
    });
  }

  // Agents — wipe and reseed.
  await prisma.agent.deleteMany();
  const agents = [
    {
      name: "Sinours Flagship — Shanghai",
      region: "East China",
      country: "China",
      contact: "Sales Desk",
      email: "shanghai@sinours.example",
      phone: "+86 21 0000 0000",
      sortOrder: 0,
    },
    {
      name: "Beijing Art Supplies",
      region: "North China",
      country: "China",
      contact: "Mr. Li",
      email: "beijing@sinours.example",
      phone: "+86 10 0000 0000",
      sortOrder: 1,
    },
    {
      name: "Guangzhou Color House",
      region: "South China",
      country: "China",
      contact: "Ms. Chen",
      email: "guangzhou@sinours.example",
      phone: "+86 20 0000 0000",
      sortOrder: 2,
    },
    {
      name: "Tokyo Pigment Co.",
      region: "East Asia",
      country: "Japan",
      contact: "Sales",
      email: "tokyo@sinours.example",
      phone: "+81 3 0000 0000",
      sortOrder: 3,
    },
    {
      name: "Berlin Artists' Materials",
      region: "Europe",
      country: "Germany",
      contact: "Frau Müller",
      email: "berlin@sinours.example",
      phone: "+49 30 000000",
      sortOrder: 4,
    },
  ];
  for (const a of agents) {
    await prisma.agent.create({ data: a });
  }

  console.log(`Seeded ${pigments.length} pigments, ${mediums.length} mediums, ${sets.length} sets, ${agents.length} agents.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
