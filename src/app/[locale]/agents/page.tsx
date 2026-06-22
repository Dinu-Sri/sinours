import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, Phone, Globe, MapPin, ArrowRight } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { localeHref } from "@/lib/nav";
import { getAgents, getAgentRegions } from "@/lib/agents";

export const dynamic = "force-dynamic";

export default async function AgentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations({ locale, namespace: "agents" });
  const tc = await getTranslations({ locale, namespace: "contact" });

  const [agents, regions] = await Promise.all([getAgents(), getAgentRegions()]);

  return (
    <div className="container-content py-16 md:py-24">
      <header className="mb-12 max-w-2xl">
        <h1 className="text-display-lg font-bold">{t("title")}</h1>
        <p className="mt-5 text-lg text-muted-foreground">{t("subtitle")}</p>
      </header>

      {/* Region quick filter (anchor links for phase 1, no client state) */}
      {regions.length > 0 && (
        <div className="mb-10 flex flex-wrap gap-2">
          <span className="rounded-full border border-border px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t("all")}
          </span>
          {regions.map((r) => (
            <a
              key={r}
              href={`#region-${r.replace(/\s+/g, "-").toLowerCase()}`}
              className="rounded-full border border-border px-4 py-2 text-xs font-medium uppercase tracking-wide transition-colors hover:border-foreground hover:text-foreground"
            >
              {r}
            </a>
          ))}
        </div>
      )}

      {/* Directory */}
      {agents.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">
          {locale === "zh" ? "暂无代理。" : "No agents yet."}
        </p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {agents.map((a) => (
            <div
              key={a.id}
              id={`region-${a.region.replace(/\s+/g, "-").toLowerCase()}`}
              className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-7"
            >
              <div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" strokeWidth={1.5} />
                  <span className="text-xs font-medium uppercase tracking-wide">
                    {a.region} · {a.country}
                  </span>
                </div>
                <h2 className="mt-3 text-xl font-bold">{a.name}</h2>
                {a.contact && (
                  <p className="mt-1 text-sm text-muted-foreground">{a.contact}</p>
                )}
              </div>

              <ul className="mt-6 space-y-2 text-sm">
                {a.email && (
                  <li className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                    <a href={`mailto:${a.email}`} className="link-underline">
                      {a.email}
                    </a>
                  </li>
                )}
                {a.phone && (
                  <li className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                    <a href={`tel:${a.phone}`} className="link-underline">
                      {a.phone}
                    </a>
                  </li>
                )}
                {a.website && (
                  <li className="flex items-center gap-2.5">
                    <Globe className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                    <a
                      href={a.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline"
                    >
                      {a.website.replace(/^https?:\/\//, "")}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Become an agent CTA */}
      <section className="mt-16 rounded-3xl border border-border bg-surface-subtle p-10 md:p-14">
        <p className="eyebrow">{t("becomeAgent")}</p>
        <h2 className="mt-4 max-w-2xl text-2xl font-bold md:text-3xl">
          {t("becomeAgentBody")}
        </h2>
        <Link
          href={localeHref(locale as Locale, "contact")}
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-8 text-sm font-medium text-background transition-opacity hover:opacity-85"
        >
          {tc("formTitle")}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
