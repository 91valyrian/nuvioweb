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

  if (!open) return null;

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
      className="fixed inset-0 z-50 bg-black/90 text-white"
      onClick={handleBackdrop}
    >
      <div className="container relative h-full">
        <button
        aria-label="Close menu"
        className="absolute right-[20px] top-[35px] cursor-pointer"
        onClick={onClose}
      >
        <Image src="/common/close.svg" alt="Close menu" width={40} height={40} priority />
      </button>

      <div className="flex h-full w-full items-center justify-center p-8">
        <ul className="flex flex-col items-center gap-6 text-[18px]">
          {links.map((l) => (
            <li key={l.href}>
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