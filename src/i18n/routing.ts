import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["es", "en", "fr", "pt", "de", "it", "ja", "zh", "ko", "ar"],
  defaultLocale: "es",
  localeDetection: true,
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
