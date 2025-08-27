"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<{
    paymentKey: string;
    orderId: string;
    amount: number;
    status: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // URL 파라미터에서 결제 정보 추출
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    if (paymentKey && orderId && amount) {
      // 실제 구현에서는 서버에 결제 승인 요청을 보내야 합니다
      setPaymentData({
        paymentKey,
        orderId,
        amount: parseInt(amount),
        status: "DONE",
      });
    }
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-lg">결제 정보를 확인하는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          {/* 성공 아이콘 */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            결제가 완료되었습니다
          </h1>
          <p className="text-gray-600 mb-8">
            주문이 성공적으로 처리되었습니다.
          </p>

          {/* 결제 정보 */}
          {paymentData && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                결제 정보
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">주문번호</span>
                  <span className="font-medium">{paymentData.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">결제금액</span>
                  <span className="font-medium">
                    {paymentData.amount.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">결제상태</span>
                  <span className="font-medium text-green-600">
                    {paymentData.status === "DONE" ? "완료" : paymentData.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 배송 정보 안내 */}
          <div className="bg-blue-50 rounded-lg p-4 mb-8">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              배송 안내
            </h3>
            <p className="text-sm text-blue-700">
              주문하신 상품은 1-2일 내에 배송 준비가 완료되며, 
              배송 시작 시 SMS로 안내드립니다.
            </p>
          </div>

          {/* 버튼들 */}
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              홈으로 돌아가기
            </Link>
            <Link
              href="/cart"
              className="block w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              쇼핑 계속하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-lg">로딩 중...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
