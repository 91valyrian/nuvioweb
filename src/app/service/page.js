import SubVisual from "@/components/SubVisual";
import { serviceCards } from "@/data/serviceCards";

// SEO metadata for Service page (minimal override; inherits the rest from layout)
export async function generateMetadata() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://nuvio-web.com";
  return {
    title: "홈페이지 제작 서비스 - 기획·디자인·SEO 전문", // will become "홈페이지 제작 서비스 | nuvio" via layout template
    description:
      "기업·병원·프랜차이즈 맞춤형 홈페이지 제작. 기획, 디자인, 개발, SEO까지 완성도 높은 웹사이트를 제공합니다.",
    keywords: [
      "홈페이지 제작",
      "기업 홈페이지 제작",
      "웹사이트 제작",
      "반응형 홈페이지",
      "홈페이지 리뉴얼",
      "SEO 최적화",
      "랜딩 페이지 제작",
      "UI/UX",
      "브랜딩",
      "포트폴리오",
      "nuvio",
    ],
    alternates: { canonical: `${base}/service` },
    openGraph: { images: [{ url: "/og/og-default.png" }] },
    twitter: { images: ["/og/og-default.png"] },
  };
}

export default function ServicePage() {
  // page.js 내부
  const concerns = [
    {
      id: "design",
      qTitle: "흔해 빠진 디자인 템플릿으로<br/>만들어주면 어떡하지?",
      qSub: "우리 브랜드랑 안어울리는 디자인은 필요 없는데…",
      aTitle:
        "전문 웹디자이너가<br/> 브랜드에 어울리는<br/> 맞춤형 디자인을 제작합니다.",
      aSub: "디자인에 브랜드가 추구하는 가치와 목적을 담습니다.",
    },
    {
      id: "schedule",
      qTitle: "예정된 일정에 사이트가<br/>오픈이 안되면 어쩌지?",
      qSub: "오픈 날짜에 맞춰서 다양한 일정을 준비했는데…",
      aTitle: "매 월 최대 6개의<br/>한정된 프로젝트만을<br/> 받아 진행합니다.",
      aSub: "프로젝트 일정 준수와 고퀄리티 제작을 위해<br class='xl:hidden' /> TO 제한을 두고 운영합니다.",
    },
    {
      id: "quality",
      qTitle: "결과물이 기대에<br/> 못 미치면 어떡하지?",
      qSub: "생각한 것과 다르면 그냥 사용해야 하는걸까?",
      aTitle:
        "만족 보장<br/> 프로그램 운영으로<br/> 퀄리티 걱정을 없애드립니다.",
      aSub: "기획부터 메인 시안까지 진행 후에도<br class='xl:hidden' /> 만족스럽지 않다면 100% 환불을 보장합니다.",
    },
  ];

  const workStep = [
    {
      id: 1,
      step: "01",
      title: "미팅",
      subtitle: "전문 컨설턴트와의 1:1 맞춤 상담으로 시작합니다.",
      desc: "처음 만남에서 브랜드의 방향성과 목적을 깊이 이해하고,<br class='hidden xl:block'/> 홈페이지가 전달해야 할 핵심 메시지를 함께 정의합니다.",
    },
    {
      id: 2,
      step: "02",
      title: "기획",
      subtitle: "브랜드의 스토리와 콘텐츠를 구조화합니다.",
      desc: "의뢰서를 기반으로 사용자 여정과 정보 구조를 설계하고,<br class='hidden xl:block'/> 페이지 구성과 핵심 콘텐츠가 자연스럽게 연결되도록 기획합니다.",
    },
    {
      id: 3,
      step: "03",
      title: "디자인 시안 작업",
      subtitle: "브랜드의 감성을 시각으로 구현합니다.",
      desc: "기획안을 바탕으로 UI/UX를 고려한 디자인 시안을 제작하며,<br class='hidden xl:block'/> 첫인상부터 브랜드의 가치가 느껴지도록 디테일을 완성합니다.",
    },
    {
      id: 4,
      step: "04",
      title: "퍼블리싱 & 개발",
      subtitle: "컨셉이 실제 웹 환경에서 살아납니다.",
      desc: "확정된 디자인 시안을 토대로 반응형 퍼블리싱과 기능 개발을 진행하며,<br class='hidden xl:block'/> 속도, 접근성, SEO까지 고려한 완성도 높은 구조를 구현합니다.",
    },
    {
      id: 5,
      step: "05",
      title: "검수 & 수정",
      subtitle: "모든 디바이스에서 완벽히 작동하도록 검수합니다.",
      desc: "클라이언트 피드백을 반영해 세밀한 수정 과정을 거치며,<br class='hidden xl:block'/> PC와 모바일 모두에서 최적화된 결과물을 완성합니다.",
    },
    {
      id: 6,
      step: "06",
      title: "배포 & 런칭",
      subtitle: "당신의 브랜드가 세상과 연결되는 순간입니다.",
      desc: "최종 점검 후 클라이언트 도메인으로 사이트를 연동하고,<br class='hidden xl:block'/> 정식 런칭과 함께 안정적인 운영 환경을 세팅합니다.",
    },
  ];

  return (
    <main className="overflow-x-hidden">
      <SubVisual value="Service" image="/images/service/visual.webp" />

      {/* Services List */}
      <section className=" pb-[100px] md:pb-[150px] xl:pb-[350px] bg-[url('/images/service/listBg.webp')] bg-[position:center_bottom] bg-[length:200%] md:bg-[length:80%] bg-no-repeat">
        <div className="container">
          <div className="serviceList grid grid-cols-1 md:grid-cols-3 md:grid-cols-1 gap-[24px] mt-[60px]">
            {serviceCards.map((s, i) => (
              <article
                key={s.id}
                className={`${s.id === 4 ? "md:col-start-2" : ""} ${s.id === 5 ? "md:col-start-3" : ""} serviceCard relative rounded-2xl border border-white/15 bg-white/5 backdrop-blur-[2px] p-[28px] hover:bg-white/8 transition fade-up`}
              >
                <p className="text-[28px] md:text-[16px] tracking-wider font-semibold">
                  {s.badge}
                </p>

                <h3 className="text-[42px] md:text-[31px] my-[10px] font-bold leading-tight">
                  {s.titleEn}
                </h3>
                <p className="text-[30px] md:text-[20px] font-mediume text-white/80 mt-[20px]">
                  {s.title}
                </p>

                <div className="mt-8 grid gap-[20px] pt-[105px]">
                  {s.points.map((p, idx) => (
                    <div key={idx} className="border-t border-white/10 pt-4">
                      <p className="text-[28px] md:text-[16px] uppercase tracking-wide text-neutral-400">
                        {p.tag}
                      </p>
                      <p className="text-[30px] md:text-[20px] text-white/80 mt-1">
                        {p.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Perfect Core Values */}
      <section className="py-[180px] bg-neutral-950 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-[50px]">
            <h3 className="text-[61px] font-bold fade-up">
              이런 걱정,
              <br className="block md:hidden" /> nuvio에서는 없습니다.
            </h3>

            <p className="text-[30px] md:text-[24px] text-neutral-300 mt-[20px] fade-up">
              브랜드의 불안을 해결하는 디자인 파트너
            </p>
          </div>

          <div className="space-y-10">
            {concerns.map((item, i) => (
              <article
                key={item.id}
                className="relative overflow-hidden rounded-[24px] border border-white/12 bg-white/[0.04] backdrop-blur-sm p-6 md:p-10 fade-up"
              >
                {/* 가운데 화살표 (md↑) */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block fade-up">
                  <div className="h-[1px] w-[90px] bg-white/30"></div>
                  <div className="ml-[90px] -mt-[6px] h-0 w-0 border-b-[6px] border-l-[8px] border-t-[6px] border-b-transparent border-t-transparent border-l-white/50"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 fade-up">
                  {/* left: concern */}
                  <div className="flex flex-col justify-center rounded-[18px] border border-white/10 p-6 md:p-8 bg-white/[0.02] text-center">
                    <h4
                      className="text-[34px] md:text-[31px] font-extrabold leading-tight"
                      dangerouslySetInnerHTML={{ __html: item.qTitle }}
                    />
                    {item.qSub && (
                      <p
                        className="mt-[20px] text-[28px] md:text-[18px] text-white/60"
                        dangerouslySetInnerHTML={{ __html: item.qSub }}
                      />
                    )}
                  </div>

                  {/* right: answer */}
                  <div className="flex flex-col justify-center rounded-[18px] border border-white/10 p-6 md:p-8 bg-white/[0.02] text-center">
                    <h4
                      className="text-[34px] md:text-[31px] font-extrabold leading-tight"
                      dangerouslySetInnerHTML={{ __html: item.aTitle }}
                    />
                    {item.aSub && (
                      <p
                        className="mt-[20px] text-[28px] md:text-[18px] text-white/75"
                        dangerouslySetInnerHTML={{ __html: item.aSub }}
                      />
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-[180px]">
        <div className="container mx-auto px-4">
          <h3 className="text-[78px] md:text-[90px] leading-[88px] md:leading-[100px] font-bold relative z-[1] fade-up">
            How
            <br />
            We
            <br />
            <span className="font-miller italic font-light">Work.</span>
          </h3>

          <div className="relative grid grid-cols-2 lg:grid-cols-3 gap-10 mt-[50px]">
            {workStep.map((item, i, arr) => (
              <div
                key={i}
                className="flow-step relative border-t border-white/15 pt-[60px] pb-[30px] fade-up"
                data-idx={i}
              >
                {/* STEP 배지 */}
                <div
                  className="step-badge inline-flex items-center justify-center
                          w-[80px] h-[80px] md:w-[52px] md:h-[52px] rounded-[9999px] bg-white/10
                          text-[28px] md:text-[18px] font-bold tracking-wide"
                >
                  {item.step}
                </div>

                <h4 className="text-[42px] md:text-[31px] mt-[30px] font-bold">
                  {item.title}
                </h4>
                <p
                  className="text-white/70 text-[28px] md:text-[18px] mt-[10px]"
                  dangerouslySetInnerHTML={{ __html: item.desc }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JSON-LD: Service + HowTo (process) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "nuvio 서비스 목록",
              itemListElement: (serviceCards || []).map((s, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: {
                  "@type": "Service",
                  name: s.title || s.titleEn,
                  alternateName: s.titleEn || s.title,
                  serviceType: s.badge,
                  provider: { "@type": "Organization", name: "nuvio" },
                },
              })),
            },
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "웹사이트 제작 프로세스",
              provider: { "@type": "Organization", name: "nuvio" },
              step: (typeof window === "undefined" ? [] : []).concat([
                { "@type": "HowToStep", position: 1, name: "미팅" },
                { "@type": "HowToStep", position: 2, name: "기획" },
                { "@type": "HowToStep", position: 3, name: "디자인 시안 작업" },
                { "@type": "HowToStep", position: 4, name: "퍼블리싱 & 개발" },
                { "@type": "HowToStep", position: 5, name: "검수 & 수정" },
                { "@type": "HowToStep", position: 6, name: "배포 & 런칭" },
              ]),
            },
          ]),
        }}
      />
    </main>
  );
}
