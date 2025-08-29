import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendTrackingSMS } from '@/lib/sms';

export async function POST(request: NextRequest) {
  try {
    const { orderId, trackingNumber, phone, customerName } = await request.json();

    if (!orderId || !trackingNumber || !phone) {
      return NextResponse.json(
        { error: '주문 정보와 송장번호가 필요합니다.' },
        { status: 400 }
      );
    }

    // 실제 SMS 발송
    const smsResult = await sendTrackingSMS(phone, orderId, trackingNumber, customerName || '고객');
    if (!smsResult) {
      throw new Error('SMS 발송에 실패했습니다.');
    }

    // 주문에 송장번호 업데이트
    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        tracking_number: trackingNumber,
        updated_at: new Date().toISOString()
      })
      .eq('order_id', orderId);

    if (updateError) {
      console.error('송장번호 업데이트 실패:', updateError);
      return NextResponse.json(
        { error: '송장번호 업데이트에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: '송장번호 SMS가 발송되었습니다.' 
    });
  } catch (error) {
    console.error('송장번호 SMS 발송 실패:', error);
    return NextResponse.json(
      { error: 'SMS 발송에 실패했습니다.' },
      { status: 500 }
    );
  }
}
