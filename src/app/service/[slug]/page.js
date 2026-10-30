import Link from "next/link";
import Image from "next/image";
import { servicePresentation } from "@/data/servicePresentation";
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
  const presentation = servicePresentation[slug];
  const steps = [
    ["발견과 정리", "목적과 현재 사이트, 필요한 메뉴·기능을 확인합니다."],
    ["기획과 디자인", "콘텐츠와 디자인 방향, 견적 및 일정을 협의합니다."],
    ["개발과 검수", "디자인·개발 후 모바일·문의·관리 기능을 검수합니다."],
    ["오픈과 운영", "도메인과 검색 설정을 점검하고 운영 방법을 안내합니다."],
  ];
  return (
    <main className="service-detail service-page" data-service={slug}>
      <section className="services-overview service-page-visual" aria-labelledby="service-title">
        <div className={`services-overview-card services-overview-card--${slug}`}>
          <div className="services-overview-art" aria-hidden="true"><span /><span /><span /></div>
          <nav aria-label="현재 위치"><Link href="/">홈</Link><span>/</span><Link href="/service">서비스</Link><span>/</span><span>{s.title}</span></nav>
          <div className="service-page-hero-copy">
            <span className="service-page-kicker">{presentation.label} · WEBSITE SOLUTION</span>
            <h1 id="service-title">{s.title}</h1>
            <p>{s.summary}</p>
            <Link href="/contact" className="service-page-button rounded-[9999px]">프로젝트 상담 요청 <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="service-page-hero-bottom"><span>{presentation.tags.join(" · ")}</span><a href="#service-needs">서비스 살펴보기 ↓</a></div>
        </div>
      </section>
      <div className="service-page-body">
        <section id="service-needs" className="service-page-section">
          <div className="service-page-section-heading"><span className="service-page-kicker">01 / YOUR CHALLENGE</span><h2>이런 고민에서<br />시작하셨나요?</h2><p>지금의 상황을 출발점으로,<br />웹사이트가 할 일을 함께 정합니다.</p></div>
          <ul className="service-page-needs">{s.needs.map((need, i) => <li key={need}><span>0{i + 1}</span><h3>{need}</h3></li>)}</ul>
        </section>
        <section className="service-page-section service-page-scope-section">
          <div className="service-page-section-heading"><span className="service-page-kicker">02 / WHAT WE BUILD</span><h2>목적에 맞춰,<br />필요한 구성부터.</h2></div>
          <ul className="service-page-scope">{s.scope.map((scope, i) => <li key={scope}><span className="service-page-kicker">SCOPE 0{i + 1}</span><h3>{scope}</h3><span className="service-page-scope-line" aria-hidden="true" /></li>)}</ul>
          {s.note && <p className="service-page-note">{s.note}</p>}
        </section>
        <section className="service-page-section">
          <div className="service-page-section-heading"><span className="service-page-kicker">03 / PROCESS</span><h2>시작부터 오픈까지,<br />함께 만드는 과정.</h2></div>
          <ol className="service-page-steps">{steps.map(([title, description], i) => <li key={title}><span>0{i + 1}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol>
        </section>
        <section className="service-page-budget">
          <div><span className="service-page-kicker">BUDGET & TIMELINE</span><h2>비용과 일정은<br />필요한 범위에 맞게.</h2></div>
          <div><p>페이지 수, 원고·이미지 준비 상태, 디자인 범위, CMS·예약·외부 시스템 연동 여부에 따라 견적이 달라집니다. 초기 상담에서 필요한 기능과 자료를 확인한 뒤 제작 범위·비용·일정을 제안합니다.</p><p>콘텐츠 이전, 추가 기능, 유지관리 비용의 포함 여부도 견적에서 함께 확인하세요.</p><Link href="/columns/homepage-cost-guide" className="service-page-text-link">홈페이지 제작 비용의 구성 확인하기 <span aria-hidden="true">↗</span></Link></div>
        </section>
        {works.length > 0 && <section className="service-page-section service-page-section-stack"><div className="service-page-section-heading"><span className="service-page-kicker">SELECTED WORK</span><h2>화면으로 만나는 제작 사례.</h2><p>공개된 프로젝트의 화면과 제작 개요를 확인하세요.</p></div><ul className="service-page-works">{works.map(work => <li key={work.slug}><Link href={`/work/${work.slug}`}><div className="service-page-work-image">{work.thumbnail && <Image src={work.thumbnail} alt={`${work.client} 웹사이트 제작 사례`} width={1600} height={1000} style={{ width: "100%", height: "auto" }} sizes="(max-width: 767px) 82vw, (max-width: 1100px) 50vw, 33vw" />}</div><div className="service-page-work-caption"><div><h3>{work.client}</h3><p>{work.summary}</p></div><span aria-hidden="true">↗</span></div></Link></li>)}</ul></section>}
        <section className="service-page-section"><div className="service-page-section-heading"><span className="service-page-kicker">INSIGHTS</span><h2>준비가 쉬워지는<br />홈페이지 제작 가이드.</h2></div><ul className="service-page-guides">{columns.map((post, i) => <li key={post.slug}><Link href={`/columns/${post.slug}`}><span>0{i + 1}</span><h3>{post.title}</h3><span aria-hidden="true">↗</span></Link></li>)}</ul></section>
        <section className="service-page-consult"><span className="service-page-kicker">LET’S BUILD YOUR NEXT</span><h2>다음 단계를,<br />함께 시작해 볼까요?</h2><p>현재 사이트 주소, 필요한 메뉴, 참고 사이트, 희망 일정과 예산 범위를 알려주세요.<br />자료가 완성되지 않았다면 준비 상태부터 함께 확인합니다.</p><Link href="/contact" className="service-page-button rounded-[9999px]">{s.title} 상담하기 <span aria-hidden="true">↗</span></Link><Link href="/#services" className="service-page-back">다른 서비스 살펴보기 →</Link></section>
      </div>
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
