/**
 * Builds a schema.org BreadcrumbList JSON-LD object for a page.
 *
 * "Home" is always position 1; the given items follow in order.
 * Each `path` is resolved against `site` (Astro.site) to an absolute URL —
 * pass `Astro.url.pathname` as the last item's path so the leaf URL always
 * matches the canonical URL of the page.
 */
export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function breadcrumbLd(items: BreadcrumbItem[], site: URL | undefined) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: new URL("/", site).toString(),
      },
      ...items.map(({ name, path }, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name,
        item: new URL(path, site).toString(),
      })),
    ],
  };
}
