"use client";

import { useState } from "react";
import { 
  getShippingInfo, 
  getStatusColor, 
  getStatusIcon, 
  type ShippingInfo 
} from "@/lib/shipping";

export default function ShippingTracker() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    if (!trackingNumber.trim()) {
      setError("송장번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const info = await getShippingInfo(trackingNumber);
      setShippingInfo(info);
    } catch {
      setError("배송 정보를 조회할 수 없습니다.");
      setShippingInfo(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">배송 조회</h2>
      
      {/* 송장번호 입력 */}
      <div className="mb-8">
        <div className="flex gap-3">
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="송장번호를 입력하세요"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-black"
            onKeyPress={(e) => e.key === "Enter" && handleTrack()}
          />
          <button
            onClick={handleTrack}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {loading ? "조회 중..." : "조회하기"}
          </button>
        </div>
        {error && (
          <p className="text-red-600 text-sm mt-2">{error}</p>
        )}
      </div>

      {/* 배송 정보 표시 */}
      {shippingInfo && (
        <div className="space-y-6">
          {/* 배송 요약 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">배송 정보</h3>
              <span className="text-sm text-gray-500">
                송장번호: {shippingInfo.trackingNumber}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">현재 상태</div>
                <div className={`font-medium ${getStatusColor(shippingInfo.status)}`}>
                  {getStatusIcon(shippingInfo.status)} {shippingInfo.status}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">현재 위치</div>
                <div className="font-medium">{shippingInfo.currentLocation}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">예상 배송일</div>
                <div className="font-medium">{shippingInfo.estimatedDelivery}</div>
              </div>
            </div>
          </div>

          {/* 배송 이력 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">배송 이력</h3>
            <div className="space-y-4">
              {shippingInfo.history.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                    {index < shippingInfo.history.length - 1 && (
                      <div className="w-0.5 h-8 bg-gray-200 mx-auto mt-1"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className={`font-medium ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)} {item.status}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.date} {item.time}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      {item.location}
                    </div>
                    <div className="text-sm text-gray-700">
                      {item.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CJ대한통운 로고 */}
          <div className="text-center py-4">
            <div className="text-sm text-gray-500">
              배송 제공: CJ대한통운
            </div>
          </div>
        </div>
      )}

      {/* 배송 조회 안내 */}
      {!shippingInfo && !loading && (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <div className="text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="font-medium mb-2">배송 조회</h3>
          <p className="text-sm text-gray-600">
            송장번호를 입력하여 배송 현황을 확인하세요.
          </p>
        </div>
      )}
    </div>
  );
}
