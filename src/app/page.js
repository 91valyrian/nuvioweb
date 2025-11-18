import Link from "next/link";
import Image from "next/image";
import HeroSwiper from "@/components/HeroSwiper";
import CardList from "@/components/CardList";
import { getAllWorks } from "@/lib/works";
import ColumnsPreview from "@/components/ColumnsPreview";

export default async function Home() {
  const works = getAllWorks().sort(
    (a, b) => new Date(b.inputDate) - new Date(a.inputDate)
  );
  return (
    <main>
      <HeroSwiper />

      {/* Work Section */}
      <section
        id="work"
        className="section-work py-[240px] md:py-[200px] bg-gradient-to-b from-[#000000] to-[#141414]"
      >
        <div className="container">
          <div className="text-center mb-[60px] md:mb-[50px]">
            {/* <p className="section-title font-miller italic text-[34px] md:text-[24px] text-main text-center mb-[10px] rotate-x-up">
            Our Works
          </p> */}
            <h2 className="section-subtitle text-[54px] leading-[60px] md:text-[44px] md:leading-[50px] font-bold rotate-x-up">
              {/* 우리가 만들어온 변화와 성장을 확인하세요. */}
              기획부터 최적화까지,
              <br /> 결과로 증명하는 <br className="block md:hidden" /> 누비오의
              제작 사례
            </h2>
            <p className="text-white/60 mt-[20px] text-[30px] md:text-[20px] rotate-x-up">
              브랜드 전략·UI/UX·개발·SEO를 한 팀이 끝까지 책임집니다.
              <br />
              산업별 맞춤형 웹사이트, 실제 성과로 확인하세요.
            </p>
          </div>

          <CardList
            horizontalOnMobile
            items={[...works].sort(
              (a, b) => new Date(b.inputDate) - new Date(a.inputDate)
            )}
            initialCount={3}
            step={0}
            cols="cols-3"
            gap="gap-lg"
            className="mt-[30px] md:mt-[50px] fade-up"
          />

          <div className="text-center mt-[50px] md:mt-[80px]">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 px-8 md:px-5 h-[74px] md:h-[54px] rounded-full bg-main text-[28px] md:text-[18px] text-white/80 hover:bg-[#1244F9] transition fade-up"
              aria-label="포트폴리오 바로가기"
            >
              포트폴리오 바로가기
              <svg
                viewBox="0 0 24 24"
                className="w-7 h-7 md:w-4 md:h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M5 12h14M13 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <ColumnsPreview />

      {/* About Section */}
      {/* <section id="about" className="section-about py-[120px]">
        <AboutSection />
      </section> */}
    </main>
  );
}
