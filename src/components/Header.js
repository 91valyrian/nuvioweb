"use client";
import Link from "next/link";
import Image from "next/image";
import Nav from "./Nav";

export default function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="logo">
            <Image src="/logo/logo.svg" alt="NUVIO" width={120} height={28} priority />
        </Link>
        <Nav />
      </div>
    </header>
  );
}