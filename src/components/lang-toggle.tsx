"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { routing, type Locale, localeLabels } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";

/**
 * Switches the active locale by swapping the first path segment, preserving
 * the rest of the route (so /en/shop/pigments -> /zh/shop/pigments).
 */
export function LangToggle({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const t = useTranslations("language");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function switchTo(next: Locale) {
    setOpen(false);
    if (next === locale) return;

    // pathname comes back as /<locale>/... — rebuild with the new locale.
    const segments = Array.isArray(params?.locale)
      ? [params.locale[0]]
      : params?.locale
        ? [params.locale as string]
        : [];

    if (segments.length) {
      const rest = pathname.split("/").slice(2).join("/");
      const target = `/${next}${rest ? `/${rest}` : ""}`;
      router.push(target);
    } else {
      router.push(`/${next}`);
    }
    void routing;
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("label")}
        aria-expanded={open}
        className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-subtle"
      >
        <Globe className="h-[18px] w-[18px]" />
        <span className="hidden sm:inline">{localeLabels[locale]}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 min-w-[140px] overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
          {routing.locales.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => switchTo(l)}
              className={cn(
                "flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-surface-subtle",
                l === locale && "font-semibold",
              )}
            >
              {localeLabels[l]}
              {l === locale && <span className="text-xs">●</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
