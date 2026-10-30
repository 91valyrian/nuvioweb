"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { faqs } from "@/data/faqs";

const categories = [...new Set(faqs.map((item) => item.category))];

export default function FaqSection() {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const id = useId();

  return (
    <section className="faq-section py-[180px] bg-gradient-to-b from-[#141414] to-[#000000] text-white" aria-labelledby={`${id}-heading`}>
      <div className="container faq-inner mx-auto px-4">
        <h2 id={`${id}-heading`} className="section-subtitle text-[54px] leading-[60px] md:text-[44px] md:leading-[50px] font-bold text-center mb-[30px]">홈페이지 제작, 자주 묻는 질문</h2>
        <p className="faq-intro">제작 비용과 준비 자료부터 검색 설정, 오픈 후 운영까지 확인하세요.<br />구체적인 작업 범위와 계약 조건은 프로젝트별로 협의합니다.</p>
        <div className="flex flex-wrap justify-center gap-4 mb-12" role="group" aria-label="FAQ 주제 선택">
          {categories.map((category, index) => (
            <button key={category} type="button" aria-pressed={activeCategory === category} aria-controls={`${id}-group-${index}`} onClick={() => setActiveCategory(category)} className={`px-[25px] md:px-[30px] py-[15px] text-[28px] md:text-[18px] rounded-[9999px] border border-white/20 transition-colors cursor-pointer font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${activeCategory === category ? "bg-main text-white border-main" : "text-white/70 hover:bg-white/10"}`}>{category}</button>
          ))}
        </div>
        {/* Keep every answer and crawlable link in the server-rendered HTML. */}
        {categories.map((category, index) => (
          <div key={category} id={`${id}-group-${index}`} hidden={activeCategory !== category}>
            <div className="faq-wide-list">
              {faqs.filter((item) => item.category === category).map((item) => (
                <details key={item.id} className="faq-item border border-white/10 rounded-xl overflow-hidden">
                  <summary className="faq-question"><h3>{item.question}</h3><span aria-hidden="true" className="faq-toggle" /></summary>
                  <div className="faq-answer"><p>{item.answer}</p>{item.link && <Link href={item.link.href}>{item.link.label}<span aria-hidden="true"> →</span></Link>}</div>
                </details>
              ))}
            </div>
          </div>
        ))}
        <div className="faq-next-step"><span>프로젝트에 맞는 제작 범위를 확인하고 싶으신가요?</span><Link href="/contact">홈페이지 제작 상담하기 <span aria-hidden="true">↗</span></Link></div>
      </div>
    </section>
  );
}
