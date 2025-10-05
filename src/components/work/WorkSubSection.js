import Image from "next/image";

export default function WorkSubSection({ groups, title }) {
  if (!groups.subPc.length && !groups.subMobile.length) return null;

  return (
    <section className="py-40">
      <div className="md:max-w-[1280px] xl:max-w-[1800px] mx-auto px-[20px]">
        <h2 className="mb-6 text-[64px] md:text-[50px] font-semibold">
          Sub Page
        </h2>

        <div className="flex gap-[30px] sm:flex-nowrap flex-wrap flex-col md:flex-row">
          {groups.subPc.map((src, i) => (
            <figure key={`sub-pc-${i}`} className="">
              <Image
                src={src}
                alt={`${title} 홈페이지 - 서브페이지 PC 화면 이미지 ${i + 1}`}
                width={1800}
                height={1000}
                className="w-full h-auto rounded-[21px] workFigure"
              />
            </figure>
          ))}
          <div className="flex flex-col gap-[50px] md:gap-[30px] items-center py-[200px] md:py-0">
            {groups.subMobile.map((src, i) => (
              <figure key={`sub-mo-${i}`} className="">
                <Image
                  src={src}
                  alt={`${title} 홈페이지 - 서브페이지 모바일 화면 이미지 ${i + 1}`}
                  width={800}
                  height={1600}
                  className="w-[400px] md:w-full h-auto rounded-[21px] workFigure"
                />
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
