import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { DEFAULT_DESCRIPTION, SITE_URL, pageTitle } from "@/config/seo";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

interface PageOptions {
  description?: string;
  // Keeps pages such as "not found" out of search results.
  noindex?: boolean;
}

// Sets the tab title, search description, sharing text and canonical URL for the current page.
export function usePageTitle(title?: string | null, { description, noindex }: PageOptions = {}) {
  const { pathname } = useLocation();

  useEffect(() => {
    const fullTitle = pageTitle(title);
    const fullDescription = description ?? DEFAULT_DESCRIPTION;
    const url = `${SITE_URL}${pathname}`;

    document.title = fullTitle;
    setMeta("name", "description", fullDescription);
    setMeta("property", "og:title", fullTitle);
    setMeta("name", "twitter:title", fullTitle);
    setMeta("property", "og:description", fullDescription);
    setMeta("name", "twitter:description", fullDescription);
    setMeta("property", "og:url", url);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    const robots = document.head.querySelector('meta[name="robots"]');
    if (noindex) setMeta("name", "robots", "noindex");
    else robots?.remove();
  }, [title, description, noindex, pathname]);
}
