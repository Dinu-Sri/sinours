import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

/**
 * Sinours wordmark. A real logo asset (svg/png/webp) can be dropped into
 * /public and swapped here later; for now we render a tight typographic mark.
 */
export function Logo({
  className,
  href = true,
}: {
  className?: string;
  href?: boolean;
}) {
  const t = useTranslations("brand");
  return (
    <span className={cn("inline-flex flex-col leading-none", className)}>
      <span className="text-lg font-bold tracking-[0.22em] uppercase">
        {t("name")}
      </span>
      <span className="mt-1 text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground">
        {t("tagline")}
      </span>
    </span>
  );
}
