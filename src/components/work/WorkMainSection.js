import Image from "next/image";

export default function WorkMainSection({ groups, title }) {
  if (!groups.mainPc.length && !groups.mainMobile.length) return null;

  return (
    <section className="py-40 bg-[#222]">
      <div className="md:max-w-[1024px] xl:max-w-[1200px] mx-auto px-[20px]">
        <h2 className="mb-6 text-[64px] md:text-[50px] font-semibold">
          Main Page
        </h2>

        {groups.mainPc.map((src, i) => (
          <figure key={`main-pc-${i}`} className="workFigure">
            <Image
              src={src}
              alt={`${title} 홈페이지 - 메인 PC 화면 이미지 ${i + 1}`}
              width={1800}
              height={1000}
              className="w-full h-auto rounded-[21px]"
            />
          </figure>
        ))}
      </div>

      <div className="flex flex-wrap xl:flex-nowrap justify-center gap-[20px] px-[20px] py-[200px] [&>*:nth-child(even)]:pt-0 md:[&>*:nth-child(even)]:pt-[80px]">
        {groups.mainMobile.map((src, i) => (
          <figure key={`main-mo-${i}`} className="">
            <Image
              src={src}
              alt={`${title} 홈페이지 - 메인 모바일 화면 이미지 ${i + 1}`}
              width={800}
              height={1600}
              className="w-[400px] md:w-[335px] h-auto rounded-[21px]"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}
