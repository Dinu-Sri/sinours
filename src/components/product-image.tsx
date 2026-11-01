import { cn } from "@/lib/utils";

/**
 * Product visual. Colour charts and studio photographs live in /public.
 * A missing file falls back to the colour name, never a dashed demo tile.
 */
export function ProductImage({
  image,
  name,
  className,
}: {
  image?: string | null;
  name: string;
  className?: string;
  colorFamily?: string | null;
  category?: "PIGMENT" | "MEDIUM" | "SET";
  size?: "sm" | "md" | "lg";
}) {
  if (image) {
    return (
      <div
        className={cn(
          "relative aspect-[3/2] w-full overflow-hidden bg-[#f7f6f3]",
          className,
        )}
      >
        <img
          src={image}
          alt={name}
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex aspect-[3/2] w-full items-end bg-foreground text-background",
        className,
      )}
      role="img"
      aria-label={name}
    >
      <span className="m-4 text-sm font-medium uppercase tracking-wide">
        {name}
      </span>
    </div>
  );
}
