import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

// Maintenance mode configuration
const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === "true";
const ALLOWED_IPS = (process.env.MAINTENANCE_ALLOWED_IPS || "")
  .split(",")
  .map((ip) => ip.trim())
  .filter(Boolean);
const GOD_MODE_SECRET = process.env.GOD_MODE_SECRET || "";
const GOD_MODE_COOKIE = "nexo_godmode";

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return request.headers.get("cf-connecting-ip") || "unknown";
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow static files and API
  if (pathname.match(/\.\w+$/) || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // God Mode activation: ?godmode=SECRET -> sets cookie + redirect clean
  const godModeParam = request.nextUrl.searchParams.get("godmode");
  if (godModeParam === GOD_MODE_SECRET) {
    const cleanUrl = new URL(pathname, request.url);
    const response = NextResponse.redirect(cleanUrl);
    response.cookies.set(GOD_MODE_COOKIE, "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    return response;
  }

  // God Mode deactivation: ?godmode=off
  if (godModeParam === "off") {
    const cleanUrl = new URL(pathname, request.url);
    const response = NextResponse.redirect(cleanUrl);
    response.cookies.delete(GOD_MODE_COOKIE);
    return response;
  }

  // Check maintenance mode
  if (MAINTENANCE_MODE) {
    const clientIp = getClientIp(request);
    const hasGodModeCookie =
      request.cookies.get(GOD_MODE_COOKIE)?.value === "true";
    const isAllowedIp = ALLOWED_IPS.includes(clientIp);
    const isLocalhost =
      clientIp === "127.0.0.1" ||
      clientIp === "::1" ||
      clientIp === "localhost";

    // Block access unless: whitelisted IP, localhost, or god mode cookie
    if (!isAllowedIp && !isLocalhost && !hasGodModeCookie) {
      if (!pathname.includes("/mantenimiento")) {
        const locale = pathname.split("/")[1];
        const validLocales = ["es", "en", "fr", "pt", "de", "it", "ja", "zh", "ko", "ar"];
        const validLocale = validLocales.includes(locale) ? locale : "es";
        return NextResponse.redirect(
          new URL(`/${validLocale}/mantenimiento`, request.url)
        );
      }
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
