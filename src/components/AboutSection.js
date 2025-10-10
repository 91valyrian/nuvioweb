"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type"; // 문장을 줄 단위로 쪼갤 때 필요하다면

export default function AboutSection() {
  const linesRef = useRef(null);

  useEffect(() => {
    if (!linesRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    // Split the target element into lines (client-only)
    const split = new SplitType(linesRef.current, { types: "lines" });

    // 각 라인이 자신의 스크롤 위치에 도달할 때 개별적으로 노출되도록 설정
    // 초기 상태를 0.3 투명도로 맞춰 놓고, 도달하면 1.0으로 자연스럽게 전환
    const animations = [];

    // 라인이 block처럼 쌓이도록 보장 (SplitType이 inline wrapping을 할 수 있음)
    gsap.set(split.lines, { display: "block" });

    split.lines.forEach((line) => {
      const anim = gsap.fromTo(
        line,
        { opacity: 0.1, rotateX: -30, transformOrigin: "50% 50% -80px" },
        {
          opacity: 1,
          rotateX: 0,
          ease: "none",
          scrollTrigger: {
            trigger: line,
            start: "top 75%",
            end: "top 55%",
            markers: false,
            scrub: true, // 스크롤 값과 연동되어 라인별로 읽히듯 전환
            toggleActions: "play none none reverse",
            // once: true,
          },
        }
      );
      animations.push(anim);
    });

    // roundList: 자식 3개를 타임라인으로 순차 등장
    const roundList = document.querySelector(".roundList");
    let roundTl;
    if (roundList) {
      const roundItems = roundList.querySelectorAll(":scope > div");
      // 초기 상태 세팅
      gsap.set(roundItems, {
        y: 24,
        opacity: 0,
        scale: 0.3,
        transformOrigin: "50% 50%",
      });

      // 타임라인 + ScrollTrigger
      roundTl = gsap.timeline({
        scrollTrigger: {
          trigger: roundList,
          start: "top 75%", // 리스트 상단이 화면 75% 지점에 오면 시작
          end: "bottom 55%", // 필요 시 조정 가능
          toggleActions: "play none none reverse",
          //   once: true,
          //   scrub: true, // 스크롤 비례 진행 원하면 주석 해제
          markers: false,
        },
        defaults: { duration: 0.6, ease: "power2.out" },
      });

      roundItems.forEach((el, i) => {
        roundTl.to(el, { y: 0, opacity: 1, scale: 1 }, i * 0.25);
      });
    }

    return () => {
      animations.forEach((a) => a?.revert?.());
      if (roundTl) {
        roundTl.kill();
      }
      split?.revert?.();
    };
  }, []);

  return (
    <div className="container">
      <div className="aboutInner 2xl:pl-[435px]">
        <div
          ref={linesRef}
          className="mt-[60px] text-[50px] leading-[90px] font-midume"
        >
          홈페이지는 기업의 첫인상이자 <br className="hidden md:block" />
          가장 강력한 영업사원입니다.
          <br className="hidden md:block" />
          고객은 기업을 알기 위해 가장 먼저 홈페이지를 찾습니다.
          <br className="hidden md:block" />
          홈페이지는 단순한 소개가 아니라, <br className="hidden md:block" />
          기업의 신뢰와 가치를 보여주는 첫 번째 창구입니다.
          <br className="hidden md:block" />
          전문적인 홈페이지는 브랜드 이미지를 강화하고,
          <br className="hidden md:block" />
          고객과의 신뢰를 쌓으며, <br className="hidden md:block" />
          새로운 비즈니스 기회를 만들어 냅니다.
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
        <div className="flex justify-center items-center text-[40px] md:text-[30px] font-bold w-[450px] h-[450px] md:w-[350px] md:h-[350px] rounded-[9999px] border border-main text-main mt-[-20px] md:mt-0">
          Website
        </div>
        <div className="flex justify-center items-center text-[40px] md:text-[30px] font-bold w-[450px] h-[450px] md:w-[350px] md:h-[350px] rounded-[9999px] border border-[#fff] md:ml-[-20px] mt-[-20px] md:mt-0">
          Marketing
        </div>
      </div>
    </div>
  );
}
