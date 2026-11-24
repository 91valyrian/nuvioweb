"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

let fontRequest;
function loadBrandFont() {
  if (!fontRequest) fontRequest = new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.crossOrigin = "anonymous";
    link.href = "https://use.typekit.net/qql5rly.css";
    link.onload = async () => {
      try {
        // Adobe serves CORS-enabled CSS. Update its actual font-face rules so
        // the descriptor survives viewport/style recalculation, while retaining
        // the provider embed, tracking CSS and licensed hosted font URLs.
        for (const rule of link.sheet.cssRules) {
          if (rule.type === CSSRule.FONT_FACE_RULE) rule.style.setProperty("font-display", "swap");
        }
        await document.fonts.load('italic 400 1em "miller-banner"');
        resolve();
      } catch (error) { reject(error); }
    };
    link.onerror = reject;
    document.head.appendChild(link);
  });
  return fontRequest;
}

export default function DeferredFonts() {
  const pathname = usePathname();
  useEffect(() => {
    if (!document.querySelector(".font-miller")) return;
    let active = true;
    loadBrandFont().then(() => {
      if (active) document.documentElement.classList.add("brand-font-ready");
    }).catch(() => { /* Keep readable system serif text if the provider is unavailable. */ });
    return () => { active = false; };
  }, [pathname]);
  return null;
}
