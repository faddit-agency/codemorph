"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import SearchDialog from "@/components/SearchDialog";
import MobileMenu from "@/components/MobileMenu";
import LoginDialog from "@/components/LoginDialog";
import CartSidebar from "@/components/CartSidebar";
import { useCart } from "@/contexts/CartContext";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  
  const { items, isOpen, openCart, closeCart, updateQuantity, removeItem, getTotalItems } = useCart();
  
  return (
    <header className="border-b border-black/10 sticky top-0 bg-white z-50">
      <div className="w-full max-w-none px-8 md:px-16 flex items-center justify-between h-16">
        {/* Left: Hamburger menu */}
        <button
          aria-label="Menu"
          className="hamburger-button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Center: Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo_0826.svg"
            alt="CODEMORPH"
            width={180}
            height={36}
            className="h-9 w-auto"
          />
        </Link>

        {/* Right: Search, Login & Cart */}
        <div className="flex items-center gap-4 text-sm">
          <button aria-label="Search" className="hover:underline" onClick={() => setSearchOpen(true)}>
            Search
          </button>
          <button aria-label="Login" className="hover:underline" onClick={() => setLoginOpen(true)}>
            Login
          </button>
          <button onClick={openCart} className="hover:underline">
            Cart ({getTotalItems()})
          </button>
        </div>
      </div>
      
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
      <CartSidebar 
        open={isOpen} 
        onClose={closeCart} 
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
    </header>
  );
}


