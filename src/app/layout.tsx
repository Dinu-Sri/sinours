/**
 * Root layout — required by Next.js but intentionally minimal.
 * The real rendering happens in app/[locale]/layout.tsx which owns <html>/<body>.
 * This exists only to satisfy the Next.js convention that every page has a root layout.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
