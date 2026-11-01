import { prisma } from "@/lib/db";
import type { Locale } from "@/i18n/routing";
import type { Product } from "@prisma/client";

export type ProductWithDerived = Product & {
  /** Localized name for the current locale. */
  name: string;
  /** Localized short description. */
  shortDesc: string | null;
  /** Manufacturer colour number, when this row is a single colour. */
  code: string | null;
};

function colourCode(specs: Product["specs"]): string | null {
  if (!specs || typeof specs !== "object" || Array.isArray(specs)) return null;
  const code = (specs as { code?: unknown }).code;
  return typeof code === "string" && code.length > 0 ? code : null;
}

export function localizeProduct(p: Product, locale: Locale): ProductWithDerived {
  return {
    ...p,
    name: locale === "zh" ? p.nameZh : p.nameEn,
    shortDesc: locale === "zh" ? p.shortDescZh : p.shortDescEn,
    code: colourCode(p.specs),
  };
}

export async function getProducts(opts?: {
  category?: string;
  colorFamily?: string;
  locale: Locale;
}): Promise<ProductWithDerived[]> {
  const where: { category?: Product["category"]; colorFamily?: string } = {};
  if (opts?.category) {
    const cat = opts.category.toUpperCase();
    if (cat === "PIGMENT" || cat === "MEDIUM" || cat === "SET") {
      where.category = cat as Product["category"];
    }
  }
  if (opts?.colorFamily) {
    where.colorFamily = opts.colorFamily.toLowerCase();
  }

  const rows = await prisma.product.findMany({
    where,
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { nameEn: "asc" }],
  });

  return rows.map((p) => localizeProduct(p, opts?.locale ?? "en"));
}

export async function getProductBySlug(
  slug: string,
  locale: Locale,
): Promise<ProductWithDerived | null> {
  const row = await prisma.product.findUnique({ where: { slug } });
  return row ? localizeProduct(row, locale) : null;
}

export async function getRelatedProducts(
  product: Product,
  locale: Locale,
  take = 3,
): Promise<ProductWithDerived[]> {
  const rows = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      OR: [
        { category: product.category },
        ...(product.colorFamily ? [{ colorFamily: product.colorFamily }] : []),
      ],
    },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
    take,
  });
  return rows.map((p) => localizeProduct(p, locale));
}
