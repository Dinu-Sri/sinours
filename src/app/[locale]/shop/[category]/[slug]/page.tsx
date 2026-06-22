import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChevronRight, MapPin } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";
import { slugToCategory, categorySlug } from "@/lib/categories";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { readSpecs, ratingDots, type SpecKey } from "@/lib/specs";
import { ProductImage } from "@/components/product-image";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}) {
  const { locale, category, slug } = await params;
  setRequestLocale(locale as Locale);
  const categoryEnum = slugToCategory(category);
  if (!categoryEnum) notFound();

  const product = await getProductBySlug(slug, locale as Locale);
  if (!product || product.category !== categoryEnum) notFound();

  const t = await getTranslations({ locale, namespace: "product" });
  const tc = await getTranslations({ locale, namespace: "colors" });
  const ta = await getTranslations({ locale, namespace: "actions" });

  const specs = readSpecs(product, locale as Locale);
  const related = await getRelatedProducts(product, locale as Locale, 3);
  const base = localeHref(locale as Locale, "shop");

  // @ts-expect-error dynamic color key
  const colorLabel = product.colorFamily ? tc(product.colorFamily) : null;

  return (
    <article className="container-content py-12 md:py-16">
      {/* Breadcrumb */}
      <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <Link href={localeHref(locale as Locale, "shop")} className="hover:text-foreground">
          {locale === "zh" ? "产品" : "Shop"}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`${base}/${category}`} className="hover:text-foreground capitalize">
          {category}
        </Link>
        {colorLabel && (
          <>
            <ChevronRight className="h-3 w-3" />
            <span>{colorLabel}</span>
          </>
        )}
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        {/* Image */}
        <div>
          <ProductImage
            colorFamily={product.colorFamily}
            category={product.category}
            name={product.name}
            size="lg"
            className="border-0"
          />
        </div>

        {/* Summary */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            {colorLabel && (
              <span className="eyebrow">{colorLabel}</span>
            )}
            {product.series && (
              <span className="text-xs text-muted-foreground">{product.series}</span>
            )}
          </div>
          <h1 className="mt-3 text-display-lg font-bold">{product.name}</h1>
          {product.pigmentIndex && (
            <p className="mt-3 text-sm text-muted-foreground">
              {t("pigmentIndex")}: <span className="font-mono">{product.pigmentIndex}</span>
            </p>
          )}
          {product.shortDesc && (
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
              {product.shortDesc}
            </p>
          )}

          <div className="mt-8 rounded-xl border border-border bg-surface-subtle p-5">
            <p className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 shrink-0" />
              {t("findAgentToOrder")}
            </p>
            <Link
              href={localeHref(locale as Locale, "agents")}
              className="mt-3 inline-flex items-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-85"
            >
              {ta("findAgent")}
            </Link>
          </div>
        </div>
      </div>

      {/* Specifications */}
      {specs.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold md:text-3xl">{t("specifications")}</h2>
          <div className="mt-6 overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <tbody>
                {specs.map((row, i) => (
                  <tr
                    key={row.key}
                    className={i % 2 === 0 ? "bg-surface" : "bg-surface-subtle"}
                  >
                    <th className="w-1/3 px-5 py-4 text-left align-top font-medium text-muted-foreground md:w-1/4">
                      {t(row.key as SpecKey)}
                    </th>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex gap-1" aria-label={`${row.rating}/5`}>
                          {ratingDots(row.rating).map((d, idx) => (
                            <span
                              key={idx}
                              className={`h-2 w-2 rounded-full ${
                                d === "on" ? "bg-foreground" : "bg-muted"
                              }`}
                            />
                          ))}
                        </span>
                        {row.note && (
                          <span className="text-muted-foreground">{row.note}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold md:text-3xl">{t("relatedProducts")}</h2>
          <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                localeHrefBase={`${base}/${categorySlug(p.category)}`}
              />
            ))}
          </div>
        </section>
      )}

      <div className="mt-16">
        <Link href={`${base}/${category}`} className="link-underline text-sm font-medium">
          {ta("backToShop")}
        </Link>
      </div>
    </article>
  );
}
