import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

/**
 * The middleware normally localizes "/" -> "/<defaultLocale>".
 * This root page is a safety net: if middleware is bypassed (e.g. certain
 * static-export or edge cases), it still redirects to the default locale.
 */
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
