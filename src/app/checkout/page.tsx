"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import dynamic from "next/dynamic";
import PhoneVerification from "@/components/PhoneVerification";

const TossPayment = dynamic(() => import("@/components/TossPayment"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-sm text-gray-600">결제 시스템을 불러오는 중...</p>
      </div>
    </div>
  ),
});

export default function CheckoutPage() {
  const { items, getTotalItems } = useCart();
  const { user } = useAuth();
  const [customerInfo, setCustomerInfo] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
  });


  // 로그인한 사용자 정보로 폼 초기화
  useEffect(() => {
    if (user) {
      setCustomerInfo(prev => ({
        ...prev,
        email: user.email,
        phone: user.phone,
      }));

    }
  }, [user]);

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

  const handlePhoneVerified = (phone: string) => {
    setCustomerInfo(prev => ({ ...prev, phone }));
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

                  {/* 휴대폰 번호 인증 */}
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">휴대폰 번호 인증</h3>
                    {user && user.phone_verified ? (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-green-800">
                            인증된 휴대폰 번호: {user.phone}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <PhoneVerification
                        onVerified={handlePhoneVerified}
                        initialPhone={user?.phone || ""}
                        isRequired={true}
                      />
                    )}
                  </div>
                </form>
              </div>

              {/* 결제 위젯 */}
              <div>
                <h2 className="text-xl font-medium mb-4">결제</h2>
                <Suspense fallback={
                  <div className="flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                      <p className="text-sm text-gray-600">결제 시스템을 불러오는 중...</p>
                    </div>
                  </div>
                }>
                                    <TossPayment
                    amount={total}
                    orderId={orderId}
                    orderName={`CODEMORPH 상품 ${getTotalItems()}건`}
                    customerEmail={customerInfo.email}
                    customerName={`${customerInfo.firstName} ${customerInfo.lastName}`}
                    customerPhone={customerInfo.phone}
                    onSuccess={(paymentData) => {
                      console.log("결제 성공:", paymentData);
                      // 여기서 결제 승인 API를 호출하거나 성공 페이지로 이동
                      window.location.href = `http://localhost:3000/success?paymentKey=${paymentData.paymentKey}&orderId=${paymentData.orderId}&amount=${paymentData.amount.value}`;
                    }}
                    onFail={handlePaymentFail}
                  />
                </Suspense>
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


            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


