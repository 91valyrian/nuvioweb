import Link from "next/link";
import { matchingServices } from "@/data/services";
import { getAllWorks } from "@/lib/works";
export default function ServiceLinks({ title, tags = [] }) {
  const services = matchingServices(title, tags);
  const works = getAllWorks();
  const slugs = [...new Set(services.flatMap((s) => s.work))];
  return (
    <aside
      className="service-links mt-12 rounded-2xl bg-[#E7EBFC] p-6 text-black"
      aria-label="관련 서비스와 제작 사례"
    >
      <h2 className="text-2xl font-bold mb-4">프로젝트에 적용해 보세요</h2>
      <ul className="space-y-3 text-lg">
        {services.map((s) => (
          <li key={s.slug}>
            <Link className="underline" href={`/service/${s.slug}`}>
              {s.title} · 구성과 진행 방법
            </Link>
          </li>
        ))}
        {slugs.map((slug) => {
          const work = works.find((w) => w.slug === slug);
          return work ? (
            <li key={slug}>
              <Link className="underline" href={`/work/${slug}`}>
                {work.client} 제작 사례 살펴보기
              </Link>
            </li>
          ) : null;
        })}
      </ul>
    </aside>
  );
}
