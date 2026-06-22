import { defaultLocale } from "@/i18n/routing";

/**
 * Fallback for routes the middleware didn't localize (e.g. unknown static paths).
 * next-intl handles / -> /en, so this is a last resort.
 */
export default function RootNotFound() {
  return (
    <html lang={defaultLocale}>
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#fff",
          color: "#111",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ letterSpacing: "0.18em", fontSize: "0.75rem", textTransform: "uppercase", opacity: 0.6 }}>
            404
          </p>
          <h1 style={{ fontSize: "2rem", marginTop: "1rem" }}>Page not found</h1>
          <a href={`/${defaultLocale}`} style={{ display: "inline-block", marginTop: "1.5rem", textDecoration: "underline" }}>
            Go home
          </a>
        </div>
      </body>
    </html>
  );
}
