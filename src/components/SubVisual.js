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
        <h1 className="subTitle mb-[16px] text-[28px] md:text-[32px] leading-tight font-normal rotate-x-up">
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
        <p className="sub-visual-slogan font-normal rotate-x-up">
          Let’s Talk <span className="font-miller italic font-light">Ideas,</span>
          <span className="block pl-[150px] rotate-x-up">
            Build <span className="font-miller italic font-light">Together</span>
          </span>
        </p>
      </div>

      <div className="container flex justify-right"></div>
    </section>
  );
}
