import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--surface) / <alpha-value>)",
        "surface-subtle": "hsl(var(--surface-subtle) / <alpha-value>)",
        brand: "hsl(var(--brand) / <alpha-value>)",
        "brand-foreground": "hsl(var(--brand-foreground))",
        muted: "hsl(var(--muted) / <alpha-value>)",
        "muted-foreground": "hsl(var(--muted-foreground))",
        border: "hsl(var(--border) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 8vw, 6rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.25rem, 6vw, 4rem)", { lineHeight: "1", letterSpacing: "-0.02em" }],
      },
      boxShadow: {
        soft: "0 24px 70px -42px hsl(var(--foreground) / 0.30)",
        hairline: "0 1px 0 hsl(var(--border) / 0.72)",
      },
      maxWidth: {
        content: "80rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
