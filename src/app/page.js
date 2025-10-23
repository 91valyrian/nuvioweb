import HeroSwiper from "@/components/HeroSwiper";
import CardList from "@/components/CardList";
import { getAllWorks } from "@/lib/works";
import Link from "next/link";
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
        className="section-work py-[120px] md:py-[240px] bg-gradient-to-b from-[#000000] to-[#141414]"
      >
        <div className="container">
          {/* <p className="section-title font-miller italic text-[34px] md:text-[24px] text-main text-center mb-[10px] rotate-x-up">
            Our Works
          </p> */}
          <h2 className="section-subtitle text-[50px] leading-[54px] md:text-[40px] md:leading-[44px] font-bold text-center rotate-x-up">
            우리가 만들어온 변화와
            <br /> 성장을 확인하세요.
          </h2>
          <CardList
            horizontalOnMobile
            items={[...works].sort(
              (a, b) => new Date(b.inputDate) - new Date(a.inputDate)
            )}
            initialCount={6}
            step={0}
            cols="cols-3"
            gap="gap-lg"
            className="mt-[30px] md:mt-[50px]"
          />
        </div>

        <div className="text-center mt-[50px] fade-up">
          <Link
            href="/work"
            className="relative group block w-[400px] md:w-[290px] h-[74px] md:h-[54px] cursor-pointer mx-auto bg-white text-[#090A0C] text-[14px] font-pretendard rounded-[9999px] shadow-[0_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200 overflow-hidden before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-[calc(100%+15px)] before:h-[calc(100%+15px)] before:bg-[rgba(255,255,255,0.12)] before:rounded-[30px] before:shadow-[0_24px_90px_rgba(0,0,0,0.12)] before:-z-[1] z-[998] hover:bg-main hover:text-white"
          >
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full overflow-hidden">
              <span className="flex items-center justify-center text-[28px] md:text-[18px] font-semibold h-full transform translate-y-0 transition-transform duration-200 group-hover:-translate-y-[100%]">
                Portfolio
              </span>
              <span className="flex items-center justify-center text-[28px] md:text-[18px] font-bold h-full text-white transform translate-y-0 transition-transform duration-200 group-hover:translate-y-[-100%]">
                More
              </span>
            </span>
          </Link>
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
