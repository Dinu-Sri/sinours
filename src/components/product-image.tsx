import { COLOR_HEX, type PigmentColor } from "@/lib/colors";
import { cn } from "@/lib/utils";

/**
 * Placeholder product visual. Renders a clean monochrome tile tinted by the
 * product's color family (for pigments) or neutral (for mediums/sets).
 *
 * When real photography lands, swap this for next/image with the Product.image
 * path and keep this as the fallback for missing images.
 */
export function ProductImage({
  colorFamily,
  category,
  name,
  className,
  size = "md",
}: {
  colorFamily?: string | null;
  category: "PIGMENT" | "MEDIUM" | "SET";
  name: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const hex =
    colorFamily && colorFamily in COLOR_HEX
      ? COLOR_HEX[colorFamily as PigmentColor]
      : "#1c1c1c";

  const labelSize =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-xs" : "text-sm";

  return (
    <div
      className={cn(
        "relative flex aspect-[4/5] w-full items-end overflow-hidden rounded-lg border border-border",
        className,
      )}
      style={{ backgroundColor: hex }}
      role="img"
      aria-label={name}
    >
      {/* Subtle paper grain via layered gradient */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.35), rgba(0,0,0,0.18))",
        }}
      />
      <span
        className={cn(
          "relative m-3 inline-block max-w-[80%] rounded bg-background/80 px-2 py-1 font-medium uppercase tracking-wide text-foreground backdrop-blur-sm",
          labelSize,
        )}
      >
        {category === "PIGMENT"
          ? name
          : category === "MEDIUM"
            ? "MEDIUM"
            : "SET"}
      </span>
    </div>
  );
}
