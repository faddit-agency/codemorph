"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PhoneVerification from "./PhoneVerification";
import { useAuth } from "@/contexts/AuthContext";

type RegisterDialogProps = {
  open: boolean;
  onClose: () => void;
  onOpenLogin?: () => void;
};

export default function RegisterDialog({ open, onClose, onOpenLogin }: RegisterDialogProps) {
  const { register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    consumerId: "",
    newsletter: false,
    terms: false,
  });
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhoneVerified = (phone: string) => {
    setFormData(prev => ({ ...prev, phone }));
    setIsPhoneVerified(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPhoneVerified) {
      alert("휴대폰 번호 인증을 완료해주세요.");
      return;
    }

    if (!formData.consumerId.trim()) {
      alert("아이디를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        consumerId: formData.consumerId.trim(),
      });

      if (result.success) {
        alert("회원가입이 완료되었습니다!");
        onClose();
      } else {
        alert(result.error || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      
      {/* Register Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-black/10">
            <h2 className="text-lg font-medium">REGISTER ACCOUNT</h2>
            <button
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center hover:bg-black/5 rounded"
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path 
                  d="M12 4L4 12M4 4L12 12" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                  First name *
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="w-full border border-black/15 px-3 py-2 text-sm focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                  Last name *
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="w-full border border-black/15 px-3 py-2 text-sm focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full border border-black/15 px-3 py-2 text-sm focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password *
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="w-full border border-black/15 px-3 py-2 text-sm focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div>
                <label htmlFor="consumerId" className="block text-sm font-medium mb-2">
                  아이디 *
                </label>
                <input
                  id="consumerId"
                  type="text"
                  value={formData.consumerId}
                  onChange={(e) => handleInputChange("consumerId", e.target.value)}
                  className="w-full border border-black/15 px-3 py-2 text-sm focus:outline-none focus:border-black font-mono"
                  placeholder="원하는 아이디를 입력하세요"
                  required
                />
              </div>

              {/* 휴대폰 번호 인증 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  휴대폰 번호 *
                </label>
                <PhoneVerification
                  onVerified={handlePhoneVerified}
                  isRequired={true}
                />
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.newsletter}
                    onChange={(e) => handleInputChange("newsletter", e.target.checked)}
                    className="mt-1 w-4 h-4 border border-black/15 focus:ring-0 focus:border-black"
                  />
                  <span className="text-sm">
                    Yes, I want to receive Our Legacy&apos;s newsletters.
                  </span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.terms}
                    onChange={(e) => handleInputChange("terms", e.target.checked)}
                    className="mt-1 w-4 h-4 border border-black/15 focus:ring-0 focus:border-black"
                    required
                  />
                  <span className="text-sm">
                    I accept the{" "}
                    <Link href="/terms" className="underline hover:no-underline">
                      terms & conditions
                    </Link>{" "}
                    and I have read and understood the{" "}
                    <Link href="/privacy" className="underline hover:no-underline">
                      privacy policy
                    </Link>
                    .
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={!isPhoneVerified || isSubmitting}
                className={`w-full py-3 text-sm font-medium transition-colors mt-6 ${
                  isPhoneVerified && !isSubmitting
                    ? "bg-black text-white hover:bg-black/90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? "처리 중..." : isPhoneVerified ? "REGISTER" : "휴대폰 인증을 완료해주세요"}
              </button>
            </form>

            <div className="mt-6 space-y-3 text-sm">
              <button 
                className="text-black hover:underline underline-offset-2"
                onClick={() => {
                  onClose();
                  onOpenLogin?.();
                }}
              >
                Sign in
              </button>
              <div>
                <button className="text-black hover:underline underline-offset-2">
                  Reset password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
