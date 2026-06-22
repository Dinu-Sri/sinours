import { getTranslations, setRequestLocale } from "next-intl/server";
import { BarChart3, Database, ShieldCheck } from "lucide-react";
import type { Locale } from "@/i18n/routing";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations({ locale, namespace: "about" });

  const values = [
    {
      icon: Database,
      title: t("values.pigment.title"),
      body: t("values.pigment.body"),
    },
    {
      icon: BarChart3,
      title: t("values.data.title"),
      body: t("values.data.body"),
    },
    {
      icon: ShieldCheck,
      title: t("values.archive.title"),
      body: t("values.archive.body"),
    },
  ];

  return (
    <div className="container-content py-16 md:py-24">
      <header className="mb-16 max-w-2xl">
        <h1 className="text-display-lg font-bold">{t("title")}</h1>
        <p className="mt-5 text-lg text-muted-foreground">{t("subtitle")}</p>
      </header>

      {/* Company intro */}
      <section className="grid gap-10 border-y border-border py-16 md:grid-cols-[1fr_1.4fr] md:py-20">
        <h2 className="text-2xl font-bold md:text-3xl">{t("companyTitle")}</h2>
        <p className="text-lg leading-relaxed text-muted-foreground">
          {t("companyBody")}
        </p>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20">
        <h2 className="mb-10 text-2xl font-bold md:text-3xl">{t("valuesTitle")}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-border bg-surface p-8"
            >
              <v.icon className="h-8 w-8" strokeWidth={1.5} />
              <h3 className="mt-6 text-xl font-bold">{v.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
