"use client";

import { useEffect, useState } from "react";

type LoginDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function LoginDialog({ open, onClose }: LoginDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 로그인 로직은 여기에 구현
    console.log("Login attempt:", { email, password });
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      
      {/* Login Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-black/10">
            <h2 className="text-lg font-medium">SIGN INTO YOUR ACCOUNT</h2>
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

          {/* Content */}
          <div className="flex-1 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-black/15 px-3 py-2 text-sm focus:outline-none focus:border-black"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-3 text-sm font-medium hover:bg-black/90 transition-colors"
              >
                SIGN IN
              </button>
            </form>

            <div className="mt-6 space-y-3 text-sm">
              <button className="text-black hover:underline underline-offset-2">
                Reset password
              </button>
              <div>
                <button className="text-black hover:underline underline-offset-2">
                  Register new account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
