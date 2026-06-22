import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { localeHref } from "@/lib/nav";
import type { Locale } from "@/i18n/routing";

export default function NotFound() {
  const t = useTranslations("common");
  const locale = useLocale() as Locale;

  return (
    <div className="container-content flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-display-lg font-bold">{t("notFound")}</h1>
      <Link
        href={localeHref(locale, "")}
        className="link-underline mt-8 text-sm font-medium"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
