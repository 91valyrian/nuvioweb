import CardList from "@/components/CardList";
import SubVisual from "@/components/SubVisual";
import { getAllWorks } from "@/lib/works";

// SEO metadata for Work list page (minimal override; rest inherits from layout)
export async function generateMetadata() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://nuvio-web.com";
  return {
    title: "홈페이지 제작 사례 | 기업·병원·프랜차이즈 웹사이트 포트폴리오",
    description:
      "홈페이지 제작 사례로 보는 브랜딩과 SEO 전략, 산업별 맞춤형 웹사이트 포트폴리오를 확인하세요.",
    keywords: [
      "포트폴리오",
      "웹사이트 제작",
      "홈페이지 제작",
      "기업 홈페이지 제작",
      "브랜드 홈페이지",
      "SEO 홈페이지 제작",
      "홈페이지 제작 사례",
      "리뉴얼",
      "UI/UX",
      "nuvio",
    ],
    alternates: { canonical: `${base}/work` },
    // 이미지 배열은 상속되지 않으므로(배열은 병합되지 않음) 페이지 전용 이미지만 지정
    openGraph: { images: [{ url: "/og/og-default.png" }] },
    twitter: { images: ["/og/og-default.png"] },
  };
}

export const revalidate = 60; // ISR도 가능(파일 변경 후 재빌드 권장)

export default function WorkList() {
  const works = getAllWorks().sort(
    (a, b) => new Date(b.inputDate) - new Date(a.inputDate)
  );

  return (
    <main>
      <SubVisual value="Work" image="/images/work/visual.webp" />
      <section className="pb-[80px] pb-[240px] md:pb-[200px]">
        <div className="container">
          <CardList
            items={[...works].sort(
              (a, b) => new Date(b.inputDate) - new Date(a.inputDate)
            )}
            initialCount={6}
            loadMode="button"
            moreLabel="LOAD MORE"
            moreHoverLabel="+"
            step={3}
            cols="cols-3"
            gap="gap-lg"
            className="mt-[30px] md:mt-[50px]"
          />
        </div>
      </section>
      {/* JSON-LD: Breadcrumb + CollectionPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item:
                    process.env.NEXT_PUBLIC_SITE_URL || "https://www.nuvio.kr",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Work",
                  item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.nuvio.kr"}/work`,
                },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: "Work 제작 사례 | nuvio",
              url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.nuvio.kr"}/work`,
              about:
                "nuvio 프로젝트 사례 — 웹사이트 제작·기업 홈페이지·SEO 포트폴리오",
              inLanguage: "ko",
              hasPart: (works || []).slice(0, 20).map((w, i) => ({
                "@type": "CreativeWork",
                name: w.title,
                url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.nuvio.kr"}/work/${w.slug}`,
                position: i + 1,
              })),
            },
          ]),
        }}
      />
    </main>
  );
}
