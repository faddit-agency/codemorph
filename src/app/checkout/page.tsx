export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content area */}
      <div className="flex-1 w-full max-w-none px-8 md:px-16 pt-16 md:pt-20 pb-8">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">Checkout</h1>
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input className="border border-black/15 px-3 py-2 w-full focus:outline-none focus:border-black" placeholder="email@example.com" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">First name</label>
                  <input className="border border-black/15 px-3 py-2 w-full focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last name</label>
                  <input className="border border-black/15 px-3 py-2 w-full focus:outline-none focus:border-black" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input className="border border-black/15 px-3 py-2 w-full focus:outline-none focus:border-black" />
              </div>
              <button className="border border-black px-6 py-3 hover:bg-black hover:text-white transition-colors">
                Pay
              </button>
            </form>
            <div className="border border-black/15 p-6 text-sm text-black/60 h-fit">
              Order summary (demo)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


