import Image from "next/image";

export default function WorkMainSection({ images = [], title }) {
  if (!images.length) return null;

  return (
    <section className="">
      <div className="md:max-w-[1024px] xl:max-w-[1720px] mx-auto px-[20px]">
        <h3 className="mb-6 text-[64px] md:text-[50px] font-semibold sr-only">
          {title} 전체 디자인
        </h3>
        {images.map((src, i) => (
          <figure key={`design-${i}`} className="mb-10">
            <Image
              src={src}
              alt={`${title} 디자인 이미지 ${i + 1}`}
              width={1800}
              height={1000}
              className="w-full h-auto rounded-[21px]"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}
