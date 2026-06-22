import type { Product } from "@prisma/client";
import type { Locale } from "@/i18n/routing";

/**
 * Shape of the localized specs JSON stored on Product.specs for pigments.
 * Each attribute has a 1–5 rating and a short note per locale.
 */
type SpecValue = { rating: number; note: string };
type LocalizedSpec = { en: SpecValue; zh: SpecValue };
type PigmentSpecs = {
  colorPowder?: LocalizedSpec;
  lightResistance?: LocalizedSpec;
  transparency?: LocalizedSpec;
  particleRegularity?: LocalizedSpec;
  coverage?: LocalizedSpec;
};

export const SPEC_KEYS = [
  "colorPowder",
  "lightResistance",
  "transparency",
  "particleRegularity",
  "coverage",
] as const;

export type SpecKey = (typeof SPEC_KEYS)[number];

export function readSpecs(
  product: Pick<Product, "specs" | "category">,
  locale: Locale,
): Array<{ key: SpecKey; rating: number; note: string }> {
  if (product.category !== "PIGMENT") return [];
  const data = (product.specs ?? {}) as PigmentSpecs;
  return SPEC_KEYS.map((key) => {
    const entry = data[key];
    const loc = entry?.[locale];
    return {
      key,
      rating: loc?.rating ?? 0,
      note: loc?.note ?? "",
    };
  }).filter((row) => row.rating > 0 || row.note);
}

/** 5-dot rating renderer string (filled vs empty). */
export function ratingDots(rating: number): Array<"on" | "off"> {
  const clamped = Math.max(0, Math.min(5, rating));
  return Array.from({ length: 5 }, (_, i) => (i < clamped ? "on" : "off"));
}
