import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <>
      <footer className="footer relative pt-[120px] md:pt-[150px]">
        <div className="container footer-inner md:flex justify-between">
          <div className="text-center md:text-left">
            <b className="text-[74px] md:text-[44px]">nuvio</b>
            <div className="flex flex-col items-center md:items-start gap-[5px] text-[32px] md:text-[22px] font-[300] text-neutral-300 mt-[30px]">
              <p className="">서울시 중구 왕십리로 393-1 202호</p>
              <ul className="flex gap-[20px]">
                <li>
                  <span>T : </span>{" "}
                  <a href="tel:010-9928-6110" target="_blank">
                    010-9928-6110
                  </a>
                </li>
                <li>
                  <span>E : </span>{" "}
                  <a href="mailto:nuvio@naver.com">nuvio@naver.com</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end gap-[20px] justify-center text-[32px] md:text-[24px] md:pr-[150px] text-center md:text-right mt-[50px] md:mt-0">
            <Link href="/about">회사소개</Link>
            <a href="https://blog.naver.com/nuvio" target="_blank">
              블로그
            </a>
            <a href="/work" target="_blank">
              인스타그램
            </a>
          </div>
        </div>
        <div className="footer-bottom text-center text-[28px] md:text-[18px] text-neutral-300 font-[200] py-[50px] md:py-[30px]">
          <div className="container">© {year} nuvio. All rights Reserved</div>
        </div>

        <div className="w-[100%] h-[400px] center-absolute footer-gradient -z-1"></div>
      </footer>
    </>
  );
}
