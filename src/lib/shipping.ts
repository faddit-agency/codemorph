// CJ대한통운 배송 조회 API 유틸리티

export interface ShippingInfo {
  trackingNumber: string;
  status: string;
  estimatedDelivery: string;
  currentLocation: string;
  history: ShippingHistory[];
}

export interface ShippingHistory {
  date: string;
  time: string;
  location: string;
  status: string;
  description: string;
}

// 배송 상태 매핑
export const SHIPPING_STATUS = {
  PICKUP: "상품인수",
  IN_TRANSIT: "배송중",
  OUT_FOR_DELIVERY: "배송출발",
  DELIVERED: "배송완료",
  RETURN: "반송",
  EXCEPTION: "배송예외",
} as const;

// CJ대한통운 API 호출 함수
export async function getShippingInfo(trackingNumber: string): Promise<ShippingInfo> {
  try {
    // 실제 구현에서는 CJ대한통운 API를 호출합니다
    // 현재는 목업 데이터를 반환합니다
    
    // API 호출 예시:
    // const response = await fetch(`https://api.cjlogistics.com/tracking/${trackingNumber}`, {
    //   headers: {
    //     'Authorization': `Bearer ${process.env.CJ_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    // });
    
    // if (!response.ok) {
    //   throw new Error('배송 정보 조회 실패');
    // }
    
    // return await response.json();

    // 목업 데이터 반환
    return {
      trackingNumber,
      status: SHIPPING_STATUS.IN_TRANSIT,
      estimatedDelivery: "2024-01-15",
      currentLocation: "서울 강남구",
      history: [
        {
          date: "2024-01-13",
          time: "14:30",
          location: "서울 강남구",
          status: SHIPPING_STATUS.PICKUP,
          description: "상품이 인수되었습니다.",
        },
        {
          date: "2024-01-13",
          time: "18:45",
          location: "서울 강남구",
          status: SHIPPING_STATUS.IN_TRANSIT,
          description: "배송센터에서 출발했습니다.",
        },
        {
          date: "2024-01-14",
          time: "09:15",
          location: "서울 강남구",
          status: SHIPPING_STATUS.OUT_FOR_DELIVERY,
          description: "배송이 시작되었습니다.",
        },
      ],
    };
  } catch (error) {
    console.error("배송 정보 조회 실패:", error);
    throw new Error("배송 정보를 조회할 수 없습니다.");
  }
}

// 송장번호 생성 함수
export function generateTrackingNumber(): string {
  const prefix = "CJ";
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

// 배송 상태에 따른 색상 반환
export function getStatusColor(status: string): string {
  switch (status) {
    case SHIPPING_STATUS.PICKUP:
      return "text-blue-600";
    case SHIPPING_STATUS.IN_TRANSIT:
      return "text-yellow-600";
    case SHIPPING_STATUS.OUT_FOR_DELIVERY:
      return "text-orange-600";
    case SHIPPING_STATUS.DELIVERED:
      return "text-green-600";
    case SHIPPING_STATUS.RETURN:
      return "text-red-600";
    case SHIPPING_STATUS.EXCEPTION:
      return "text-red-600";
    default:
      return "text-gray-600";
  }
}

// 배송 상태에 따른 아이콘 반환
export function getStatusIcon(status: string): string {
  switch (status) {
    case SHIPPING_STATUS.PICKUP:
      return "📦";
    case SHIPPING_STATUS.IN_TRANSIT:
      return "🚚";
    case SHIPPING_STATUS.OUT_FOR_DELIVERY:
      return "🚛";
    case SHIPPING_STATUS.DELIVERED:
      return "✅";
    case SHIPPING_STATUS.RETURN:
      return "↩️";
    case SHIPPING_STATUS.EXCEPTION:
      return "⚠️";
    default:
      return "📋";
  }
}
