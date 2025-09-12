"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Nav from "./Nav";
import GNB from "./GNB";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/service", label: "Service" },
  { href: "/work", label: "Work" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // GNB 열릴 때 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev || ""; };
  }, [open]);

  const onToggle = () => setOpen((v) => !v);
  const onClose = () => setOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 z-50 w-full flex items-center h-[125px] md:h-[110px]
          transform transition-all duration-500 ease-out
          ${mounted ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
        `}
      >
      <div className="container flex items-center justify-between xl:gap-[120px]">

        <Link href="/" className="">
          <Image
            src="/logo/logo.svg"
            alt="NUVIO"
            width={85.6}
            height={26} // 원본 비율에 맞는 값 (예시)
            className="w-[154px] md:w-[85px] h-auto "
            priority
          />
        </Link>
        {/* Nav에는 상태와 링크만 전달 */}
          <Nav open={open} onToggle={onToggle} links={links} />
      </div>
          
      </header>

      {/* Header '밖'에서 오버레이 렌더 (DOM상 header 옆) */}
      <GNB
        open={open}
        onClose={onClose}
        links={links}
      />
    </>
  );
}