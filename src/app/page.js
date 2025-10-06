import HeroSwiper from "@/components/HeroSwiper";
import CardList from "@/components/CardList";
import { getAllWorks } from "@/lib/works";
import { serviceCards } from "@/data/serviceCards";
import Link from "next/link";

export default async function Home() {
  const works = getAllWorks().sort(
    (a, b) => new Date(b.inputDate) - new Date(a.inputDate)
  );
  return (
    <main>
      <HeroSwiper />

      {/* Serice Section */}
      <section id="service" className="section-service py-[120px]">
        <div className="container">
          <h2
            className="section-title font-miller italic text-[80px] xl:text-[100px]"
            data-reveal="fade-up"
            data-reveal-delay="0.2"
          >
            Service
          </h2>
          <h3
            className="section-subtitle text-[34px] md:text-[24px]"
            data-reveal="fade-up"
            data-reveal-delay="0.4"
          >
            홈페이지 기획부터 SEO까지. <br className="block md:hidden" />
            누비오가 책임지겠습니다.
          </h3>
          <div className="interactive-cards group mt-[30px] md:mt-[50px] flex flex-wrap xl:flex-nowrap gap-[20px] justify-between">
            {serviceCards.map((card) => (
              <div
                key={card.id}
                role="button"
                aria-label={card.title}
                className={`${card.bg} group relative w-full md:w-[calc(50%_-_10px)] xl:w-1/4 h-[500px] bg-cover bg-center rounded-[20px] transition-all duration-500 ease-in-out xl:hover:w-[45%]`}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500 rounded-[20px]" />
                <div className="textBox absolute bottom-[30px] left-[30px] text-white">
                  <h4 className="text-[41px] md:text-[31px] font-semibold opacity-100">
                    {card.title}
                  </h4>
                  <p className="mt-[8px] text-[28px] md:text-[18px] leading-[1.6] opacity-90 pr-[20px]">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Work Section */}
      <section id="work" className="section-work py-[80px]">
        <div className="container">
          <h2
            className="section-title font-miller italic text-[80px] xl:text-[100px]"
            data-reveal="fade-up"
            data-reveal-delay="0.2"
          >
            Our Works
          </h2>
          <h3
            className="section-subtitle text-[34px] md:text-[24px]"
            data-reveal="fade-up"
            data-reveal-delay="0.4"
          >
            우리가 만들어온 변화와 성장을 확인하세요.
          </h3>
          <CardList
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
      </section>

      {/* Work Section */}
      <section id="Contact" className="section-Contact py-[80px]">
        <div className="container">
          <div className="flexBox flex gap-[20px]">
            <Link href="#;" className="w-[calc(50%_-_10px)] block bg-[#111]">
              asdf
            </Link>
            <Link href="#;" className="w-[calc(50%_-_10px)] block bg-[#111]">
              asdf
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
