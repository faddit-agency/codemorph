"use client";

import Link from "next/link";
import type { ScrollSection as ScrollSectionType } from "@/lib/scrollSections";

type ScrollSectionProps = {
  section: ScrollSectionType;
  isActive: boolean;
  progress: number;
  isFirst: boolean;
};

export default function ScrollSection({ 
  section, 
  isActive, 
  progress,
  isFirst 
}: ScrollSectionProps) {
  // Image animation: starts from bottom and moves up
  const imageTranslateY = (1 - progress) * 100;
  
  // Text animation: starts from bottom and moves up
  const textTranslateY = (1 - progress) * 100;
  
  // Always show content, just animate position
  const imageOpacity = 1;
  const textOpacity = 1;

  return (
    <div 
      className={`fixed inset-0 ${
        isActive ? 'z-10' : 'z-0'
      }`}
      style={{
        opacity: isActive ? 1 : 0,
        pointerEvents: isActive ? 'auto' : 'none'
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
        {/* Left: Text content */}
        <div className="flex flex-col justify-start pt-8 md:pt-16 px-8 md:px-16 py-16 relative overflow-hidden">
          <div 
            className="space-y-6"
            style={{
              transform: `translateY(${textTranslateY}px)`,
              opacity: textOpacity
            }}
          >
            {isFirst && (
              <div className="text-[66px] md:text-[96px] leading-[1.05] tracking-tight font-bold">
                {section.brand}
              </div>
            )}
            <div className="text-[54px] md:text-[84px] leading-[1.1] font-bold">
              {section.category}
            </div>
            <Link 
              href={section.link}
              className="block text-[42px] md:text-[66px] leading-[1.15] font-medium underline-offset-4 hover:underline"
            >
              {section.title}
            </Link>
          </div>
        </div>

        {/* Right: Image */}
        <div className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center will-change-transform"
            style={{
              backgroundImage: `url(${section.imageUrl})`,
              transform: `translateY(${imageTranslateY}px)`,
              opacity: imageOpacity
            }}
            aria-label={section.imageAlt}
          />
        </div>
      </div>
    </div>
  );
}
