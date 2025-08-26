"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type RegisterDialogProps = {
  open: boolean;
  onClose: () => void;
  onOpenLogin?: () => void;
};

export default function RegisterDialog({ open, onClose, onOpenLogin }: RegisterDialogProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    newsletter: false,
    terms: false,
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 회원가입 로직은 여기에 구현
    console.log("Register attempt:", formData);
    onClose();
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
                className="w-full bg-black text-white py-3 text-sm font-medium hover:bg-black/90 transition-colors mt-6"
              >
                REGISTER
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
