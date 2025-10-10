import HeroSwiper from "@/components/HeroSwiper";
import CardList from "@/components/CardList";
import AboutSection from "@/components/AboutSection";
import { getAllWorks } from "@/lib/works";
import { serviceCards } from "@/data/serviceCards";
import Image from "next/image";
import Script from "next/script";

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
          <p
            className="section-title font-miller italic text-[34px] md:text-[24px] text-neutral-400 mb-[10px]"
            data-reveal="fade-up"
            data-reveal-delay="0.2"
          >
            Our Service
          </p>
          <h2
            className="section-subtitle text-[60px] leading-[74px] md:text-[49px] md:leading-[59px] font-bold"
            data-reveal="fade-up"
            data-reveal-delay="0.4"
          >
            브랜딩과 비즈니스를
            <br className="block md:hidden" /> 성장시키는
            <br className="hidden md:block" />
            nuvio의
            <br className="block md:hidden" /> 핵심 서비스를 확인해 보세요.
          </h2>
          <div className="flex flex-wrap xl:flex-nowrap gap-[20px] mt-[80px]">
            {serviceCards.map((card, index) => (
              <div
                key={card.id}
                role="button"
                aria-label={card.title}
                className={`
    service-gradient group relative w-full md:w-[calc(50%_-_10px)] xl:w-1/4 rounded-[10px] 
    p-[2px] bg-[linear-gradient(var(--gdeg,55deg),rgba(255,255,255,1)_5%,rgba(0,0,0,0)_61%)]
    overflow-hidden
  `}
                data-reveal="fade-up"
                data-reveal-delay={0.2 * index}
              >
                {/* 내부 실제 콘텐츠 wrapper */}
                <div className="flex flex-col justify-between relative w-full h-full rounded-[10px] overflow-hidden bg-[#090A0C] pt-[50px] pb-[25px] px-[25px]">
                  <div className="relative z-10 textBox p-[24px]">
                    <p></p>
                    <h3 className="text-[41px] md:text-[31px] font-semibold opacity-100">
                      {card.title}
                    </h3>
                    <p
                      className="mt-2 text-[30px] md:text-[20px] leading-[1.6] opacity-90 pr-[20px]"
                      dangerouslySetInnerHTML={{ __html: card.desc }}
                    />
                  </div>

                  <div className="imgBox w-full h-[465px] md:h-[315px] rounded-[10px] overflow-hidden">
                    <Image
                      src={card.bg}
                      alt={card.title}
                      width={768}
                      height={650}
                      // fill
                      // sizes="(min-width:768px) 50vw, 100vw"
                      // style={{ objectFit: "cover" }}
                      // quality={90}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Script id="svc-gradient-angle" strategy="afterInteractive">{`
        (function(){
          const supportsHover = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
          if(!supportsHover) return;

          const toDeg = (rad) => rad * (180/Math.PI);

          function onMove(e){
            const card = e.currentTarget;
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            const rad = Math.atan2(dy, dx); // angle toward mouse
            let cssDeg = toDeg(rad) + 90; // adjust so bright side faces mouse
            if (cssDeg < 0) cssDeg += 360;
            card.style.setProperty('--gdeg', cssDeg.toFixed(2) + 'deg');
          }

          function onLeave(e){
            // Do nothing on leave; keep the last gradient angle
          }

          document.querySelectorAll('.section-service .service-gradient').forEach((el)=>{
            el.addEventListener('mousemove', onMove);
            el.addEventListener('mouseleave', onLeave);
          });
        })();
      `}</Script>

      {/* Work Section */}
      <section id="work" className="section-work py-[120px]">
        <div className="container">
          <p
            className="section-title font-miller italic text-[34px] md:text-[24px] text-neutral-400 text-center mb-[10px]"
            data-reveal="fade-up"
            data-reveal-delay="0.2"
          >
            Our Works
          </p>
          <h2
            className="section-subtitle text-[60px] leading-[74px] md:text-[49px] md:leading-[59px] font-bold text-center"
            data-reveal="fade-up"
            data-reveal-delay="0.4"
          >
            우리가 만들어온 변화와
            <br /> 성장을 확인하세요.
          </h2>
          <CardList
            items={[...works].sort(
              (a, b) => new Date(b.inputDate) - new Date(a.inputDate)
            )}
            initialCount={6}
            step={0}
            cols="cols-3"
            gap="gap-sm"
            className="mt-[30px] md:mt-[50px]"
          />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-about py-[120px]">
        <AboutSection />
      </section>
    </main>
  );
}
