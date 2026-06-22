import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, FlaskConical, Layers, Palette } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";
import { ImagePlaceholder } from "@/components/image-placeholder";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations({ locale, namespace: "home" });
  const tc = await getTranslations({ locale, namespace: "categories" });
  const ta = await getTranslations({ locale, namespace: "actions" });

  const categories = [
    {
      icon: Palette,
      title: tc("pigments"),
      short: tc("pigmentsShort"),
      desc: t("pigmentsDesc"),
      href: localeHref(locale as Locale, "shop/pigments"),
    },
    {
      icon: FlaskConical,
      title: tc("mediums"),
      short: tc("mediumsShort"),
      desc: t("mediumsDesc"),
      href: localeHref(locale as Locale, "shop/mediums"),
    },
    {
      icon: Layers,
      title: tc("sets"),
      short: tc("setsShort"),
      desc: t("setsDesc"),
      href: localeHref(locale as Locale, "shop/sets"),
    },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="container-content grid gap-12 py-20 md:grid-cols-[1.1fr_1fr] md:items-end md:py-32">
          <div className="max-w-2xl">
            <p className="eyebrow">{t("heroEyebrow")}</p>
            <h1 className="mt-6 text-display-xl font-bold leading-[0.95]">
              {t("heroTitle")}
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground">
              {t("heroSubtitle")}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href={localeHref(locale as Locale, "shop")}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-8 text-sm font-medium text-background transition-opacity hover:opacity-85"
              >
                {t("heroPrimary")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={localeHref(locale as Locale, "agents")}
                className="inline-flex h-12 items-center rounded-full border border-foreground px-8 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
              >
                {t("heroSecondary")}
              </Link>
            </div>
          </div>
          <ImagePlaceholder
            label={locale === "zh" ? "主视觉图" : "Hero image"}
            hint={locale === "zh" ? "1920×1080 · 工作室场景" : "1920×1080 · studio scene"}
            variant="hero"
          />
        </div>
      </section>

      {/* STORY */}
      <section className="border-b border-border">
        <div className="container-content grid gap-12 py-20 md:grid-cols-2 md:py-28">
          <div>
            <p className="eyebrow">{t("storyEyebrow")}</p>
            <h2 className="mt-5 text-display-lg font-bold">{t("storyTitle")}</h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {t("storyBody")}
            </p>
          </div>
          <ImagePlaceholder
            label={locale === "zh" ? "研磨工艺" : "Milling process"}
            hint={locale === "zh" ? "1200×900 · 工艺特写" : "1200×900 · process close-up"}
            variant="landscape"
          />
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-content py-20 md:py-28">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">{t("categoriesEyebrow")}</p>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              {t("categoriesTitle")}
            </h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-surface p-8 transition-all hover:border-foreground hover:shadow-soft"
            >
              <div>
                <c.icon className="h-8 w-8" strokeWidth={1.5} />
                <p className="eyebrow mt-8">{c.short}</p>
                <h3 className="mt-2 text-2xl font-bold">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {c.desc}
                </p>
              </div>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium">
                {ta("learnMore")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
