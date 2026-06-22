import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChevronRight } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";
import { slugToCategory, VALID_CATEGORY_SLUGS } from "@/lib/categories";
import { PIGMENT_COLORS, type PigmentColor } from "@/lib/colors";
import { getProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return VALID_CATEGORY_SLUGS.map((slug) => ({ slug }));
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; category: string }>;
  searchParams: Promise<{ color?: string }>;
}) {
  const { locale, category } = await params;
  const { color } = await searchParams;
  setRequestLocale(locale as Locale);
  const categoryEnum = slugToCategory(category);
  if (!categoryEnum) notFound();

  const colorFamily = color && PIGMENT_COLORS.includes(color as PigmentColor)
    ? (color as PigmentColor)
    : null;

  const t = await getTranslations({ locale, namespace: "shop" });
  const tc = await getTranslations({ locale, namespace: "colors" });

  const products = await getProducts({
    category: categoryEnum,
    colorFamily: colorFamily ?? undefined,
    locale: locale as Locale,
  });
  const base = localeHref(locale as Locale, "shop");

  const heading =
    categoryEnum === "PIGMENT"
      ? colorFamily
        ? // @ts-expect-error dynamic color key
          tc(color)
        : tc("pigmentsShort" as never)
      : categoryEnum === "MEDIUM"
        ? tc("auxiliaryMedium" as never)
        : tc("watercolorSet" as never);

  return (
    <div className="container-content py-12 md:py-16">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href={localeHref(locale as Locale, "shop")} className="hover:text-foreground">
          {t("title")}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`${base}/${category}`} className="hover:text-foreground">
          {categoryEnum === "PIGMENT"
            ? tc("pigmentsShort" as never)
            : categoryEnum === "MEDIUM"
              ? tc("auxiliaryMedium" as never)
              : tc("watercolorSet" as never)}
        </Link>
        {colorFamily && (
          <>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">
              {/* @ts-expect-error dynamic color key */}
              {tc(color)}
            </span>
          </>
        )}
      </nav>

      <header className="mb-10">
        <h1 className="text-display-lg font-bold">{heading}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {t("results", { count: products.length })}
        </p>
      </header>

      <div className="grid gap-10 md:grid-cols-[220px_1fr]">
        {/* Sidebar filters */}
        <aside className="md:sticky md:top-28 md:self-start">
          <h2 className="eyebrow mb-4">{t("filters")}</h2>

          {/* Color filter — only meaningful for pigments */}
          {categoryEnum === "PIGMENT" && (
            <div className="mb-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("color")}
              </p>
              <ul className="space-y-1.5">
                {PIGMENT_COLORS.map((c) => (
                  <li key={c}>
                    <Link
                      href={`${base}/${category}?color=${c}`}
                      className={`block rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-surface-subtle hover:text-foreground ${
                        c === colorFamily
                          ? "bg-surface-subtle font-medium text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {/* @ts-expect-error dynamic color key */}
                      {tc(c)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("category")}
            </p>
            <ul className="space-y-1.5">
              {VALID_CATEGORY_SLUGS.map((slug) => (
                <li key={slug}>
                  <Link
                    href={`${base}/${slug}`}
                    className={`block rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-surface-subtle hover:text-foreground ${
                      slug === category && !colorFamily
                        ? "bg-surface-subtle font-medium text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {slug === "pigments"
                      ? tc("pigmentsShort" as never)
                      : slug === "mediums"
                        ? tc("auxiliaryMedium" as never)
                        : tc("watercolorSet" as never)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Grid */}
        <div>
          {products.length === 0 ? (
            <p className="py-20 text-center text-muted-foreground">{t("noResults")}</p>
          ) : (
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} localeHrefBase={base} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
