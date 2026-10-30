export default function SubVisual({
  value,
  image,
  className,
  containerClassName,
  title,
}) {
  return (
    <section
      className={`visual h-[758px] pt-[450px] bg-cover bg-center ${className}`}
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className={`container ${containerClassName}`}>
        <h1 className="subTitle mb-[16px] text-[28px] md:text-[32px] leading-tight font-bold rotate-x-up">
          {title ||
            {
              About: "누비오 회사 소개",
              Service: "홈페이지 제작 서비스",
              Work: "홈페이지 제작 사례",
              Columns: "홈페이지 제작 칼럼",
              Contact: "홈페이지 제작 문의",
            }[value] ||
            value}
        </h1>
        <p className="text-[52px] leading-[62px] md:text-[49px] md:leading-[59px] font-light rotate-x-up">
          Let’s Talk Ideas,
          <span className="block pl-[150px] rotate-x-up">Build Together</span>
        </p>
      </div>

      <div className="container flex justify-right"></div>
    </section>
  );
}
