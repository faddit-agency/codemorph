"use client";

import { products } from "@/lib/products";
import Link from "next/link";
import Image from "next/image";
import { useState, use } from "react";
import { useCart } from "@/contexts/CartContext";

export default function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  const resolvedParams = use(params);
  const product = products.find((p) => p.slug === resolvedParams.slug);
  const { addItem } = useCart();
  
  // 사이즈 옵션
  const sizes = ["XS", "S", "M", "L", "XL"];
  
  // 색상 옵션 (카테고리별로 다르게)
  const getColors = (category: string) => {
    switch (category) {
      case "mens":
        return [
          { name: "Black", value: "#000000" },
          { name: "White", value: "#FFFFFF" },
          { name: "Navy", value: "#1f2937" },
          { name: "Grey", value: "#6b7280" }
        ];
      case "womens":
        return [
          { name: "Black", value: "#000000" },
          { name: "White", value: "#FFFFFF" },
          { name: "Beige", value: "#f5f5dc" },
          { name: "Pink", value: "#ffc0cb" }
        ];
      case "footwear":
        return [
          { name: "Black", value: "#000000" },
          { name: "White", value: "#FFFFFF" },
          { name: "Brown", value: "#8b4513" },
          { name: "Navy", value: "#1f2937" }
        ];
      default:
        return [
          { name: "Black", value: "#000000" },
          { name: "White", value: "#FFFFFF" },
          { name: "Brown", value: "#8b4513" }
        ];
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 w-full max-w-none px-8 md:px-16 pt-16 md:pt-20">
          <p>Product not found.</p>
        </div>
      </div>
    );
  }

  const colors = getColors(product.category);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content area */}
      <div className="flex-1 w-full max-w-none px-8 md:px-16 pt-16 md:pt-20 pb-8">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          {/* Product Image */}
          <div className="aspect-square relative overflow-hidden bg-black/5">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="text-sm text-black/60">{product.category.toUpperCase()}</div>
              <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
              <div className="text-lg">{product.price}</div>
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <div className="text-sm font-medium">Size</div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`border px-4 py-2 text-sm transition-colors ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-black/20 hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-3">
              <div className="text-sm font-medium">Color</div>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color.name
                        ? "border-black scale-110"
                        : "border-black/20 hover:border-black/50"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    {color.value === "#FFFFFF" && (
                      <div className="w-full h-full rounded-full border border-black/10" />
                    )}
                  </button>
                ))}
              </div>
              {selectedColor && (
                <div className="text-sm text-black/60">{selectedColor}</div>
              )}
            </div>

            <button 
              className="w-full border border-black px-6 py-3 hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedSize || !selectedColor}
              onClick={() => {
                if (selectedSize && selectedColor && product) {
                  addItem({
                    name: product.name,
                    price: product.price,
                    size: selectedSize,
                    color: selectedColor,
                    image: product.image
                  });
                }
              }}
            >
              Add to Cart
            </button>
            
            <div className="text-sm text-black/60">
              <p>Composed materials. Made in EU. This is a demo description.</p>
            </div>
            
            <Link href={`/${product.category}`} className="underline underline-offset-4 block text-sm">
              Back to {product.category.toUpperCase()}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


