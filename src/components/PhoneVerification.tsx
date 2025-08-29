"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { sendVerificationSMS } from '@/lib/sms';

interface PhoneVerificationProps {
  onVerified: (phone: string) => void;
  initialPhone?: string;
  isRequired?: boolean;
}

export default function PhoneVerification({ 
  onVerified, 
  initialPhone = '', 
  isRequired = true 
}: PhoneVerificationProps) {
  const [phone, setPhone] = useState(initialPhone);
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  // 카운트다운 타이머
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 휴대폰 번호 유효성 검사
  const validatePhone = (phoneNumber: string) => {
    const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
    return phoneRegex.test(phoneNumber.replace(/\s/g, ''));
  };

  // 인증 코드 발송
  const sendVerificationCode = async () => {
    if (!validatePhone(phone)) {
      setError('올바른 휴대폰 번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 6자리 랜덤 코드 생성
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Supabase에 인증 코드 저장
      const { error: dbError } = await supabase
        .from('phone_verifications')
        .insert({
          phone: phone.replace(/\s/g, ''),
          code,
          verified: false,
          expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5분 후 만료
        });

      if (dbError) {
        console.error('Supabase 저장 오류:', dbError);
        if (dbError.code === 'PGRST116') {
          throw new Error('데이터베이스 테이블이 존재하지 않습니다. 관리자에게 문의하세요.');
        }
        throw dbError;
      }

      // 실제 SMS 발송
      const smsResult = await sendVerificationSMS(phone, code);
      if (!smsResult) {
        throw new Error('SMS 발송에 실패했습니다.');
      }

      setIsCodeSent(true);
      setCountdown(180); // 3분 카운트다운
    } catch (error) {
      console.error('인증 코드 발송 실패:', error);
      setError('인증 코드 발송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 인증 코드 확인
  const verifyCode = async () => {
    if (!verificationCode) {
      setError('인증 코드를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Supabase에서 인증 코드 확인
      const { data, error: dbError } = await supabase
        .from('phone_verifications')
        .select('*')
        .eq('phone', phone.replace(/\s/g, ''))
        .eq('code', verificationCode)
        .eq('verified', false)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (dbError) {
        console.error('Supabase 조회 오류:', dbError);
        if (dbError.code === 'PGRST116') {
          setError('데이터베이스 테이블이 존재하지 않습니다. 관리자에게 문의하세요.');
        } else {
          setError('인증 코드 확인에 실패했습니다.');
        }
        return;
      }

      if (!data) {
        setError('인증 코드가 올바르지 않거나 만료되었습니다.');
        return;
      }

      // 인증 완료 처리
      await supabase
        .from('phone_verifications')
        .update({ verified: true })
        .eq('id', data.id);

      setIsVerified(true);
      onVerified(phone);
    } catch (error) {
      console.error('인증 코드 확인 실패:', error);
      setError('인증 코드 확인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 인증 코드 재발송
  const resendCode = () => {
    setIsCodeSent(false);
    setVerificationCode('');
    setError('');
    sendVerificationCode();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          휴대폰 번호 {isRequired && '*'}
        </label>
        <div className="flex gap-2">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="010-1234-5678"
            className="flex-1 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-black"
            disabled={isVerified}
          />
          {!isVerified && (
            <button
              onClick={sendVerificationCode}
              disabled={loading || countdown > 0 || !phone}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? '발송 중...' : countdown > 0 ? `${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')}` : '인증번호 발송'}
            </button>
          )}
        </div>
        {isVerified && (
          <div className="mt-2 text-sm text-green-600">
            ✓ 휴대폰 번호 인증 완료
          </div>
        )}
      </div>

      {isCodeSent && !isVerified && (
        <div>
          <label className="block text-sm font-medium mb-2">인증 코드</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="6자리 코드 입력"
              maxLength={6}
              className="flex-1 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-black"
            />
            <button
              onClick={verifyCode}
              disabled={loading || !verificationCode}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? '확인 중...' : '확인'}
            </button>
          </div>
          <div className="mt-2 flex gap-2">
            <button
              onClick={resendCode}
              disabled={countdown > 0}
              className="text-sm text-blue-600 hover:underline disabled:text-gray-400"
            >
              인증번호 재발송
            </button>
            {countdown > 0 && (
              <span className="text-sm text-gray-500">
                {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')} 후 재발송 가능
              </span>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}
