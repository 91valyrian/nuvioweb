import { SITE_URL, pageMetadata, stripHtml } from "@/lib/site";
import CardList from "@/components/CardList";
import SubVisual from "@/components/SubVisual";
import { getAllWorks } from "@/lib/works";

// SEO metadata for Work list page (minimal override; rest inherits from layout)
export function generateMetadata() {
  return pageMetadata({
    title: "홈페이지 제작 사례 · 기업·브랜드·프랜차이즈 포트폴리오",
    description:
      "기업, 법률사무소, 프랜차이즈와 브랜드의 실제 홈페이지 제작 사례를 모았습니다. 브랜딩 웹사이트, 랜딩페이지, SEO 중심 구조까지 nuvio의 작업 방식을 포트폴리오로 확인할 수 있습니다.",
    path: "/work",
  });
}

export const revalidate = 60; // ISR도 가능(파일 변경 후 재빌드 권장)

export default function WorkList() {
  const works = getAllWorks().sort(
    (a, b) => new Date(b.inputDate) - new Date(a.inputDate),
  );

  return (
    <main>
      <SubVisual value="Work" image="/images/work/visual.webp" />
      <section className="pb-[80px] pb-[240px] md:pb-[200px]">
        <h2 className="sr-only">포트폴리오 목록</h2>
        <div className="container">
          <CardList
            items={[...works].sort(
              (a, b) => new Date(b.inputDate) - new Date(a.inputDate),
            )}
            initialCount={works.length}
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
                  item: SITE_URL,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Work",
                  item: `${SITE_URL}/work`,
                },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: "Work 제작 사례 | nuvio",
              url: `${SITE_URL}/work`,
              about:
                "nuvio 프로젝트 사례 — 웹사이트 제작·기업 홈페이지·SEO 포트폴리오",
              inLanguage: "ko",
              hasPart: (works || []).slice(0, 20).map((w, i) => ({
                "@type": "CreativeWork",
                name: stripHtml(w.title),
                url: `${SITE_URL}/work/${w.slug}`,
                position: i + 1,
              })),
            },
          ]),
        }}
      />
    </main>
  );
}
