"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function PaymentFailContent() {
  const searchParams = useSearchParams();
  const [errorData, setErrorData] = useState<{
    code: string | null;
    message: string;
    orderId: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // URL 파라미터에서 에러 정보 추출
    const code = searchParams.get("code");
    const message = searchParams.get("message");
    const orderId = searchParams.get("orderId");

    if (code || message || orderId) {
      setErrorData({
        code,
        message: decodeURIComponent(message || ""),
        orderId,
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
          {/* 실패 아이콘 */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            결제에 실패했습니다
          </h1>
          <p className="text-gray-600 mb-8">
            결제 처리 중 문제가 발생했습니다.
          </p>

          {/* 에러 정보 */}
          {errorData && (
            <div className="bg-red-50 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-medium text-red-900 mb-4">
                오류 정보
              </h2>
              <div className="space-y-3 text-sm">
                {errorData.code && (
                  <div className="flex justify-between">
                    <span className="text-red-600">오류 코드</span>
                    <span className="font-medium">{errorData.code}</span>
                  </div>
                )}
                {errorData.message && (
                  <div className="text-left">
                    <span className="text-red-600 block mb-1">오류 메시지</span>
                    <span className="font-medium text-sm">
                      {errorData.message}
                    </span>
                  </div>
                )}
                {errorData.orderId && (
                  <div className="flex justify-between">
                    <span className="text-red-600">주문번호</span>
                    <span className="font-medium">{errorData.orderId}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 일반적인 실패 원인 안내 */}
          <div className="bg-yellow-50 rounded-lg p-4 mb-8">
            <h3 className="text-sm font-medium text-yellow-900 mb-2">
              일반적인 실패 원인
            </h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• 카드 잔액 부족</li>
              <li>• 카드 한도 초과</li>
              <li>• 잘못된 카드 정보</li>
              <li>• 네트워크 연결 문제</li>
            </ul>
          </div>

          {/* 버튼들 */}
          <div className="space-y-3">
            <Link
              href="/checkout"
              className="block w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              다시 시도하기
            </Link>
            <Link
              href="/cart"
              className="block w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              장바구니로 돌아가기
            </Link>
            <Link
              href="/"
              className="block w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-lg">로딩 중...</p>
        </div>
      </div>
    }>
      <PaymentFailContent />
    </Suspense>
  );
}
