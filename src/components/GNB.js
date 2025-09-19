"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function GNB({ open, onClose, links = [] }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleBackdrop = (e) => {
    if (e.target === containerRef.current) onClose?.();
  };

  return (
    <div
      id="gnb-overlay"
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Global Navigation"
      className={`
        fixed inset-0 z-100 bg-black/70 text-white backdrop-blur-[10px]
        transition-opacity duration-300
        ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}
      onClick={handleBackdrop}
    >
      <div className="container relative h-full">
        <button
        aria-label="Close menu"
        className="absolute right-[20px] top-[35px] cursor-pointer z-50"
        onClick={onClose}
      >
        <Image src="/common/close.svg" alt="Close menu" className="w-[50px] md:w-[40px] h-[50px] md:h-[40px]" width={40} height={40} priority />
      </button>

      <div
        className={`
          flex h-full w-full items-center justify-center p-8
          transition-all duration-300 ease-out
          ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
        `}
      >
        <ul className="flex flex-col items-center gap-6 text-[64px] md:text-[64px]">
          {links.map((l) => (
            <li
              key={l.href}
              className={`
                transform transition-all duration-500 ease-out
                ${open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-50"}
              `}
              style={{ transitionDelay: `${links.indexOf(l) * 100}ms` }}
            >
              <Link href={l.href} className="hover:opacity-80" onClick={onClose}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
        </div>
    </div>
  );
}