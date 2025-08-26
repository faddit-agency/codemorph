"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type CartItem = {
  id: string;
  name: string;
  price: string;
  size: string;
  color: string;
  quantity: number;
  image: string;
};

type CartSidebarProps = {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
};

export default function CartSidebar({ 
  open, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemoveItem 
}: CartSidebarProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, onClose]);

  if (!open) return null;

  const subtotal = items.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('$', ''));
    return sum + (price * item.quantity);
  }, 0);

  const shipping: number = 0; // Free shipping
  const total = subtotal + shipping;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      
      {/* Cart Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-black/10">
            <div className="text-xs text-black/60">CART</div>
            <button
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center hover:bg-black/5 rounded"
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path 
                  d="M12 4L4 12M4 4L12 12" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-4 text-center text-black/60">
                Your cart is empty
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="border-b border-black/5 pb-4 last:border-b-0">
                    <div className="flex gap-3">
                      {/* Product Image */}
                      <div className="w-16 h-20 relative bg-black/5 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-medium text-sm">{item.name}</h3>
                            <div className="text-xs text-black/60 mt-1">
                              {item.color} / Size {item.size}
                            </div>
                            <div className="text-sm mt-1">{item.price}</div>
                          </div>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-xs hover:underline underline-offset-2 text-black/60"
                          >
                            Remove
                          </button>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center mt-2">
                          <div className="text-xs mr-2">Qty</div>
                          <div className="flex items-center border border-black/15">
                            <button
                              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="w-8 h-8 flex items-center justify-center text-sm hover:bg-black/5"
                            >
                              -
                            </button>
                            <span className="w-8 h-8 flex items-center justify-center text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-sm hover:bg-black/5"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-black/10 p-4 space-y-3">
              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>SUBTOTAL</span>
                  <span>${subtotal.toFixed(2)} EUR</span>
                </div>
                <div className="flex justify-between">
                  <span>SHIPPING</span>
                  <span>{shipping === 0 ? '0 EUR' : `$${shipping.toFixed(2)} EUR`}</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t border-black/10">
                  <span>TOTAL</span>
                  <span>${total.toFixed(2)} EUR</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={onClose}
                className="block w-full bg-black text-white text-center py-3 text-sm font-medium hover:bg-black/90 transition-colors"
              >
                CHECKOUT
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
