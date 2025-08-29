"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    TossPayments: {
      (clientKey: string): {
        widgets: (options: { customerKey: string }) => {
          setAmount: (amount: { currency: string; value: number }) => Promise<void>;
          renderPaymentMethods: (options: { selector: string }) => Promise<{
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
          on: (event: string, callback: (data: any) => void) => void;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          getSelectedPaymentMethod: () => Promise<any>;
            destroy: () => Promise<void>;
          }>;
          requestPayment: (options: {
            orderId: string;
            orderName: string;
            customerEmail: string;
            customerName: string;
            successUrl?: string;
            failUrl?: string;
          }) => Promise<{
            paymentType: string;
            paymentKey: string;
            orderId: string;
            amount: { value: number; currency: string };
          }>;
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
  customerPhone?: string;
  onSuccess?: (paymentData: {
    paymentType: string;
    paymentKey: string;
    orderId: string;
    amount: { value: number; currency: string };
  }) => void;
  onFail: (error: unknown) => void;
};

export default function TossPayment({
  amount,
  orderId,
  orderName,
  customerEmail,
  customerName,
  customerPhone,
  onSuccess,
  onFail,
}: TossPaymentProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPaymentReady, setIsPaymentReady] = useState(false);
  const [isAgreementReady, setIsAgreementReady] = useState(false);
  const [canPay, setCanPay] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const widgetsRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paymentMethodWidgetRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const agreementWidgetRef = useRef<any>(null);

  // 고유한 customerKey 생성 (실제로는 사용자 ID나 세션 ID를 사용해야 함)
  const customerKey = `CUSTOMER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // 토스페이먼츠 SDK 로드
  useEffect(() => {
    // 이미 로드된 경우 스킵
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== 'undefined' && (window as any).TossPayments) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.tosspayments.com/v2/standard";
    script.async = true;
    script.onload = () => {
      setIsLoaded(true);
    };
    script.onerror = () => {
      console.error("토스페이먼츠 SDK 로드 실패");
      onFail(new Error("토스페이먼츠 SDK 로드 실패"));
    };
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://js.tosspayments.com/v2/standard"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [onFail]);

  // 결제위젯 초기화
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!isLoaded || !(window as any).TossPayments) return;

    const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm"; // 결제위젯 연동 테스트 키 (Widget Client Key)

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tossPayments = (window as any).TossPayments(clientKey);
      
      // 결제위젯 초기화
      const widgets = tossPayments.widgets({
        customerKey: customerKey,
      });

      widgetsRef.current = widgets;
      setIsPaymentReady(true);
    } catch (error) {
      console.error("토스페이먼츠 초기화 실패:", error);
      onFail(error);
    }
  }, [isLoaded, customerKey, onFail]);

  // 결제 금액 설정
  useEffect(() => {
    if (!widgetsRef.current || !isPaymentReady) return;

    const setAmount = async () => {
      try {
        await widgetsRef.current.setAmount({
          currency: "KRW",
          value: amount,
        });
      } catch (error) {
        console.error("결제 금액 설정 실패:", error);
        onFail(error);
      }
    };

    setAmount();
  }, [amount, isPaymentReady, onFail]);

  // 결제 수단 UI 렌더링
  useEffect(() => {
    if (!widgetsRef.current || !isPaymentReady) return;

    const renderPaymentMethods = async () => {
      try {
        // 기존 위젯이 있다면 제거
        if (paymentMethodWidgetRef.current) {
          await paymentMethodWidgetRef.current.destroy();
        }

        const paymentMethodWidget = await widgetsRef.current.renderPaymentMethods({
          selector: "#payment-method-widget",
        });

        paymentMethodWidgetRef.current = paymentMethodWidget;

        // 결제 수단 선택 이벤트 리스너
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        paymentMethodWidget.on("paymentMethodSelect", (selectedPaymentMethod: any) => {
          console.log("선택된 결제 수단:", selectedPaymentMethod);
          setSelectedPaymentMethod(selectedPaymentMethod);
        });
      } catch (error) {
        console.error("결제 수단 UI 렌더링 실패:", error);
        onFail(error);
      }
    };

    renderPaymentMethods();
  }, [isPaymentReady, onFail]);

  // 약관 UI 렌더링
  useEffect(() => {
    if (!widgetsRef.current || !isPaymentReady) return;

    const renderAgreement = async () => {
      try {
        // 기존 위젯이 있다면 제거
        if (agreementWidgetRef.current) {
          await agreementWidgetRef.current.destroy();
        }

        const agreementWidget = await widgetsRef.current.renderAgreement({
          selector: "#agreement-widget",
        });

        agreementWidgetRef.current = agreementWidget;

        // 약관 동의 상태 변경 이벤트 리스너
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        agreementWidget.on("agreementStatusChange", (agreementStatus: any) => {
          console.log("약관 동의 상태:", agreementStatus);
          setCanPay(agreementStatus.agreedRequiredTerms && selectedPaymentMethod !== null);
        });

        setIsAgreementReady(true);
      } catch (error) {
        console.error("약관 UI 렌더링 실패:", error);
        onFail(error);
      }
    };

    renderAgreement();
  }, [isPaymentReady, onFail, selectedPaymentMethod]);

  const handlePayment = async () => {
    if (!widgetsRef.current || !isPaymentReady) {
      alert("결제 준비가 완료되지 않았습니다.");
      return;
    }

    if (!selectedPaymentMethod) {
      alert("결제 수단을 선택해주세요.");
      return;
    }

    if (!canPay) {
      alert("약관에 동의해주세요.");
      return;
    }

    try {
      const result = await widgetsRef.current.requestPayment({
        orderId,
        orderName,
        customerEmail,
        customerName,
        customerMobilePhone: customerPhone,
        successUrl: `http://localhost:3000/success`,
        failUrl: `http://localhost:3000/fail`,
      });

      console.log("결제 요청 성공:", result);
      
      if (onSuccess) {
        onSuccess(result);
      }
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
      {/* 결제 수단 선택 위젯 */}
      <div>
        <h4 className="text-md font-medium mb-3">결제 수단 선택</h4>
        <div id="payment-method-widget" className="min-h-[200px] border border-gray-200 rounded-lg p-4">
          {!isPaymentReady && (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black mr-2"></div>
              <span className="text-sm text-gray-600">결제 수단을 불러오는 중...</span>
            </div>
          )}
        </div>
        {selectedPaymentMethod && (
          <div className="mt-2 text-sm text-green-600">
            ✓ 선택된 결제 수단: {selectedPaymentMethod.name || selectedPaymentMethod.code}
          </div>
        )}
      </div>

      {/* 약관 동의 위젯 */}
      <div>
        <h4 className="text-md font-medium mb-3">약관 동의</h4>
        <div id="agreement-widget" className="min-h-[100px] border border-gray-200 rounded-lg p-4">
          {!isAgreementReady && (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black mr-2"></div>
              <span className="text-sm text-gray-600">약관을 불러오는 중...</span>
            </div>
          )}
        </div>
      </div>

      {/* 결제 버튼 */}
      <button
        onClick={handlePayment}
        disabled={!isPaymentReady || !selectedPaymentMethod || !canPay}
        className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
          isPaymentReady && selectedPaymentMethod && canPay
            ? "bg-black text-white hover:bg-gray-800"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {!isPaymentReady 
          ? "결제 준비 중..." 
          : !selectedPaymentMethod
            ? "결제 수단을 선택해주세요"
            : !canPay 
              ? "약관에 동의해주세요" 
              : "결제하기"
        }
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
