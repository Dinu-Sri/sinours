import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip Next internals, the API, and anything that looks like a static file.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
