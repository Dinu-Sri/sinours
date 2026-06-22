import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";
import { getProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations({ locale, namespace: "shop" });
  const tc = await getTranslations({ locale, namespace: "categories" });

  const featured = await getProducts({ locale: locale as Locale }).then((rows) =>
    rows.filter((r) => r.featured).slice(0, 6),
  );
  const base = localeHref(locale as Locale, "shop");

  const categories = [
    {
      title: tc("pigments"),
      short: tc("pigmentsShort"),
      href: `${base}/pigments`,
    },
    {
      title: tc("mediums"),
      short: tc("mediumsShort"),
      href: `${base}/mediums`,
    },
    {
      title: tc("sets"),
      short: tc("setsShort"),
      href: `${base}/sets`,
    },
  ];

  return (
    <div className="container-content py-16 md:py-24">
      {/* Header */}
      <header className="mb-14 max-w-2xl">
        <h1 className="text-display-lg font-bold">{t("title")}</h1>
        <p className="mt-5 text-lg text-muted-foreground">{t("subtitle")}</p>
      </header>

      {/* Category cards */}
      <section className="mb-20">
        <h2 className="eyebrow mb-6">{t("browseCategories")}</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-surface p-8 transition-all hover:border-foreground hover:shadow-soft"
            >
              <div>
                <p className="eyebrow">{c.short}</p>
                <h3 className="mt-2 text-2xl font-bold">{c.title}</h3>
              </div>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium">
                {t("viewDetails")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section>
          <h2 className="eyebrow mb-6">
            {locale === "zh" ? "精选产品" : "Featured"}
          </h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} localeHrefBase={base} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
