import type { Locale } from "@/i18n/routing";

export type NavItem = {
  /** translation key under `nav` */
  key: "home" | "shop" | "about" | "contact" | "agents";
  /** path segment after the locale prefix */
  href: string;
};

/**
 * Primary navigation. `href` values are locale-relative;
 * the header prepends the current locale at render time.
 */
export const navItems: NavItem[] = [
  { key: "home", href: "" },
  { key: "shop", href: "shop" },
  { key: "about", href: "about" },
  { key: "agents", href: "agents" },
  { key: "contact", href: "contact" },
];

export function localeHref(locale: Locale, href: string): string {
  const clean = href.replace(/^\/+/, "");
  return clean ? `/${locale}/${clean}` : `/${locale}`;
}
