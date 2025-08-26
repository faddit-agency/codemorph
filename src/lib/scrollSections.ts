export type ScrollSection = {
  id: string;
  brand: string;
  category: string;
  title: string;
  link: string;
  imageUrl: string;
  imageAlt: string;
};

export const scrollSections: ScrollSection[] = [
  {
    id: "section-1",
    brand: "CODEMORPH",
    category: "MENS",
    title: "New Arrivals",
    link: "/mens",
    imageUrl: "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=800&auto=format&fit=crop&crop=center",
    imageAlt: "Men's fashion collection"
  },
  {
    id: "section-2", 
    brand: "CODEMORPH",
    category: "WOMENS",
    title: "Fall Collection",
    link: "/womens",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop",
    imageAlt: "Women's fashion collection"
  },
  {
    id: "section-3",
    brand: "CODEMORPH", 
    category: "FOOTWEAR",
    title: "Essential Steps",
    link: "/footwear",
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1600&auto=format&fit=crop",
    imageAlt: "Footwear collection"
  },
  {
    id: "section-4",
    brand: "CODEMORPH",
    category: "ACCESSORIES", 
    title: "Refined Details",
    link: "/accessories",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1600&auto=format&fit=crop",
    imageAlt: "Accessories collection"
  },
  {
    id: "section-5",
    brand: "CODEMORPH",
    category: "WORK SHOP",
    title: "Behind Scenes", 
    link: "/work-shop",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop",
    imageAlt: "Workshop and craftsmanship"
  }
];
