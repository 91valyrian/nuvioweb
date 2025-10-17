// SEO Metadata 설정
export async function generateMetadata() {
  return {
    title: "회사 소개 | 브랜드 방향성과 경험을 설계하는 홈페이지 제작 스튜디오",
    description:
      "nuvio는 브랜드 전략과 기획, 디자인, 개발, SEO를 하나의 시선으로 연결하는 홈페이지 제작 스튜디오입니다. 기업, 병원, 프랜차이즈 등 다양한 산업에서 브랜드의 방향성과 경험을 설계합니다.",
    keywords: [
      "홈페이지 제작",
      "기업홈페이지",
      "웹사이트 개발",
      "UIUX 디자인",
      "nuvio",
      "회사 소개",
      "웹 제작 스튜디오",
    ],
    openGraph: {
      title:
        "회사 소개 | 브랜드 방향성과 경험을 설계하는 홈페이지 제작 스튜디오",
      description:
        "nuvio는 브랜드 전략과 기획, 디자인, 개발, SEO를 하나의 시선으로 연결하는 홈페이지 제작 스튜디오입니다. 기업, 병원, 프랜차이즈 등 다양한 산업에서 브랜드의 방향성과 경험을 설계합니다.",
      url: "https://nuvio-web.com/about",
      siteName: "nuvio",
      type: "website",
    },
    alternates: {
      canonical: "https://nuvio-web.com/about",
    },
  };
}

import SubVisual from "@/components/SubVisual";
import { coreValues } from "@/data/coreValues";

const craftedList = [
  {
    id: 1,
    desc: "브랜드 아이덴티티에<br class='block md:hidden' />  최적화된 맞춤형 디자인 및 개발",
  },
  {
    id: 2,
    desc: "사용자 중심의 전략적<br class='block md:hidden' />  기획과 컨셉 수립",
  },
  {
    id: 3,
    desc: "안전하고 효율적인<br class='block md:hidden' />  데이터 이전 및 관리",
  },
  {
    id: 4,
    desc: "몰입감을 주는<br class='block md:hidden' />  직관적 UI·UX 설계",
  },
  {
    id: 5,
    desc: "모든 디바이스에<br class='block md:hidden' />  최적화된 반응형 웹 구현",
  },
  {
    id: 6,
    desc: "검색 엔진 최적화(SEO)를<br class='block md:hidden' />  통한 높은 가시성 확보",
  },
];

