import ProductGrid from "@/components/ProductGrid";
import { categoryLabel, products, type Category } from "@/lib/products";
import Link from "next/link";
import { use } from "react";

type Params = Promise<{ category: Category }>;

// 세부 카테고리 정의
const subcategories = {
  mens: [
    "NEW ARRIVALS",
    "CORE COLLECTION", 
    "SHIRTING",
    "JERSEY",
    "OUTERWEAR",
    "JEANS",
    "LEATHER",
    "KNITWEAR",
    "SUITING",
    "TROUSERS",
    "SHORTS"
  ],
  womens: [
    "NEW ARRIVALS",
    "CORE COLLECTION",
    "DRESSES", 
    "TOPS",
    "OUTERWEAR",
    "BOTTOMS",
    "KNITWEAR",
    "LEATHER",
    "SUITING"
  ],
  footwear: [
    "NEW ARRIVALS",
    "SNEAKERS",
    "BOOTS",
    "LOAFERS",
    "SANDALS",
    "FORMAL"
  ],
  accessories: [
    "NEW ARRIVALS",
    "BAGS",
    "BELTS",
    "EYEWEAR",
    "JEWELRY",
    "HATS"
  ],
  "work-shop": [
    "BEHIND SCENES",
    "PROCESS",
    "MATERIALS",
    "CRAFTSMANSHIP"
  ]
};

export default function CategoryPage({ params }: { params: Params }) {
  const resolvedParams = use(params);
  const list = products.filter((p) => p.category === resolvedParams.category);
  const label = categoryLabel[resolvedParams.category];
  const subs = subcategories[resolvedParams.category] || [];
  
  return (
    <div className="h-screen flex flex-col">
      {/* Header section with more top spacing */}
      <div className="w-full max-w-none px-8 md:px-16 pt-16 md:pt-20 pb-4 flex-shrink-0">
        <h1 className="text-4xl md:text-5xl font-bold">{label}</h1>
      </div>

      {/* Main content area */}
      <div className="flex-1 w-full max-w-none px-8 md:px-16 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 h-full">
          {/* Left: Subcategories - Fixed */}
          <div className="space-y-4 overflow-y-auto">
            {subs.map((sub) => (
              <Link
                key={sub}
                href="#"
                className="block text-lg md:text-xl hover:underline underline-offset-4"
              >
                {sub}
              </Link>
            ))}
          </div>
          
          {/* Right: Products - Scrollable */}
          <div className="overflow-y-auto">
            <ProductGrid products={list} />
          </div>
        </div>
      </div>
    </div>
  );
}


