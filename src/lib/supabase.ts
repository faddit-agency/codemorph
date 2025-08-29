import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oqqnjojxisblyzmrlfsg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xcW5qb2p4aXNibHl6bXJsZnNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MjkzMzIsImV4cCI6MjA3MjAwNTMzMn0.DxQbd01QqdIhTPLNFIcWX-GMmuOJsYuFP5qUxFIoTj4';
export const supabase = createClient(supabaseUrl, supabaseKey);

// 데이터베이스 타입 정의
export interface User {
  id: string;
  email: string;
  phone: string;
  phone_verified: boolean;
  consumer_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id?: string;
  order_id: string;
  payment_key: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
}

export interface PhoneVerification {
  id: string;
  phone: string;
  code: string;
  verified: boolean;
  expires_at: string;
  created_at: string;
}