export default function AboutPage() {
  return (
    <main>
      <SubVisual value="About" image="/images/about/visual.png" />

      {/* vsiual Text */}
      <section className="rotate-x-up">
        <div className="container md:py-[50px]">
          <p className="text-[28px] md:text-[24px] pl-[150px] md:pl-0 text-left md:text-right">
            홈페이지는 기업의 얼굴이자 가장
            <br className="block md:hidden" /> 강력한 영업 도구입니다.
            <br />
            NUVIO는 단순한 디자인을 넘어
            <br className="block md:hidden" /> 브랜드의 스토리를 담아냅니다.
            <br />
            차별화된 전략과 세련된 UI/UX로
            <br className="block md:hidden" /> 기업의 이미지를 강화하고,
            <br />
            고객에게 오래 기억되는 첫인상을 남깁니다.
          </p>
        </div>
      </section>

      {/* Perfect Core Values */}
      <section className="pt-[180px] rotate-x-up">
        <div className="container">
          <h3 className="text-[78px] md:text-[90px] font-bold">
            Perfect{" "}
            <span className="font-miller italic font-light">Core Values.</span>
          </h3>

          <div className="valueList flex flex-wrap gap-[20px] mt-[50px]">
            {coreValues.map((item, index) => (
              <div
                key={item.id}
                className="valueItem w-[calc(50%_-_10px)] md:w-[calc(33.3333%_-_15px)] xl:w-[calc(25%_-_15px)] h-[300px] md:h-[200px] border-t border-[#5A6270] py-[20px] fade-up"
              >
                <h4
                  className="h-[102px] md:h-[auto] text-[34px] md:text-[31px] font-bold mb-[20px] md:mb-[10px] rotate-x-up"
                  dangerouslySetInnerHTML={{ __html: item.title }}
                />
                <p
                  className="text-[28px] md:text-[20px] rotate-x-up"
                  dangerouslySetInnerHTML={{ __html: item.desc }}
                ></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Deliver. */}
      <section className="py-[180px] mt-[700px]">
        <h3 className="container text-[78px] md:text-[90px] leading-[88px] md:leading-[100px] font-bold relative z-[1]">
          <span className="rotate-x-up block">What</span>
          <span className="rotate-x-up block">We</span>
          <span className="font-miller italic font-light rotate-x-up block">
            Deliver.
          </span>
        </h3>

        <div className="cover w-[484px] md:w-[768px] mx-auto h-[930px] md:h-[100vh] bg-[url(/images/about/deliverCover.png)] bg-cover bg-center translate-y-[-930px] md:translate-y-[-100vh] rounded-[50px] relative z-[-1]"></div>

        <div className="container">
          <div className="pl-0 md:pl-[210px] xl:pl-[527px]">
            <h4 className="text-[61px] leading-[71px] font-bold relative z-[1] rotate-x-up">
              Crafted for{" "}
              <span className="font-miller italic font-light">Excellence.</span>
            </h4>

            <div className="valueList flex flex-wrap gap-[10px] mt-[50px]">
              {craftedList.map((item, index) => (
                <div
                  key={item.id}
                  className="valueItem w-[calc(50%_-_10px)] xl:w-[calc(50%_-_10px)]  border-t border-[#5A6270] py-[30px] fade-up"
                >
                  <p
                    className="text-[28px] md:text-[20px] font-light"
                    dangerouslySetInnerHTML={{ __html: item.desc }}
                  ></p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* JSON-LD: Organization + WebSite + AboutPage + BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "nuvio",
              url: process.env.NEXT_PUBLIC_SITE_URL || "https://nuvio-web.com",
              logo:
                (process.env.NEXT_PUBLIC_SITE_URL || "https://nuvio-web.com") +
                "/icons/apple-touch-icon.png",
              // "sameAs": ["https://www.instagram.com/...", "https://www.linkedin.com/company/..."]
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "nuvio",
              url: process.env.NEXT_PUBLIC_SITE_URL || "https://nuvio-web.com",
              inLanguage: "ko",
              publisher: {
                "@type": "Organization",
                name: "nuvio",
              },
              // 검색창이 있다면 SearchAction 추가 가능
              // "potentialAction": {
              //   "@type": "SearchAction",
              //   "target": (process.env.NEXT_PUBLIC_SITE_URL || "https://nuvio-web.com") + "/search?q={query}",
              //   "query-input": "required name=query"
              // }
            },
            {
              "@context": "https://schema.org",
              "@type": "AboutPage",
              name: "회사 소개 — 홈페이지 제작 전문 웹사이트 개발사 | nuvio",
              url:
                (process.env.NEXT_PUBLIC_SITE_URL || "https://nuvio-web.com") +
                "/about",
              inLanguage: "ko",
              isPartOf: {
                "@type": "WebSite",
                url:
                  process.env.NEXT_PUBLIC_SITE_URL || "https://nuvio-web.com",
              },
              primaryImageOfPage: {
                "@type": "ImageObject",
                url:
                  (process.env.NEXT_PUBLIC_SITE_URL ||
                    "https://nuvio-web.com") + "/images/about/visual.png",
              },
              description:
                "nuvio는 브랜드 전략과 디자인, 개발을 아우르는 홈페이지 제작 전문 스튜디오입니다. 다양한 산업군의 웹사이트를 차별화된 전략으로 제작합니다.",
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item:
                    process.env.NEXT_PUBLIC_SITE_URL || "https://nuvio-web.com",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "About",
                  item:
                    (process.env.NEXT_PUBLIC_SITE_URL ||
                      "https://nuvio-web.com") + "/about",
                },
              ],
            },
          ]),
        }}
      />
    </main>
  );
}
