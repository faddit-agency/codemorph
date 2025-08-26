"use client";

import Link from "next/link";
import { useEffect } from "react";

const navItems = [
  { href: "/mens", label: "MENS" },
  { href: "/womens", label: "WOMENS" },
  { href: "/footwear", label: "FOOTWEAR" },
  { href: "/accessories", label: "ACCESSORIES" },
  { href: "/work-shop", label: "WORK SHOP" },
];

const infoItems = [
  { href: "/info/shipping-returns", label: "Shipping & Return" },
  { href: "/info/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/stores", label: "Stores" },
  { href: "/runways", label: "Runways" },
  { href: "/projects", label: "Projects" },
  { href: "/info", label: "Info" },
];

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const onEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", onEsc);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", onEsc);
      };
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Close button (X) */}
      <button
        onClick={onClose}
        className="fixed top-4 left-8 md:left-16 z-60 w-6 h-6 flex items-center justify-center"
        aria-label="Close menu"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 5L5 15M5 5L15 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      
      <div className="flex h-full">
        {/* Left side - Main categories */}
        <div className="flex-1 flex flex-col justify-start pt-32 md:pt-40 px-8 md:px-16 py-16">
          <div className="space-y-6">
            {/* CODEMORPH text at same position as main content */}
            <div className="text-[66px] md:text-[96px] leading-[1.05] tracking-tight font-bold">
              CODEMORPH
            </div>
            <nav className="space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-[54px] md:text-[84px] leading-[1.1] font-bold hover:underline underline-offset-4"
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Bottom left info */}
          <div className="mt-auto mb-8 space-y-2">
            {infoItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-sm hover:underline underline-offset-4"
                onClick={onClose}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="mt-6">
              <div className="text-sm font-medium mb-2">Newsletter</div>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email address"
                  className="border border-black px-3 py-2 text-sm flex-1"
                />
                <button className="border border-black px-4 py-2 text-sm">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Image collage area */}
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
          <div className="grid grid-cols-2 gap-4 p-8">
            <div className="aspect-square bg-gray-200"></div>
            <div className="aspect-[3/4] bg-gray-300"></div>
            <div className="aspect-[4/3] bg-gray-400"></div>
            <div className="aspect-square bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
