import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * Per-page OpenGraph card for a pathname, if one has been generated
 * (scripts/make-og-pages.mjs → public/images/og/pages/<slug>.png).
 * Runs at build time only (static output), so the fs check is free.
 * Returns undefined when there is no card — callers fall back to the
 * per-BU card, then to the default one.
 */
export function ogForPath(pathname: string): string | undefined {
  const slug =
    pathname.replace(/^\/+|\/+$/g, "").replace(/\//g, "-") || "home";
  const publicFile = fileURLToPath(
    new URL(`../../public/images/og/pages/${slug}.png`, import.meta.url),
  );
  return existsSync(publicFile) ? `/images/og/pages/${slug}.png` : undefined;
}
