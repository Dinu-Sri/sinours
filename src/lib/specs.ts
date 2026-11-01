import type { Product } from "@prisma/client";

export type FormatRow = { id: string; size: string; sku: string };

type SpecsShape = {
  code?: string;
  formats?: FormatRow[];
};

function asSpecs(specs: Product["specs"]): SpecsShape {
  if (!specs || typeof specs !== "object" || Array.isArray(specs)) return {};
  return specs as SpecsShape;
}

export function readColourCode(product: Pick<Product, "specs">): string | null {
  const code = asSpecs(product.specs).code;
  return typeof code === "string" && code.length > 0 ? code : null;
}

export function readFormats(product: Pick<Product, "specs">): FormatRow[] {
  const formats = asSpecs(product.specs).formats;
  if (!Array.isArray(formats)) return [];
  return formats.filter(
    (row) =>
      !!row &&
      typeof row.sku === "string" &&
      row.sku.length > 0 &&
      typeof row.size === "string",
  );
}
