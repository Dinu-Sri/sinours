"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { navItems, localeHref } from "@/lib/nav";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { LangToggle } from "@/components/lang-toggle";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

export function SiteHeader() {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    const target = localeHref(locale, href);
    if (href === "") return pathname === target;
    return pathname.startsWith(target);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md">
      <div className="container-content flex h-16 items-center justify-between gap-4 md:h-20">
        {/* Left: logo */}
        <Link
          href={localeHref(locale, "")}
          className="shrink-0"
          onClick={() => setMobileOpen(false)}
        >
          <Logo />
        </Link>

        {/* Center: desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={localeHref(locale, item.href)}
              className={cn(
                "link-underline text-sm font-medium tracking-wide transition-colors",
                isActive(item.href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        {/* Right: toggles + mobile button */}
        <div className="flex items-center gap-1">
          <LangToggle className="hidden sm:block" />
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-subtle md:hidden"
            aria-label={mobileOpen ? t("close") : t("menu")}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container-content flex flex-col py-2">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={localeHref(locale, item.href)}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "py-3 text-base font-medium border-b border-border last:border-0",
                  isActive(item.href) ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="py-4">
              <LangToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
