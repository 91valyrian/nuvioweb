"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services } from "@/data/services";

gsap.registerPlugin(ScrollTrigger);

import { servicePresentation } from "@/data/servicePresentation";

export default function ServicesOverview() {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference) and (min-height: 620px)", () => {
      const section = sectionRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      const progress = progressRef.current;
      if (!section || !viewport || !track || !progress) return;
      let active = true;
      const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
      const animation = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
          onUpdate: self => {
            if (active && progress.isConnected) {
              progress.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      });
      animationRef.current = animation;
      section.dataset.pinned = "true";
      const resizeObserver = new ResizeObserver(() => {
        if (active && section.isConnected) ScrollTrigger.refresh();
      });
      resizeObserver.observe(viewport);
      document.fonts.ready.then(() => { if (active && section.isConnected) ScrollTrigger.refresh(); });
      return () => {
        active = false;
        resizeObserver.disconnect();
        animation.scrollTrigger?.kill(true);
        animation.kill();
        if (animationRef.current === animation) animationRef.current = null;
        delete section.dataset.pinned;
        progress.style.transform = "";
      };
    }, sectionRef);
    return () => media.revert();
  }, []);

  function revealFocusedCard(event) {
    // Pointer focus must not move the link between pointer-down and click.
    if (!event.currentTarget.matches(":focus-visible")) return;
    const trigger = animationRef.current?.scrollTrigger;
    if (!trigger || !trackRef.current || !viewportRef.current) return;
    const card = event.currentTarget;
    const distance = trackRef.current.scrollWidth - viewportRef.current.clientWidth;
    if (distance <= 0) return;
    const offset = Math.min(distance, Math.max(0, card.offsetLeft));
    viewportRef.current.scrollLeft = 0;
    trigger.scroll(trigger.start + (offset / distance) * (trigger.end - trigger.start));
    animationRef.current.progress(offset / distance);
  }

  return (
    <section id="services" ref={sectionRef} className="services-overview" aria-labelledby="services-heading">
      <div className="services-overview-wide">
        <div className="services-overview-heading">
          <div>
            <h2 id="services-heading">목적에 맞는<br className="services-overview-mobile-break" /> 홈페이지 제작</h2>
            <p>브랜드의 목표와 업종에 맞는 웹사이트를 만듭니다.</p>
          </div>
          <span className="services-overview-guide">SCROLL TO EXPLORE <span aria-hidden="true">→</span></span>
        </div>
        <div ref={viewportRef} className="services-overview-viewport" tabIndex={0} role="region" aria-label="홈페이지 제작 서비스 6개, 가로 스크롤로 확인">
          <div ref={trackRef} className="services-overview-track">
            {services.map((service, index) => {
              const detail = servicePresentation[service.slug];
              return (
                <Link key={service.slug} href={`/service/${service.slug}`} className={`services-overview-card services-overview-card--${service.slug}`} onFocus={revealFocusedCard}>
                  <div className="services-overview-card-top"><span>{detail.label}</span><span>0{index + 1}</span></div>
                  <div className="services-overview-art" aria-hidden="true"><span /><span /><span /></div>
                  <div className="services-overview-copy">
                  <h3>{service.title}</h3>
                  <p>{service.summary}</p>
                  </div>
                  <div className="services-overview-card-bottom"><span>{detail.tags.join(" · ")}</span><span className="services-overview-arrow rounded-[9999px]" aria-hidden="true">↗</span></div>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="services-overview-footer"><span>기획부터 디자인, 개발, 운영까지.</span><div className="services-overview-progress" aria-hidden="true"><span ref={progressRef} /></div><span>06 SERVICES</span></div>
      </div>
    </section>
  );
}
