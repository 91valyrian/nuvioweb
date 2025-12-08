import Link from "next/link";

export default function InQuiry() {
  return (
    <div className="container mb-[50px] md:mb-[40px]">
      <Link
        href="/contact"
        className="block rounded-[9999px] border border-white px-10 py-10 hover:bg-main hover:text-white hover:border-main transition-all"
      >
        <div className="flex items-center justify-between">
          <h4 className="text-[50px] md:text-[40px] font-bold">
            <span className="hidden md:inline-block">Are you ready to</span>{" "}
            Contact us?
          </h4>
          <span className="inline-grid place-items-center w-16 h-16 rounded-[9999px] bg-white text-white">
            <svg
              className="w-[40px] h-[32px] md:w-[32px] md:h-[26px]"
              width="100%"
              height="100%"
              viewBox="0 0 34 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
            >
              <path
                className="stroke-black "
                d="M2 13H32M32 13L20.75 2M32 13L20.75 24"
                stroke="#000000"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </Link>
    </div>

    // <section id="Contact" className="pt-[80px] fade-up">
    //   <div className="container bg-[url(/main/heroSlide5.jpg)] bg-cover bg-center rounded-[20px]">
    //     <div className="h-[500px] md:h-[400px] flex flex-col md:flex-row items-center justify-center md:justify-between px-[20px] gap-[20px] md:gap-0">
    //       <h3 className="text-[34px] md:text-[30px] font-semibold rotate-x-up">
    //         경험보다 중요한 건 집중과 완성도라 믿습니다.
    //         <br />
    //         디테일로 신뢰를 쌓고, 결과로 증명합니다.
    //       </h3>
    //       <Link
    //         href="/contact"
    //         className="flex items-center gap-[30px] rotate-x-up"
    //       >
    //         <span className="text-[40px] md:text-[46px] italic underline">
    //           Consulting
    //         </span>
    //         <svg
    //           className="w-[40px] h-[32px] md:w-[32px] md:h-[26px]"
    //           width="100%"
    //           height="100%"
    //           viewBox="0 0 34 26"
    //           fill="none"
    //           xmlns="http://www.w3.org/2000/svg"
    //           aria-hidden="true"
    //           focusable="false"
    //         >
    //           <path
    //             className="stroke-white "
    //             d="M2 13H32M32 13L20.75 2M32 13L20.75 24"
    //             stroke="#E6ECFF"
    //             strokeWidth="3"
    //             strokeLinecap="round"
    //             strokeLinejoin="round"
    //           />
    //         </svg>
    //       </Link>
    //     </div>
    //   </div>
    // </section>
  );
}
