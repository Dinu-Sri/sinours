"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

/**
 * Light/dark toggle. The actual theme class is applied before paint by
 * <ThemeScript />; this component only reflects and updates that state.
 * Persists choice to localStorage.theme so reloads and the head script agree.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("theme");
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.style.colorScheme = next ? "dark" : "light";
    window.localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t("toggle")}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-subtle",
        className,
      )}
    >
      {/* Render a stable icon until mounted to avoid hydration mismatch */}
      {mounted && dark ? (
        <Sun className="h-[18px] w-[18px]" />
      ) : (
        <Moon className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}
