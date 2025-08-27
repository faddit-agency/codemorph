"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import TossPayment from "@/components/TossPayment";

export default function CheckoutPage() {
  const { items, getTotalItems } = useCart();
  const [customerInfo, setCustomerInfo] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
  });

  // 주문 총액 계산
  const subtotal = items.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('$', ''));
    return sum + (price * item.quantity);
  }, 0);

  const shipping: number = 0; // 무료 배송
  const total = subtotal + shipping;

  // 고유 주문 ID 생성
  const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentFail = (error: unknown) => {
    console.error("결제 실패:", error);
    alert("결제에 실패했습니다. 다시 시도해주세요.");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">장바구니가 비어있습니다</h1>
          <p className="text-gray-600 mb-6">결제할 상품을 먼저 장바구니에 추가해주세요.</p>
          <Link
            href="/"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            쇼핑 계속하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content area */}
      <div className="flex-1 w-full max-w-none px-8 md:px-16 pt-16 md:pt-20 pb-8">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">Checkout</h1>
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            {/* 고객 정보 폼 */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-medium mb-4">배송 정보</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <input 
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="border border-black/15 px-3 py-2 w-full focus:outline-none focus:border-black" 
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">First name *</label>
                      <input 
                        type="text"
                        value={customerInfo.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="border border-black/15 px-3 py-2 w-full focus:outline-none focus:border-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Last name *</label>
                      <input 
                        type="text"
                        value={customerInfo.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="border border-black/15 px-3 py-2 w-full focus:outline-none focus:border-black"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Address *</label>
                    <input 
                      type="text"
                      value={customerInfo.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="border border-black/15 px-3 py-2 w-full focus:outline-none focus:border-black"
                      placeholder="서울시 강남구 테헤란로 123"
                      required
                    />
                  </div>
                </form>
              </div>

              {/* 결제 위젯 */}
              <div>
                <h2 className="text-xl font-medium mb-4">결제</h2>
                <TossPayment
                  amount={total}
                  orderId={orderId}
                  orderName={`CODEMORPH 상품 ${getTotalItems()}건`}
                  customerEmail={customerInfo.email}
                  customerName={`${customerInfo.firstName} ${customerInfo.lastName}`}
                  onFail={handlePaymentFail}
                />
              </div>
            </div>

            {/* 주문 요약 */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-medium mb-4">주문 요약</h2>
                <div className="border border-black/15 p-6 space-y-4">
                  {/* 상품 목록 */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-600">
                            {item.color} / Size {item.size} / Qty {item.quantity}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {(parseFloat(item.price.replace('$', '')) * item.quantity).toLocaleString()}원
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 구분선 */}
                  <div className="border-t border-gray-200 pt-4"></div>

                  {/* 금액 정보 */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{subtotal.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? '무료' : `${shipping.toLocaleString()}원`}</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span>{total.toLocaleString()}원</span>
                    </div>
                  </div>

                  {/* 주문 정보 */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      <div>주문번호: {orderId}</div>
                      <div>상품 수량: {getTotalItems()}개</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 배송 안내 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">배송 안내</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 배송비: 무료 (5만원 이상 주문 시)</li>
                  <li>• 배송 기간: 1-2일 (영업일 기준)</li>
                  <li>• 배송 업체: CJ대한통운</li>
                  <li>• 배송 시작 시 SMS로 안내</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


