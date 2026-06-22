import type { ProductCategory } from "@prisma/client";

/**
 * URL slugs for the three product category landing pages.
 * Routes: /<locale>/shop/<slug>
 */
export const CATEGORY_SLUGS = {
  PIGMENT: "pigments",
  MEDIUM: "mediums",
  SET: "sets",
} as const;

export function categorySlug(category: ProductCategory): string {
  return CATEGORY_SLUGS[category];
}

export function slugToCategory(slug: string): ProductCategory | null {
  const entry = (Object.entries(CATEGORY_SLUGS) as [ProductCategory, string][]).find(
    ([, s]) => s === slug,
  );
  return entry ? entry[0] : null;
}

export const VALID_CATEGORY_SLUGS = Object.values(CATEGORY_SLUGS);
