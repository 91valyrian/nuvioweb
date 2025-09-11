"use client";
import Link from "next/link";
import Image from "next/image";
import Button from "./Button";
import { usePathname } from "next/navigation";

export default function Nav({ open, onToggle, links }) {
  const pathname = usePathname();

  return (
    <nav className="xl:w-full nav flex items-center justify-end xl:justify-between">
      {/* 데스크톱(xl↑) 인라인 메뉴 */}
      <ul id="nav-menu" className="hidden xl:flex items-center gap-[47px] text-[18px] nav-list">
        {links.map((l) => {
          const active = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`nav-link ${active ? "active" : ""}`}
              >
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div id="util-menu" className="flex item-center gap-[30px] md:gap-[40px]">
        <Button href="/contact" variant="outlineDark" size="md">
          CONTACT
        </Button>

        {/* 모바일/태블릿: GNB 오버레이 토글 */}
        <button
          className="nav-toggle cursor-pointer "
          aria-expanded={open}
          aria-controls="gnb-overlay"
          onClick={onToggle}
        >
          <Image src="/common/menu.svg" alt="전체 메뉴" className="w-[52px] h-[38px] md:w-[48px] md:h-[35px]" width={52} height={38} priority />
        </button>
      </div>
    </nav>
  );
}