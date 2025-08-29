# CODEMORPH

A minimalist e-commerce website inspired by Our Legacy, built with Next.js 15 and Tailwind CSS.

## Features

- **Scroll-based animations** for homepage sections
- **Product catalog** with category filtering
- **Shopping cart** with sidebar
- **User authentication** (Login/Register UI)
- **Product details** with size and color selection
- **TossPayments V2 SDK integration** with payment widgets
- **Responsive design** optimized for all devices
- **Modern UI** with clean typography and layout

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- React Context for state management
- Next/Image for optimized images

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/src/app` - Next.js App Router pages
- `/src/app/api` - API routes for payment processing
- `/src/components` - Reusable React components
- `/src/contexts` - React Context providers
- `/src/lib` - Utility functions and data
- `/public` - Static assets

## Payment Integration

This project integrates TossPayments V2 SDK with payment widgets and SMS functionality:

### Features
- **Payment Widget**: Embedded payment method selection UI
- **Agreement Widget**: Terms and conditions agreement
- **Payment Confirmation**: Server-side payment approval API
- **Phone Verification**: SMS-based phone number verification
- **SMS Notifications**: Payment completion and tracking number SMS
- **Admin Panel**: Order management and SMS sending interface
- **Error Handling**: Comprehensive error handling for payment failures

### Database Setup (Supabase)

1. **Supabase 프로젝트 생성**:
   - [Supabase](https://supabase.com/)에서 새 프로젝트 생성
   - 프로젝트 URL과 anon key 복사

2. **데이터베이스 테이블 생성**:
   ```sql
   -- 사용자 테이블
   CREATE TABLE users (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     phone TEXT NOT NULL,
     phone_verified BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- 주문 테이블
   CREATE TABLE orders (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id),
     order_id TEXT UNIQUE NOT NULL,
     payment_key TEXT NOT NULL,
     amount INTEGER NOT NULL,
     status TEXT DEFAULT 'pending',
     customer_email TEXT NOT NULL,
     customer_name TEXT NOT NULL,
     customer_phone TEXT NOT NULL,
     tracking_number TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- 휴대폰 인증 테이블
   CREATE TABLE phone_verifications (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     phone TEXT NOT NULL,
     code TEXT NOT NULL,
     verified BOOLEAN DEFAULT FALSE,
     expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

### Setup
1. **환경 변수 설정**:
   - `env.example` 파일을 `.env.local`로 복사
   - Supabase URL과 anon key 설정
   - 토스페이먼츠 키 설정
   - SMS 발송을 위한 API 키 설정 (선택사항)

2. **토스페이먼츠 설정**:
   - [토스페이먼츠 개발자 센터](https://developers.tosspayments.com/)에서 키 발급
   - 결제위젯 연동 키와 시크릿 키 설정

3. **SMS 발송 설정** (선택사항):
   - 네이버 클라우드 플랫폼 SENS 또는 다른 SMS 서비스 설정
   - 발신번호 등록 및 API 키 설정

4. **URL 설정**:
   - 토스페이먼츠 대시보드에서 성공/실패 URL 설정
   - 현재 설정: `http://localhost:3000/success`, `http://localhost:3000/fail`

### Usage
The payment flow:
1. User selects payment method in the embedded widget
2. User agrees to terms and conditions
3. Payment is processed through TossPayments
4. Payment is confirmed via server-side API
5. User is redirected to success/fail page

## Demo

Visit the live demo: [CODEMORPH](https://codemorph.vercel.app)

