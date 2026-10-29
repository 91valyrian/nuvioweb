import Image from "next/image";
import "./work-detail.css";

export default function WorkMainSection({ images = [], title }) {
  if (!images.length) return null;

  return (
    <section className="">
      <div className="work-detail-content work-detail-images">
        <h2 className="mb-6 text-[64px] md:text-[50px] font-semibold sr-only">
          {title} 전체 디자인
        </h2>
        {images.map((src, i) => (
          <figure key={`design-${i}`} className="mb-10">
            <Image
              src={src}
              alt={`${title} 디자인 이미지 ${i + 1}`}
              sizes="(min-width: 1200px) 1152px, calc(100vw - 40px)"
              width={1620}
              height={1000}
              className="w-full h-auto rounded-[21px]"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}
