import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

/** Official Sinours wordmark. Inverted in dark mode so the dark ink stays visible. */
export function Logo({ className }: { className?: string; href?: boolean }) {
  const t = useTranslations("brand");
  return (
    <span className={cn("inline-flex items-center", className)}>
      <img
        src="/brand/logo.webp"
        alt={t("full")}
        className="h-7 w-auto dark:brightness-0 dark:invert md:h-8"
      />
    </span>
  );
}
