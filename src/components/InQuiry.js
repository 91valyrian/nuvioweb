import Link from "next/link";

export default function InQuiry() {
  return (
    <section id="Contact" className="section-Contact py-[80px]">
      <div className="container">
        <div className="flexBox flex gap-[20px] flex-col xl:flex-row">
          <Link
            href="/contact"
            className="w-full relative group w-[calc(50%_-_10px)] block bg-[#111] pt-[60px] pb-[180px] md:py-[80px] px-[40px] rounded-[10px] text-center md:text-left rotate-x-up"
          >
            <p className="desc text-[28px] md:text-[24px] text-[#5A6270] font-semibold mb-[20px]">
              Project Request
            </p>
            <h4 className="title text-[52px] md:text-[39px] font-bold">
              홈페이지 제작 상담하기
            </h4>

            <div className="ico flex justify-center items-center absolute left-1/2 -translate-x-1/2 md:left-[inherit] md:translate-x-0 md:right-[44px] bottom-[60px] md:bottom-[84px] bg-white md:bg-[#111] group-hover:bg-white w-[110px] h-[110px] md:w-[100px] md:h-[100px] rounded-[9999px] rotate-405 group-hover:rotate-0 transition-all duration-800">
              <svg
                className="w-[40px] h-[32px] md:w-[34px] md:h-[26px]"
                width="100%"
                height="100%"
                viewBox="0 0 34 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  className="group-hover:stroke-black md:stroke-white stroke-black"
                  d="M2 13H32M32 13L20.75 2M32 13L20.75 24"
                  stroke="#E6ECFF"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </Link>

          <Link
            href="#;"
            className="w-full relative group w-[calc(50%_-_10px)] block bg-[#111] pt-[60px] pb-[180px] md:py-[80px] px-[40px] rounded-[10px] text-center md:text-left rotate-x-up"
          >
            <p className="desc text-[28px] md:text-[24px] text-[#5A6270] font-semibold mb-[20px]">
              Frequently Asked Questions
            </p>
            <h4 className="title text-[52px] md:text-[39px] font-bold">
              궁금한 내용이 있으신가요?
            </h4>

            <div className="ico flex justify-center items-center absolute left-1/2 -translate-x-1/2 md:left-[inherit] md:translate-x-0 md:right-[44px] bottom-[60px] md:bottom-[84px] bg-white md:bg-[#111] group-hover:bg-white w-[110px] h-[110px] md:w-[100px] md:h-[100px] rounded-[9999px] rotate-405 group-hover:rotate-0 transition-all duration-800">
              <svg
                className="w-[40px] h-[32px] md:w-[34px] md:h-[26px]"
                width="100%"
                height="100%"
                viewBox="0 0 34 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  className="group-hover:stroke-black md:stroke-white stroke-black"
                  d="M2 13H32M32 13L20.75 2M32 13L20.75 24"
                  stroke="#E6ECFF"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
