"use client";
import Link from "next/link";
import { useState } from "react";
import Modal from "./Modal";
import InQuiry from "./InQuiry";

export default function Footer() {
  const year = new Date().getFullYear();
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <footer className="footer relative pt-[120px] md:pt-[80px] overflow-hidden">
      <InQuiry />

      <div className="container footer-inner md:flex justify-between items-center">
        <div className="text-center md:text-left">
          {/* <b className="text-[74px] md:text-[44px]">nuvio</b> */}
          <div className="flex flex-col items-center md:items-start gap-[5px] text-[32px] md:text-[22px] font-[300] text-neutral-300 mt-[30px]">
            <p className="">서울시 중구 왕십리로 393-1 202호</p>
            <ul className="flex gap-[20px]">
              <li>
                <span>T : </span>{" "}
                <a href="tel:010-9928-6110" target="_blank">
                  010-9928-6110
                </a>
              </li>
              <li>
                <span>E : </span>{" "}
                <a href="mailto:nuvio@naver.com">nuvio@naver.com</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center md:items-end gap-[20px] justify-center text-[30px] md:text-[20px] text-center md:text-right mt-[50px] md:mt-0">
          <Link href="/about">회사소개</Link>
          <Link href="/service">서비스</Link>
          <Link href="/work">포트폴리오</Link>
          <Link href="/columns">홈페이지 컬럼</Link>
          <a href="https://blog.naver.com/nuvio" target="_blank">
            블로그
          </a>
          {/* <button
              onClick={() => setIsModalOpen(true)}
              aria-haspopup="dialog"
              aria-controls="policy-dialog"
              aria-expanded={isModalOpen}
              className="cursor-pointer"
            >
              인스타그램
            </button> */}
        </div>
      </div>
      <div className="footer-bottom text-center text-[28px] md:text-[18px] text-neutral-300 font-[200] py-[50px] md:py-[30px]">
        <div className="container">© {year} nuvio. All rights Reserved</div>
      </div>

      <div className="w-[100%] h-[900px] md:h-[500px] center-absolute footer-gradient -z-1"></div>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="text-center py-10">
          <p className="text-[26px] font-medium text-neutral-100">
            인스타그램 준비중입니다.
          </p>
        </div>
      </Modal>
    </footer>
  );
}
