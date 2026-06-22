import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Logo } from "@/components/logo";
import { localeHref } from "@/lib/nav";
import type { Locale } from "@/i18n/routing";

export function SiteFooter() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const year = new Date().getFullYear();

  const shopLinks = [
    { label: t("categories.pigments"), href: localeHref(locale, "shop/pigments") },
    { label: t("categories.mediums"), href: localeHref(locale, "shop/mediums") },
    { label: t("categories.sets"), href: localeHref(locale, "shop/sets") },
  ];

  const companyLinks = [
    { label: t("nav.about"), href: localeHref(locale, "about") },
    { label: t("nav.contact"), href: localeHref(locale, "contact") },
    { label: t("nav.agents"), href: localeHref(locale, "agents") },
  ];

  return (
    <footer className="border-t border-border bg-background">
      <div className="container-content grid grid-cols-2 gap-10 py-14 md:grid-cols-4 md:py-20">
        {/* Brand column */}
        <div className="col-span-2 md:col-span-1">
          <Logo />
          <p className="mt-5 max-w-xs text-sm text-muted-foreground">
            {t("footer.tagline")}
          </p>
        </div>

        {/* Shop */}
        <div>
          <h4 className="eyebrow mb-4">{t("footer.shopCol")}</h4>
          <ul className="space-y-3">
            {shopLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="eyebrow mb-4">{t("footer.companyCol")}</h4>
          <ul className="space-y-3">
            {companyLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="eyebrow mb-4">{t("footer.supportCol")}</h4>
          <ul className="space-y-3">
            <li>
              <Link
                href={localeHref(locale, "contact")}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("actions.getInTouch")}
              </Link>
            </li>
            <li>
              <Link
                href={localeHref(locale, "agents")}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("nav.agents")}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-content flex flex-col items-start justify-between gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {year} {t("brand.full")}. {t("footer.rights")}
          </p>
          <p>{t("footer.madeWith")}</p>
        </div>
      </div>
    </footer>
  );
}
