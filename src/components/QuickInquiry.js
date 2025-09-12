"use client";

import Link from "next/link";
import Image from "next/image";

export default function QuickInquiry() {
  return (
    <div className="fixed right-[20px] 2xl:left-1/2 2xl:-translate-x-1/2 bottom-[120px] w-[115px] 2xl:ml-[723px] z-50 flex justify-end">
      <div className="relative group">
        <Link
          href="/quick"
          className="flex items-center justify-center cursor-pointer pointer-events-auto w-[80px] h-[80px] rounded-full text-white relative before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-white before:backdrop-blur-[6px] before:transition-transform before:duration-300 group-hover:before:scale-180"
        >
          <Image
            src="/common/inquiry-ico.svg"
            alt="Next"
            width={26}
            height={26}
            className="w-[26px] h-auto relative z-10 transition-all duration-1000"
          />

          {/* Rotating label (wrapped to avoid transform overrides) */}
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[115px] h-[119px] pointer-events-none">
            <div className="w-full h-full animate-[rotateText_10s_linear_infinite] group-hover:invert">
              <Image
                src="/common/inquiry-text.svg"
                alt="Contact"
                width={115}
                height={119.15}
                className="w-full h-auto"
              />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}