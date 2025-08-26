"use client";

import { useEffect, useState, useCallback } from "react";
import ScrollSection from "./ScrollSection";
import { scrollSections } from "@/lib/scrollSections";

export default function ScrollContainer() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const totalHeight = scrollSections.length * windowHeight;
    
    // Calculate overall progress (0 to 1)
    const progress = Math.min(scrollY / (totalHeight - windowHeight), 1);
    setScrollProgress(progress);
    
    // Calculate active section
    const currentProgress = progress * scrollSections.length;
    const currentIndex = Math.min(Math.floor(currentProgress), scrollSections.length - 1);
    setActiveSection(currentIndex);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Calculate progress for each section
  const getSectionProgress = (index: number) => {
    const sectionStart = index / scrollSections.length;
    const sectionEnd = (index + 1) / scrollSections.length;
    
    if (scrollProgress < sectionStart) return 0;
    if (scrollProgress > sectionEnd) return 1;
    
    return (scrollProgress - sectionStart) / (sectionEnd - sectionStart);
  };



  return (
    <>
      {/* Spacer to create scroll area */}
      <div 
        style={{ 
          height: `${scrollSections.length * 100}vh` 
        }} 
        className="relative"
      />
      
      {/* Fixed positioned sections */}
      {scrollSections.map((section, index) => {        
        return (
          <ScrollSection
            key={section.id}
            section={section}
            isActive={index === activeSection}
            progress={getSectionProgress(index)}
            isFirst={index === 0}
          />
        );
      })}
    </>
  );
}
