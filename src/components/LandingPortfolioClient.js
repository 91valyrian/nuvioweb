"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Modal from "./Modal";

export default function LandingPortfolioClient() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWork, setSelectedWork] = useState(null);
  const [workDetail, setWorkDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    fetch("/api/works")
      .then((res) => res.json())
      .then((data) => {
        setWorks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch works:", err);
        setLoading(false);
      });
  }, []);

  const handleWorkClick = async (work) => {
    setSelectedWork(work);
    setLoadingDetail(true);
    setWorkDetail(null);

    try {
      const response = await fetch(`/api/works/${work.slug}`);
      if (response.ok) {
        const data = await response.json();
        setWorkDetail(data);
      }
    } catch (err) {
      console.error("Failed to fetch work detail:", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedWork(null);
    setWorkDetail(null);
  };

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="relative rounded-2xl overflow-hidden bg-black border border-white/5 animate-pulse"
          >
            <div className="relative w-full rounded-[20px] overflow-hidden bg-white/10 pt-[150%] md:pt-[585px]" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="h-4 bg-white/10 rounded w-1/2 mb-3" />
              <div className="h-6 bg-white/10 rounded w-3/4 mb-2" />
              <div className="h-4 bg-white/10 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (works.length === 0) {
    return null;
  }

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {works.map((work) => (
          <button
            key={work.slug}
            onClick={() => handleWorkClick(work)}
            className="group relative rounded-2xl overflow-hidden bg-black border border-white/5 hover:border-main/50 transition-colors duration-300 text-left w-full cursor-pointer"
          >
            {/* 썸네일 - 모바일 1:1.5 비율, 데스크톱 기존 규격 */}
            <div className="relative w-full rounded-[20px] overflow-hidden bg-black/20 pt-[120%] md:pt-[585px]">
              <Image
                src={work.thumbnail || "/images/work/placeholder-thum.png"}
                alt={work.title}
                fill
                sizes="(min-width:1280px) 400px, (min-width:768px) 50vw, 100vw"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* 그라데이션 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            </div>

            {/* 텍스트 영역 - 플로팅 */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
              <div className="flex items-center gap-2 mb-3">
                {work.service &&
                  Array.isArray(work.service) &&
                  work.service[0] && (
                    <span className="text-[24px] md:text-[14px] font-bold text-white bg-black/60 backdrop-blur-sm px-2 py-1 rounded">
                      {work.service[0]}
                    </span>
                  )}
                <span className="text-[24px] md:text-[14px] font-bold text-[#a78bfa] bg-black/60 backdrop-blur-sm px-2 py-1 rounded">
                  {work.year || "신규제작"}
                </span>
              </div>
              <h3 className="text-[38px] md:text-[28px] font-bold text-white mb-3 group-hover:text-[#a78bfa] transition-colors">
                {work.title}
              </h3>
              {work.seoDesc && (
                <p className="text-white/80 text-[28px] md:text-[16px] leading-relaxed line-clamp-2">
                  {work.seoDesc}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* 포트폴리오 상세 모달 */}
      <Modal
        open={!!selectedWork}
        onClose={handleCloseModal}
        title={selectedWork?.title || ""}
        size="lg"
        className="z-[2000]"
      >
        {loadingDetail ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a78bfa]"></div>
          </div>
        ) : workDetail ? (
          <div className="space-y-6">
            {/* 썸네일 */}
            {workDetail.cover && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                <Image
                  src={workDetail.cover}
                  alt={workDetail.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* 기본 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-white/60 text-[20px] md:text-[14px] mb-2">
                  Client
                </p>
                <p className="text-white text-[24px] md:text-[18px] font-semibold">
                  {workDetail.client}
                </p>
              </div>
              <div>
                <p className="text-white/60 text-[20px] md:text-[14px] mb-2">
                  Year
                </p>
                <p className="text-white text-[24px] md:text-[18px] font-semibold">
                  {workDetail.year || "신규제작"}
                </p>
              </div>
              {workDetail.service && workDetail.service.length > 0 && (
                <div className="md:col-span-2">
                  <p className="text-white/60 text-[20px] md:text-[14px] mb-2">
                    Service
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {workDetail.service.map((srv, i) => (
                      <span
                        key={i}
                        className="text-[#a78bfa] bg-[#a78bfa]/10 px-3 py-1 rounded text-[20px] md:text-[14px]"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 설명 */}
            {workDetail.seoDesc && (
              <div>
                <p className="text-white/60 text-[20px] md:text-[14px] mb-2">
                  Overview
                </p>
                <p className="text-white/90 text-[22px] md:text-[16px] leading-relaxed">
                  {workDetail.seoDesc}
                </p>
              </div>
            )}

            {/* portfolio.webp 이미지 */}
            {workDetail.portfolioImage && (
              <div className="pt-6 border-t border-white/10">
                <div className="relative w-full rounded-lg overflow-hidden">
                  <Image
                    src={workDetail.portfolioImage}
                    alt={`${workDetail.title} 포트폴리오`}
                    width={1200}
                    height={800}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            )}

            {/* 사이트 보기 버튼 - 최하단 */}
            {workDetail.href && (
              <div className="pt-6 flex justify-center">
                <a
                  href={workDetail.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-bold rounded-full hover:shadow-lg hover:shadow-[#6366f1]/50 transition-all duration-300 transform hover:-translate-y-1 text-[24px] md:text-[18px]"
                >
                  사이트 보기
                  <svg
                    className="w-6 h-6 md:w-5 md:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 text-white/60">
            포트폴리오 정보를 불러올 수 없습니다.
          </div>
        )}
      </Modal>
    </>
  );
}
