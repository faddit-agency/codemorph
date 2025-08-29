import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationSMS } from '@/lib/sms';

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json();

    if (!phone || !code) {
      return NextResponse.json(
        { error: '휴대폰 번호와 인증 코드가 필요합니다.' },
        { status: 400 }
      );
    }

    // 실제 SMS 발송
    const smsResult = await sendVerificationSMS(phone, code);
    if (!smsResult) {
      throw new Error('SMS 발송에 실패했습니다.');
    }

    return NextResponse.json({ 
      success: true, 
      message: '인증 코드가 발송되었습니다.' 
    });
  } catch (error) {
    console.error('SMS 발송 실패:', error);
    return NextResponse.json(
      { error: 'SMS 발송에 실패했습니다.' },
      { status: 500 }
    );
  }
}
