import Link from "next/link";
import { useTranslations } from "next-intl";
import { ProductImage } from "@/components/product-image";
import type { ProductWithDerived } from "@/lib/products";
import { categorySlug } from "@/lib/categories";

export function ProductCard({
  product,
  localeHrefBase,
}: {
  product: ProductWithDerived;
  /** full locale-prefixed base, e.g. "/en/shop" */
  localeHrefBase: string;
}) {
  const t = useTranslations("colors");
  const colorLabel =
    product.colorFamily && product.colorFamily in t.raw(product.colorFamily)
      ? // @ts-expect-error dynamic key
        t(product.colorFamily)
      : null;

  const href = `${localeHrefBase}/${categorySlug(product.category)}/${product.slug}`;

  return (
    <Link href={href} className="group block">
      <div className="overflow-hidden rounded-lg border border-border bg-surface transition-shadow group-hover:shadow-soft">
        <ProductImage
          colorFamily={product.colorFamily}
          category={product.category}
          name={product.name}
        />
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold tracking-wide">{product.name}</h3>
        {product.pigmentIndex && (
          <span className="shrink-0 text-xs text-muted-foreground">
            {product.pigmentIndex}
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {colorLabel ?? product.shortDesc}
      </p>
    </Link>
  );
}
