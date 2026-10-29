"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
function PageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const last = useRef(null);
  useEffect(() => {
    const url = pathname + (searchParams.size ? `?${searchParams}` : "");
    const send = () => {
      if (!window.gtag) return;
      if (last.current !== url) {
        window.gtag("event", "page_view", {
          page_location: window.location.href,
          page_path: url,
          page_title: document.title,
        });
        last.current = url;
      }
    };
    window.addEventListener("nuvio:analytics-ready", send);
    send();
    return () => window.removeEventListener("nuvio:analytics-ready", send);
  }, [pathname, searchParams]);
  return null;
}
export default function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <PageViews />
    </Suspense>
  );
}
