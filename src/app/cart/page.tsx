import Link from "next/link";

export default function CartPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content area */}
      <div className="flex-1 w-full max-w-none px-8 md:px-16 pt-16 md:pt-20 pb-8">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">Cart</h1>
          <div className="border border-black/15 p-6 text-sm text-black/60">
            Your cart is empty.
          </div>
          <div className="flex gap-3">
            <Link href="/" className="border border-black px-6 py-3 hover:bg-black hover:text-white transition-colors">
              Continue Shopping
            </Link>
            <Link href="/checkout" className="border border-black px-6 py-3 hover:bg-black hover:text-white transition-colors">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


