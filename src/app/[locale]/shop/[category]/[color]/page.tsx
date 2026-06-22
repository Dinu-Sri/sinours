import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChevronRight } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";
import { slugToCategory } from "@/lib/categories";
import { PIGMENT_COLORS, type PigmentColor } from "@/lib/colors";
import { getProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  // Only pigments are filtered by color family.
  return PIGMENT_COLORS.map((color) => ({ category: "pigments", color }));
}

export default async function ColorPage({
  params,
}: {
  params: Promise<{ locale: string; category: string; color: string }>;
}) {
  const { locale, category, color } = await params;
  setRequestLocale(locale as Locale);
  const categoryEnum = slugToCategory(category);
  const colorFamily = PIGMENT_COLORS.includes(color as PigmentColor)
    ? (color as PigmentColor)
    : null;
  if (!categoryEnum || !colorFamily) notFound();

  const t = await getTranslations({ locale, namespace: "shop" });
  const tc = await getTranslations({ locale, namespace: "colors" });

  const products = await getProducts({
    category: categoryEnum,
    colorFamily,
    locale: locale as Locale,
  });
  const base = localeHref(locale as Locale, "shop");

  // @ts-expect-error dynamic color key
  const colorLabel = tc(color);

  return (
    <div className="container-content py-12 md:py-16">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href={localeHref(locale as Locale, "shop")} className="hover:text-foreground">
          {t("title")}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`${base}/pigments`} className="hover:text-foreground">
          {tc("pigmentsShort" as never)}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{colorLabel}</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-display-lg font-bold">{colorLabel}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {t("results", { count: products.length })}
        </p>
      </header>

      {products.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">{t("noResults")}</p>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} localeHrefBase={base} />
          ))}
        </div>
      )}

      {/* Back to all pigments */}
      <div className="mt-16">
        <Link
          href={`${base}/pigments`}
          className="link-underline text-sm font-medium"
        >
          {t("all")}
        </Link>
      </div>
    </div>
  );
}
