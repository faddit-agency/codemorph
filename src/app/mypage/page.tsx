"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Order } from "@/lib/supabase";
import Link from "next/link";

export default function MyPage() {
  const { user, logout, updateUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [isEditingId, setIsEditingId] = useState(false);
  const [newConsumerId, setNewConsumerId] = useState('');
  const [isUpdatingId, setIsUpdatingId] = useState(false);

  // 주문 내역 조회
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('customer_email', user.email)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error('주문 내역 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">로그인이 필요합니다</h1>
          <p className="text-gray-600 mb-6">마이페이지를 이용하려면 로그인해주세요.</p>
          <Link
            href="/"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const handleEditId = () => {
    setIsEditingId(true);
    setNewConsumerId(user?.consumer_id || '');
  };

  const handleCancelEditId = () => {
    setIsEditingId(false);
    setNewConsumerId('');
  };

  const handleSaveId = async () => {
    if (!user || !newConsumerId.trim()) return;
    
    // 현재 아이디와 같으면 변경하지 않음
    if (newConsumerId.trim() === user.consumer_id) {
      setIsEditingId(false);
      setNewConsumerId('');
      return;
    }
    
    setIsUpdatingId(true);
    try {
      // 아이디 중복 검사
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('consumer_id', newConsumerId.trim())
        .neq('id', user.id)
        .single();

      if (existingUser) {
        alert('이미 사용 중인 아이디입니다.');
        return;
      }

      await updateUser({ consumer_id: newConsumerId.trim() });
      setIsEditingId(false);
      setNewConsumerId('');
      alert('아이디가 성공적으로 변경되었습니다!');
    } catch (error) {
      console.error('아이디 변경 오류:', error);
      alert('아이디 변경에 실패했습니다.');
    } finally {
      setIsUpdatingId(false);
    }
  };



  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '결제완료';
      case 'pending': return '결제대기';
      case 'failed': return '결제실패';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">마이페이지</h1>
                  <p className="text-gray-600">{user.email}</p>
                  {user.consumer_id && (
                    <p className="text-sm text-blue-600 font-medium">아이디: {user.consumer_id}</p>
                  )}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                프로필
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                주문내역
              </button>
            </nav>
          </div>

          {/* 탭 컨텐츠 */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">프로필 정보</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      아이디
                    </label>
                    {isEditingId ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={newConsumerId}
                          onChange={(e) => setNewConsumerId(e.target.value)}
                          className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-black font-mono"
                          placeholder="새로운 아이디를 입력하세요"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSaveId}
                            disabled={isUpdatingId || !newConsumerId.trim()}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              isUpdatingId || !newConsumerId.trim()
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            {isUpdatingId ? '저장 중...' : '저장'}
                          </button>
                          <button
                            onClick={handleCancelEditId}
                            disabled={isUpdatingId}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors disabled:opacity-50"
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={user.consumer_id || '생성 중...'}
                          disabled
                          className="flex-1 border border-gray-300 px-3 py-2 rounded-lg bg-gray-50 text-gray-500 font-mono"
                        />
                        <button
                          onClick={handleEditId}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          수정
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      이메일
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      휴대폰 번호
                    </label>
                    <input
                      type="tel"
                      value={user.phone}
                      disabled
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-green-600">휴대폰 번호 인증 완료</span>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-6">주문내역</h2>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600">주문내역을 불러오는 중...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">주문내역이 없습니다.</p>
                    <Link
                      href="/"
                      className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      쇼핑하러 가기
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-medium text-gray-900">주문번호: {order.order_id}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(order.created_at).toLocaleString('ko-KR')}
                            </p>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">결제금액:</span>
                            <span className="ml-2 font-medium">{order.amount.toLocaleString()}원</span>
                          </div>
                          <div>
                            <span className="text-gray-600">고객명:</span>
                            <span className="ml-2">{order.customer_name}</span>
                          </div>
                          {order.tracking_number && (
                            <div>
                              <span className="text-gray-600">송장번호:</span>
                              <span className="ml-2">{order.tracking_number}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

