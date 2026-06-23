import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Visual placeholder for where real photography will land.
 * Renders a dashed-border box with an icon and label so designers
 * (and reviewers) can see exactly where each image goes.
 *
 * Variants:
 *  - "hero"      — large, full-bleed feel, used on the home page hero
 *  - "wide"      — 16:9 banner, used in story / about sections
 *  - "square"    — 1:1, used in value cards / category tiles
 *  - "portrait"  — 4:5, used for product cards
 *  - "landscape" — 3:2, used for editorial blocks
 */
export type ImagePlaceholderVariant =
  | "hero"
  | "wide"
  | "square"
  | "portrait"
  | "landscape";

export function ImagePlaceholder({
  label,
  hint,
  variant = "wide",
  className,
}: {
  /** Short label, e.g. "Hero image" or "Studio shot" */
  label: string;
  /** Optional secondary line, e.g. "1920×1080 · lifestyle" */
  hint?: string;
  variant?: ImagePlaceholderVariant;
  className?: string;
}) {
  const aspect =
    variant === "hero"
      ? "" // hero fills its column height — no fixed aspect ratio
      : variant === "square"
        ? "aspect-square"
        : variant === "portrait"
          ? "aspect-[4/5]"
          : variant === "landscape"
            ? "aspect-[3/2]"
            : "aspect-[16/9]";

  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-surface-subtle text-muted-foreground",
        aspect,
        variant === "hero" && "h-full min-h-[420px]",
        className,
      )}
      role="img"
      aria-label={`Placeholder for ${label}`}
    >
      {/* Subtle diagonal grid so the placeholder reads as "empty" */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(135deg, hsl(var(--border)) 1px, transparent 1px), linear-gradient(45deg, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative flex flex-col items-center gap-2 px-6 text-center">
        <ImageIcon className="h-7 w-7" strokeWidth={1.25} />
        <p className="text-xs font-semibold uppercase tracking-[0.18em]">
          {label}
        </p>
        {hint && (
          <p className="text-[0.7rem] font-medium uppercase tracking-wide opacity-70">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}