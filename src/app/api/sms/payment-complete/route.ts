import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendPaymentCompleteSMS } from '@/lib/sms';

export async function POST(request: NextRequest) {
  try {
    const { orderId, phone, amount, customerName } = await request.json();

    if (!orderId || !phone || !amount) {
      return NextResponse.json(
        { error: '주문 정보가 필요합니다.' },
        { status: 400 }
      );
    }

    // 실제 SMS 발송
    const smsResult = await sendPaymentCompleteSMS(phone, orderId, amount, customerName || '고객');
    if (!smsResult) {
      throw new Error('SMS 발송에 실패했습니다.');
    }

    // 주문 상태 업데이트
    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('order_id', orderId);

    if (updateError) {
      console.error('주문 상태 업데이트 실패:', updateError);
    }

    return NextResponse.json({ 
      success: true, 
      message: '결제 완료 SMS가 발송되었습니다.' 
    });
  } catch (error) {
    console.error('결제 완료 SMS 발송 실패:', error);
    return NextResponse.json(
      { error: 'SMS 발송에 실패했습니다.' },
      { status: 500 }
    );
  }
}
