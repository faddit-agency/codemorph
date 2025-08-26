import Link from "next/link";
import Image from "next/image";

export type Product = {
  slug: string;
  name: string;
  price: string;
  image: string;
  imageAlt?: string;
};

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.slug}`} className="group space-y-2">
      <div className="aspect-square relative overflow-hidden bg-black/5 group-hover:bg-black/10 transition-colors">
        <Image
          src={product.image}
          alt={product.imageAlt ?? product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="text-sm flex items-center justify-between">
        <span>{product.name}</span>
        <span className="text-black/60">{product.price}</span>
      </div>
    </Link>
  );
}


