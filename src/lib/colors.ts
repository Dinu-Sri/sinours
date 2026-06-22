/**
 * Color families for pigments, in display order.
 * Keys match Product.colorFamily and the `colors.*` translation keys.
 */
export const PIGMENT_COLORS = [
  "white",
  "yellow",
  "orange",
  "red",
  "purple",
  "blue",
  "green",
  "black",
  "other",
] as const;

export type PigmentColor = (typeof PIGMENT_COLORS)[number];

/**
 * Representative hex per color family, used to render placeholder swatches
 * on product cards. Real photography replaces these via Product.image.
 */
export const COLOR_HEX: Record<PigmentColor, string> = {
  white: "#f7f6f3",
  yellow: "#f2c14e",
  orange: "#e87b35",
  red: "#c0392b",
  purple: "#6c3483",
  blue: "#2c5697",
  green: "#3a7d44",
  black: "#1c1c1c",
  other: "#8a8a8a",
};
