"use client";

import { useEffect } from "react";
import Script from "next/script";
import { initializeAnalytics } from "@/lib/analytics";

export default function AnalyticsScripts() {
  useEffect(() => { initializeAnalytics(); }, []);
  return (
    <>
      <Script id="ga4-library" src="https://www.googletagmanager.com/gtag/js?id=G-XS0LDTNCMH" strategy="lazyOnload" />
      <Script id="meta-library" src="https://connect.facebook.net/en_US/fbevents.js" strategy="lazyOnload" />
      <Script id="beusable-rum" strategy="lazyOnload">{`
        (function(w,d,a){
          w.__beusablerumclient__={load:function(src){var b=d.createElement('script');b.src=src;b.async=true;d.head.appendChild(b);}};
          w.__beusablerumclient__.load(a+'?url='+encodeURIComponent(d.URL));
        })(window,document,'https://rum.beusable.net/load/b251031e102356u405');
      `}</Script>
      <noscript><img height="1" width="1" style={{ display: "none" }} src="https://www.facebook.com/tr?id=1532252177885828&ev=PageView&noscript=1" alt="" /></noscript>
    </>
  );
}
