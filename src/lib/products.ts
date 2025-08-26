export type Category = "mens" | "womens" | "footwear" | "accessories";

export type Product = {
  slug: string;
  name: string;
  price: string;
  category: Category;
  image: string;
};

export const products: Product[] = [
  // MENS
  { slug: "box-shirt-black", name: "Box Shirt Black", price: "$280", category: "mens", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center" },
  { slug: "box-shirt-white", name: "Box Shirt White", price: "$280", category: "mens", image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop&crop=center" },
  { slug: "casual-tee-grey", name: "Casual Tee Grey", price: "$120", category: "mens", image: "https://images.unsplash.com/photo-1583743814966-8936f37f4678?w=400&h=400&fit=crop&crop=center" },
  { slug: "denim-jacket", name: "Denim Jacket", price: "$320", category: "mens", image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&crop=center" },
  { slug: "wool-sweater", name: "Wool Sweater", price: "$240", category: "mens", image: "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=400&h=400&fit=crop&crop=center" },
  { slug: "chino-pants", name: "Chino Pants", price: "$180", category: "mens", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop&crop=center" },
  
  // WOMENS
  { slug: "dress-sand", name: "Dress Sand", price: "$340", category: "womens", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop&crop=center" },
  { slug: "heel-strap", name: "Heel Strap", price: "$420", category: "womens", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop&crop=center" },
  { slug: "silk-blouse", name: "Silk Blouse", price: "$290", category: "womens", image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center" },
  { slug: "midi-skirt", name: "Midi Skirt", price: "$220", category: "womens", image: "https://images.unsplash.com/photo-1583496661160-fb5886a13d4e?w=400&h=400&fit=crop&crop=center" },
  { slug: "cashmere-cardigan", name: "Cashmere Cardigan", price: "$380", category: "womens", image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=400&h=400&fit=crop&crop=center" },
  { slug: "wide-leg-trousers", name: "Wide Leg Trousers", price: "$260", category: "womens", image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center" },
  
  // FOOTWEAR
  { slug: "runner-grey", name: "Runner Grey", price: "$320", category: "footwear", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&crop=center" },
  { slug: "loafer-black", name: "Loafer Black", price: "$390", category: "footwear", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center" },
  { slug: "ankle-boots", name: "Ankle Boots", price: "$450", category: "footwear", image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&crop=center" },
  { slug: "canvas-sneakers", name: "Canvas Sneakers", price: "$280", category: "footwear", image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop&crop=center" },
  { slug: "oxford-shoes", name: "Oxford Shoes", price: "$420", category: "footwear", image: "https://images.unsplash.com/photo-1582897085656-c636d006a246?w=400&h=400&fit=crop&crop=center" },
  { slug: "hiking-boots", name: "Hiking Boots", price: "$380", category: "footwear", image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&crop=center" },
  
  // ACCESSORIES
  { slug: "belt-leather", name: "Leather Belt", price: "$160", category: "accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center" },
  { slug: "sunglasses-oval", name: "Oval Sunglasses", price: "$210", category: "accessories", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop&crop=center" },
  { slug: "leather-bag", name: "Leather Bag", price: "$480", category: "accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center" },
  { slug: "wool-scarf", name: "Wool Scarf", price: "$120", category: "accessories", image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&crop=center" },
  { slug: "silver-watch", name: "Silver Watch", price: "$350", category: "accessories", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center" },
  { slug: "baseball-cap", name: "Baseball Cap", price: "$80", category: "accessories", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop&crop=center" },
];

export const categoryLabel: Record<Category, string> = {
  mens: "MENS",
  womens: "WOMENS",
  footwear: "FOOTWEAR",
  accessories: "ACCESSORIES",
};


