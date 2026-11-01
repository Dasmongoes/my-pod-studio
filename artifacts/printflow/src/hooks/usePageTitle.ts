import { useEffect } from "react";

const SITE = "BincoHub";
const DEFAULT_TITLE = "BincoHub — Premium Print On Demand Apparel";

// Sets the browser tab title for the current page, e.g. "Shop | BincoHub".
export function usePageTitle(title?: string | null) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE}` : DEFAULT_TITLE;
  }, [title]);
}
