import { defineRouting } from "next-intl/routing";

/**
 * Central i18n routing definition.
 * Used by both the middleware and the request config so they stay in sync.
 */
export const routing = defineRouting({
  locales: ["en", "zh"],
  defaultLocale: "en",
});

export type Locale = (typeof routing.locales)[number];
export const defaultLocale = routing.defaultLocale;

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  zh: "中文",
};
