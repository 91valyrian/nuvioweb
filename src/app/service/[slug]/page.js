import Link from "next/link";
import { notFound } from "next/navigation";
import { services } from "@/data/services";
import { getWorkBySlug } from "@/lib/works";
import { getColumnBySlug } from "@/lib/columns";
import { pageMetadata, absoluteUrl, jsonLd, SITE_URL } from "@/lib/site";
export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();
  return pageMetadata({
    title: `${service.title} · 구성·비용·제작 사례`,
    description: service.summary,
    path: `/service/${slug}`,
  });
}
export default async function ServiceDetail({ params }) {
  const { slug } = await params;
  const s = services.find((s) => s.slug === slug);
  if (!s) notFound();
  const works = s.work.map(getWorkBySlug).filter(Boolean);
  const columns = s.columns.map(getColumnBySlug).filter(Boolean);
  return (
    <main className="service-detail container pt-[200px] pb-24 max-w-[1100px]">
      <nav aria-label="현재 위치" className="text-neutral-400 mb-8">
        <Link href="/">홈</Link> / <Link href="/service">서비스</Link> /{" "}
        {s.title}
      </nav>
      <h1 className="text-4xl md:text-6xl font-bold leading-tight">
        {s.title}
      </h1>
      <p className="text-xl md:text-2xl leading-relaxed text-neutral-300 mt-6">
        {s.summary}
      </p>
      <Link
        href="/contact"
        className="inline-flex bg-main px-6 py-4 rounded-full mt-8 text-lg"
      >
        프로젝트 상담 요청
      </Link>
      <section className="mt-20">
        <h2 className="text-3xl font-bold mb-6">이런 상황에서 검토해 보세요</h2>
        <ul className="list-disc pl-6 space-y-3 text-xl text-neutral-300">
          {s.needs.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </section>
      <section className="mt-16">
        <h2 className="text-3xl font-bold mb-6">프로젝트에서 함께 정할 구성</h2>
        <ul className="list-disc pl-6 space-y-3 text-xl text-neutral-300">
          {s.scope.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
        {s.note && <p className="mt-5 text-base text-neutral-400">{s.note}</p>}
      </section>
      <section className="mt-16">
        <h2 className="text-3xl font-bold mb-6">
          비용과 일정은 어떻게 정하나요?
        </h2>
        <p className="text-xl leading-relaxed text-neutral-300">
          페이지 수, 원고·이미지 준비 상태, 디자인 범위, CMS·예약·외부 시스템
          연동 여부에 따라 견적이 달라집니다. 초기 상담에서 필요한 기능과 자료를
          확인한 뒤 제작 범위·비용·일정을 제안합니다. 콘텐츠 이전, 추가 기능,
          유지관리 비용의 포함 여부도 견적에서 함께 확인하세요.
        </p>
        <Link
          href="/columns/homepage-cost-guide"
          className="inline-block underline mt-4 text-lg"
        >
          홈페이지 제작 비용의 구성 확인하기
        </Link>
      </section>
      <section className="mt-16">
        <h2 className="text-3xl font-bold mb-6">제작은 이렇게 진행합니다</h2>
        <ol className="list-decimal pl-6 space-y-4 text-xl text-neutral-300">
          <li>목적과 현재 사이트, 필요한 메뉴·기능을 확인합니다.</li>
          <li>콘텐츠와 디자인 방향, 견적 및 일정을 협의합니다.</li>
          <li>디자인·개발 후 모바일·문의·관리 기능을 검수합니다.</li>
          <li>도메인과 검색 설정을 점검하고 운영 방법을 안내합니다.</li>
        </ol>
      </section>
      {works.length > 0 && (
        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-6">관련 제작 사례</h2>
          <p className="text-neutral-400 mb-4">
            공개된 프로젝트의 화면과 제작 개요를 확인하세요.
          </p>
          <ul className="space-y-4 text-xl">
            {works.map((w) => (
              <li key={w.slug}>
                <Link className="underline" href={`/work/${w.slug}`}>
                  {w.client} · {w.summary}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className="mt-16">
        <h2 className="text-3xl font-bold mb-6">
          준비할 때 도움이 되는 가이드
        </h2>
        <ul className="space-y-4 text-xl">
          {columns.map((p) => (
            <li key={p.slug}>
              <Link className="underline" href={`/columns/${p.slug}`}>
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-16 bg-white/5 rounded-2xl p-8">
        <h2 className="text-3xl font-bold mb-4">
          상담 전에는 무엇을 준비하나요?
        </h2>
        <p className="text-xl text-neutral-300 leading-relaxed">
          현재 사이트 주소, 필요한 메뉴, 참고 사이트, 희망 일정과 예산 범위를
          알려주세요. 자료가 완성되지 않았다면 준비 상태부터 함께 확인합니다.
        </p>
        <Link
          href="/contact"
          className="inline-flex bg-main rounded-full px-6 py-4 mt-6 text-lg"
        >
          {s.title} 상담하기
        </Link>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd([
            {
              "@context": "https://schema.org",
              "@type": "Service",
              name: s.title,
              description: s.summary,
              url: absoluteUrl(`/service/${slug}`),
              provider: { "@id": `${SITE_URL}/#organization` },
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "홈",
                  item: absoluteUrl("/"),
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "홈페이지 제작 서비스",
                  item: absoluteUrl("/service"),
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: s.title,
                  item: absoluteUrl(`/service/${slug}`),
                },
              ],
            },
          ]),
        }}
      />
    </main>
  );
}
