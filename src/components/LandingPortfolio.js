import Link from "next/link";
import Image from "next/image";
import { getAllWorks } from "@/lib/works";

export default function LandingPortfolio() {
  const works = getAllWorks()
    .sort((a, b) => new Date(b.inputDate) - new Date(a.inputDate))
    .slice(0, 3);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {works.map((work, idx) => (
        <Link
          key={work.slug}
          href={`/work/${work.slug}`}
          className="group relative rounded-2xl overflow-hidden bg-black border border-white/5 hover:border-main/50 transition-colors duration-300"
        >
          <div className="h-56 relative overflow-hidden">
            <Image
              src={work.thumbnail || "/images/work/placeholder-thum.png"}
              alt={work.title}
              fill
              sizes="(min-width:1280px) 400px, (min-width:768px) 50vw, 100vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-main/10 group-hover:bg-main/20 transition-colors" />
          </div>
          <div className="p-8">
            <div className="flex items-center gap-2 mb-4">
              {work.service && Array.isArray(work.service) && work.service[0] && (
                <span className="text-[10px] font-bold text-white bg-white/10 px-2 py-1 rounded">
                  {work.service[0]}
                </span>
              )}
              <span className="text-[10px] font-bold text-main bg-main/10 px-2 py-1 rounded">
                {work.year || "신규제작"}
              </span>
            </div>
            <h3 className="text-[28px] md:text-[24px] font-bold text-white mb-2 group-hover:text-main transition-colors">
              {work.title}
            </h3>
            {work.client && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-white/60 text-[16px] md:text-[14px]">
                  {work.client}
                </p>
                {work.seoDesc && (
                  <p className="text-white font-bold text-[24px] md:text-[20px] mt-1 line-clamp-2">
                    <span className="text-main">{work.seoDesc.substring(0, 50)}...</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
