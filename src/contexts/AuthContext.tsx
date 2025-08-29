"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    consumerId?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 랜덤 소비자 아이디 생성
  const generateConsumerId = () => {
    const randomNum = Math.floor(Math.random() * 1000000);
    return `C${randomNum.toString().padStart(6, '0')}`;
  };

  // 초기 사용자 상태 확인
  useEffect(() => {
    const checkUser = async () => {
      try {
        // 로컬 스토리지에서 사용자 정보 확인
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('사용자 상태 확인 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // 로그인
  const login = async (email: string, password: string) => {
    try {
      // 실제 구현에서는 Supabase Auth를 사용
      // 여기서는 간단한 시뮬레이션 (비밀번호 검증 없이 이메일만 확인)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !data) {
        return { success: false, error: '이메일 또는 비밀번호가 올바르지 않습니다.' };
      }

      // 실제로는 비밀번호 해시 검증을 해야 함
      // 현재는 이메일만 확인하고 로그인 허용
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      
      return { success: true };
    } catch (error) {
      console.error('로그인 실패:', error);
      return { success: false, error: '로그인에 실패했습니다.' };
    }
  };

  // 회원가입
  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    consumerId?: string;
  }) => {
    try {
      // 사용자가 입력한 아이디가 있으면 사용, 없으면 자동 생성
      const consumerId = userData.consumerId || generateConsumerId();
      
      // 아이디 중복 검사 (사용자가 입력한 경우에만)
      if (userData.consumerId) {
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('consumer_id', userData.consumerId)
          .single();

        if (existingUser) {
          return { success: false, error: '이미 사용 중인 아이디입니다.' };
        }
      }
      
      // 실제 구현에서는 Supabase Auth를 사용
      const { data, error } = await supabase
        .from('users')
        .insert({
          email: userData.email,
          phone: userData.phone,
          phone_verified: true, // 인증 완료된 상태로 가정
          consumer_id: consumerId
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          return { success: false, error: '이미 가입된 이메일입니다.' };
        }
        return { success: false, error: '회원가입에 실패했습니다.' };
      }

      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      
      return { success: true };
    } catch (error) {
      console.error('회원가입 실패:', error);
      return { success: false, error: '회원가입에 실패했습니다.' };
    }
  };

  // 로그아웃
  const logout = async () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // 사용자 정보 업데이트
  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('사용자 정보 업데이트 실패:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

