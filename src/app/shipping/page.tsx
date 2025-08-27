import ShippingTracker from "@/components/ShippingTracker";

export default function ShippingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content area */}
      <div className="flex-1 w-full max-w-none px-8 md:px-16 pt-16 md:pt-20 pb-8">
        <ShippingTracker />
      </div>
    </div>
  );
}
