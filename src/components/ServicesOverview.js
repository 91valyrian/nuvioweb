import Link from "next/link";
import { services } from "@/data/services";
export default function ServicesOverview() {
  return (
    <section className="services-overview container py-24">
      <h2 className="text-3xl md:text-4xl font-bold mb-8">
        목적에 맞는 홈페이지 제작
      </h2>
      <div className="grid md:grid-cols-3 gap-5">
        {services.map((s) => (
          <Link
            key={s.slug}
            href={`/service/${s.slug}`}
            className="block rounded-2xl border border-white/20 p-6 hover:bg-white/5"
          >
            <h3 className="text-2xl font-semibold mb-3">{s.title}</h3>
            <p className="text-lg text-neutral-400 leading-relaxed">
              {s.summary}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
