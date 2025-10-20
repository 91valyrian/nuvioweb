"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", "G-XS0LDTNCMH", {
        page_path: pathname,
      });
    }
  }, [pathname]);

  return null;
}
