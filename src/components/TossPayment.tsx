"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    TossPayments: {
      (clientKey: string): {
        widgets: (options: { customerKey: string }) => {
          setAmount: (amount: { currency: string; value: number }) => Promise<void>;
          renderPaymentMethods: (options: { selector: string; variantKey: string }) => Promise<unknown>;
          renderAgreement: (options: { selector: string; variantKey: string }) => Promise<unknown>;
          requestPayment: (options: {
            orderId: string;
            orderName: string;
            successUrl: string;
            failUrl: string;
            customerEmail: string;
            customerName: string;
          }) => Promise<void>;
        };
      };
      ANONYMOUS: string;
    };
  }
}

type TossPaymentProps = {
  amount: number;
  orderId: string;
  orderName: string;
  customerEmail: string;
  customerName: string;
  onSuccess: (paymentData: unknown) => void;
  onFail: (error: unknown) => void;
};

export default function TossPayment({
  amount,
  orderId,
  orderName,
  customerEmail,
  customerName,
  onFail,
}: Omit<TossPaymentProps, 'onSuccess'>) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPaymentReady, setIsPaymentReady] = useState(false);
  const paymentWidgetRef = useRef<{
    setAmount: (amount: { currency: string; value: number }) => Promise<void>;
    renderPaymentMethods: (options: { selector: string; variantKey: string }) => Promise<unknown>;
    renderAgreement: (options: { selector: string; variantKey: string }) => Promise<unknown>;
    requestPayment: (options: {
      orderId: string;
      orderName: string;
      successUrl: string;
      failUrl: string;
      customerEmail: string;
      customerName: string;
    }) => Promise<void>;
  } | null>(null);
  const paymentMethodsWidgetRef = useRef<unknown>(null);
  const agreementWidgetRef = useRef<unknown>(null);

  // 토스페이먼츠 SDK 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.tosspayments.com/v2/standard";
    script.async = true;
    script.onload = () => {
      setIsLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // 결제 위젯 초기화
  useEffect(() => {
    if (!isLoaded || !window.TossPayments) return;

    const clientKey = "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq"; // 테스트 키

    try {
      const tossPayments = window.TossPayments(clientKey);
      
      // 비회원 결제용 위젯 생성
      const widgets = tossPayments.widgets({
        customerKey: window.TossPayments.ANONYMOUS,
      });

      paymentWidgetRef.current = widgets;

      // 결제 금액 설정
      widgets.setAmount({
        currency: "KRW",
        value: amount,
      });

      // 결제 수단 UI 렌더링
      widgets
        .renderPaymentMethods({
          selector: "#payment-method",
          variantKey: "DEFAULT",
        })
        .then((paymentMethodsWidget: unknown) => {
          paymentMethodsWidgetRef.current = paymentMethodsWidget;
        });

      // 이용약관 UI 렌더링
      widgets
        .renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        })
        .then((agreementWidget: unknown) => {
          agreementWidgetRef.current = agreementWidget;
          setIsPaymentReady(true);
        });
    } catch (error) {
      console.error("토스페이먼츠 초기화 실패:", error);
      onFail(error);
    }
  }, [isLoaded, amount, onFail]);

  const handlePayment = async () => {
    if (!paymentWidgetRef.current || !isPaymentReady) {
      alert("결제 준비가 완료되지 않았습니다.");
      return;
    }

    try {
      await paymentWidgetRef.current.requestPayment({
        orderId,
        orderName,
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
        customerEmail,
        customerName,
      });
    } catch (error) {
      console.error("결제 요청 실패:", error);
      onFail(error);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">결제 시스템을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 결제 수단 선택 */}
      <div>
        <h3 className="text-lg font-medium mb-4">결제 수단</h3>
        <div id="payment-method" className="border border-gray-200 rounded-lg p-4"></div>
      </div>

      {/* 이용약관 */}
      <div>
        <h3 className="text-lg font-medium mb-4">이용약관</h3>
        <div id="agreement" className="border border-gray-200 rounded-lg p-4"></div>
      </div>

      {/* 결제 버튼 */}
      <button
        onClick={handlePayment}
        disabled={!isPaymentReady}
        className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
          isPaymentReady
            ? "bg-black text-white hover:bg-gray-800"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {isPaymentReady ? "결제하기" : "결제 준비 중..."}
      </button>

      {/* 결제 금액 정보 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">결제 금액</span>
          <span className="text-lg font-medium">
            {amount.toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
}
