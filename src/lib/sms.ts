import crypto from 'crypto';

// 네이버 클라우드 플랫폼 SENS 서명 생성
function generateSignature(timestamp: string, method: string, url: string, accessKey: string, secretKey: string): string {
  const message = `${method} ${url}\n${timestamp}\n${accessKey}`;
  const signature = crypto.createHmac('sha256', secretKey).update(message).digest('base64');
  return signature;
}

// 실제 SMS 발송 함수
export async function sendSMS(phone: string, message: string): Promise<boolean> {
  try {
    const accessKey = process.env.NAVER_CLOUD_ACCESS_KEY;
    const secretKey = process.env.NAVER_CLOUD_SECRET_KEY;
    const serviceId = process.env.NAVER_CLOUD_SERVICE_ID;
    const senderNumber = process.env.SMS_SENDER_NUMBER;

    // 환경 변수가 설정되지 않은 경우 개발 모드로 처리
    if (!accessKey || !secretKey || !serviceId || !senderNumber) {
      console.log(`[개발 모드] SMS 발송: ${phone} - ${message}`);
      return true;
    }

    const timestamp = Date.now().toString();
    const method = 'POST';
    const url = `/sms/v2/services/${serviceId}/messages`;
    const signature = generateSignature(timestamp, method, url, accessKey, secretKey);

    const response = await fetch(`https://sens.apigw.ntruss.com${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-ncp-apigw-timestamp': timestamp,
        'x-ncp-iam-access-key': accessKey,
        'x-ncp-apigw-signature-v2': signature,
      },
      body: JSON.stringify({
        type: 'SMS',
        contentType: 'COMM',
        countryCode: '82',
        from: senderNumber,
        content: message,
        messages: [
          {
            to: phone.replace(/-/g, ''),
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('SMS 발송 실패:', errorData);
      return false;
    }

    console.log(`SMS 발송 성공: ${phone}`);
    return true;
  } catch (error) {
    console.error('SMS 발송 오류:', error);
    return false;
  }
}

// 인증 코드 SMS 발송
export async function sendVerificationSMS(phone: string, code: string): Promise<boolean> {
  const message = `[CODEMORPH] 인증번호: ${code} (5분간 유효)`;
  return await sendSMS(phone, message);
}

// 결제 완료 SMS 발송
export async function sendPaymentCompleteSMS(phone: string, orderId: string, amount: number, customerName: string): Promise<boolean> {
  const message = `[CODEMORPH] ${customerName}님, 결제가 완료되었습니다.\n주문번호: ${orderId}\n결제금액: ${amount.toLocaleString()}원\n\n배송 시작 시 별도로 안내드립니다.`;
  return await sendSMS(phone, message);
}

// 송장번호 SMS 발송
export async function sendTrackingSMS(phone: string, orderId: string, trackingNumber: string, customerName: string): Promise<boolean> {
  const message = `[CODEMORPH] ${customerName}님, 상품이 배송되었습니다.\n주문번호: ${orderId}\n송장번호: ${trackingNumber}\n\nCJ대한통운에서 배송 조회 가능합니다.`;
  return await sendSMS(phone, message);
}


