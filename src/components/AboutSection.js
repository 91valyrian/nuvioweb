"use client";

export default function AboutSection() {
  return (
    <div className="container">
      <div className="aboutInner 2xl:pl-[435px]">
        <div className="mt-[60px] text-[48px] leading-[90px] font-midume about-lines">
          홈페이지는 기업의 첫인상이 가장 강력한 영업사원입니다.
          <br className="hidden md:block" />
          고객은 기업을 알기 위해 가장 먼저 홈페이지를 찾습니다.
          <br className="hidden md:block" />
          홈페이지는 단순한 소개가 아니라 기업의 신뢰와 가치를
          <br className="hidden md:block" />
          보여주는 첫 번째 창구입니다.
          <br className="hidden md:block" />
          전문적인 홈페이지는 브랜드 이미지를 강화하고,
          <br className="hidden md:block" />
          고객과의 신뢰를 쌓으며 새로운 비즈니스 기회를 만들어 냅니다.
          <br className="hidden md:block" />
          nuvio는 기업의 비전과 스토리를 담아내어,
          <br className="hidden md:block" />
          귀사의 경쟁력을 한 단계 높이는 브랜딩 홈페이지를 제작합니다.
        </div>
      </div>

      <div className="roundList flex flex-col md:flex-row justify-center items-center mt-50">
        <div className="flex justify-center items-center text-[40px] md:text-[30px] font-bold w-[450px] h-[450px] md:w-[350px] md:h-[350px] rounded-[9999px] border border-[#fff]  md:mr-[-20px]">
          Branding
        </div>
        <div className="flex justify-center items-center text-[40px] md:text-[30px] font-bold w-[450px] h-[450px] md:w-[350px] md:h-[350px] rounded-[9999px] border border-main text-main mt-[-40px] md:mt-0">
          Website
        </div>
        <div className="flex justify-center items-center text-[40px] md:text-[30px] font-bold w-[450px] h-[450px] md:w-[350px] md:h-[350px] rounded-[9999px] border border-[#fff] md:ml-[-20px] mt-[-40px] md:mt-0">
          Marketing
        </div>
      </div>
    </div>
  );
}
