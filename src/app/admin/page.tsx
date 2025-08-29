"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Order } from '@/lib/supabase';

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [sendingSMS, setSendingSMS] = useState(false);

  // 주문 목록 조회
  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('주문 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 송장번호 SMS 발송
  const sendTrackingSMS = async (order: Order) => {
    if (!trackingNumber.trim()) {
      alert('송장번호를 입력해주세요.');
      return;
    }

    setSendingSMS(true);
    try {
      const response = await fetch('/api/sms/tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.order_id,
          trackingNumber: trackingNumber.trim(),
          phone: order.customer_phone,
          customerName: order.customer_name,
        }),
      });

      if (response.ok) {
        alert('송장번호 SMS가 발송되었습니다.');
        setTrackingNumber('');
        setSelectedOrder(null);
        fetchOrders(); // 주문 목록 새로고침
      } else {
        const error = await response.json();
        alert(`SMS 발송 실패: ${error.error}`);
      }
    } catch (error) {
      console.error('송장번호 SMS 발송 실패:', error);
      alert('SMS 발송에 실패했습니다.');
    } finally {
      setSendingSMS(false);
    }
  };

  // 주문 상태별 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // 주문 상태 텍스트
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '결제완료';
      case 'pending': return '결제대기';
      case 'failed': return '결제실패';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-lg">주문 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">관리자 페이지</h1>
            <p className="text-gray-600 mt-1">주문 관리 및 SMS 발송</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    주문번호
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    고객정보
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    결제금액
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    송장번호
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    주문일시
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.order_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{order.customer_name}</div>
                        <div className="text-gray-500">{order.customer_email}</div>
                        <div className="text-gray-500">{order.customer_phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.amount.toLocaleString()}원
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.tracking_number || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleString('ko-KR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {order.status === 'completed' && !order.tracking_number && (
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          송장번호 입력
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">주문 내역이 없습니다.</p>
            </div>
          )}
        </div>

        {/* 송장번호 입력 모달 */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  송장번호 입력
                </h3>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    주문번호: {selectedOrder.order_id}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    고객: {selectedOrder.customer_name} ({selectedOrder.customer_phone})
                  </p>
                </div>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="송장번호를 입력하세요"
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-black mb-4"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => sendTrackingSMS(selectedOrder)}
                    disabled={sendingSMS || !trackingNumber.trim()}
                    className="flex-1 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {sendingSMS ? '발송 중...' : 'SMS 발송'}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedOrder(null);
                      setTrackingNumber('');
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
