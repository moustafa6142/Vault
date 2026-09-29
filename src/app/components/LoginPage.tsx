import { useState, useEffect } from "react";
import logoImg from "../../imports/image-9.png";

interface LoginPageProps {
  onSignIn: (phone: string, password: string) => Promise<string | null>;
  onGoSignUp: () => void;
  onForgotPassword: () => void;
  successMessage?: string;
}

export function LoginPage({ onSignIn, onGoSignUp, onForgotPassword, successMessage }: LoginPageProps) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (successMessage) {
      setShowSuccess(true);
      const t = setTimeout(() => setShowSuccess(false), 3500);
      return () => clearTimeout(t);
    }
  }, [successMessage]);

  const handleSignIn = async () => {
    setError("");
    if (!phone.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    const err = await onSignIn(phone.trim(), password);
    setLoading(false);
    if (err) setError(err);
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 overflow-hidden" style={{ background: "#0d0d1a" }}>
      {/* Purple glow */}
      <div className="absolute left-1/2 -translate-x-1/2 w-[340px] h-[340px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(130,70,255,0.25) 0%, transparent 70%)", filter: "blur(20px)", top: "-60px" }} />

      {/* Logo */}
      <div className="flex flex-col items-center mb-6 z-10">
        <img src={logoImg} alt="Vault" style={{ width: 130, height: 130, objectFit: "contain", mixBlendMode: "screen" }} />
      </div>

      {/* Title */}
      <div className="text-center mb-8 z-10">
        <p className="font-['Poppins:SemiBold',sans-serif] text-white text-[28px] mb-1">Welcome Back</p>
        <p className="font-['Poppins:Regular',sans-serif] text-[#61617f] text-[13px]">
          Sign in to access your saved links and collections.
        </p>
      </div>

      {/* Form */}
      <div className="w-full flex flex-col gap-5 z-10">

        {/* Phone Number */}
        <div className="flex flex-col gap-2">
          <p className="font-['Poppins:Medium',sans-serif] text-[#e8e8f5] text-[14px]">Phone Number</p>
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-[14px] border border-[#2a2a3a] focus-within:border-[#9b59ff]/60 transition-colors" style={{ background: "#13131f" }}>
            <svg className="size-[18px] flex-shrink-0 text-[#61617f]" fill="none" viewBox="0 0 24 24">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .14h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
                stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
            <input
              className="flex-1 bg-transparent outline-none font-['Poppins:Regular',sans-serif] text-[#e8e8f5] text-[14px] placeholder:text-[#3a3a50]"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              inputMode="tel"
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <p className="font-['Poppins:Medium',sans-serif] text-[#e8e8f5] text-[14px]">Password</p>
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-[14px] border border-[#2a2a3a] focus-within:border-[#9b59ff]/60 transition-colors overflow-hidden" style={{ background: "#13131f" }}>
            <svg className="size-[18px] flex-shrink-0 text-[#61617f]" fill="none" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
            <input
              className="flex-1 min-w-0 bg-transparent outline-none font-['Poppins:Regular',sans-serif] text-[#e8e8f5] text-[14px] placeholder:text-[#3a3a50]"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
              style={{ WebkitAppearance: "none" }}
            />
            <button type="button" onClick={() => setShowPassword((v) => !v)} className="flex-shrink-0 p-1 -mr-1">
              {showPassword ? (
                <svg className="size-[18px] text-[#61617f]" fill="none" viewBox="0 0 24 24">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              ) : (
                <svg className="size-[18px] text-[#61617f]" fill="none" viewBox="0 0 24 24">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d="M1 1l22 22" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
                </svg>
              )}
            </button>
          </div>

          <div className="flex justify-end">
            <button type="button" onClick={onForgotPassword} className="font-['Poppins:Regular',sans-serif] text-[#9b59ff] text-[12px]">
              Forgot Password?
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="font-['Poppins:Regular',sans-serif] text-red-400 text-[12px] text-center -mt-2">
            {error}
          </p>
        )}

        {/* Sign In button */}
        <button
          onClick={handleSignIn}
          disabled={loading}
          className="w-full py-4 rounded-[16px] bg-gradient-to-b from-[#9b59ff] to-[#7b69ff] font-['Poppins:SemiBold',sans-serif] text-white text-[16px] active:opacity-80 transition-opacity disabled:opacity-60 mt-2"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-center font-['Poppins:Regular',sans-serif] text-[#61617f] text-[13px]">
          Don't have an account?{" "}
          <button onClick={onGoSignUp} className="text-[#9b59ff] font-['Poppins:Medium',sans-serif]">
            Sign Up
          </button>
        </p>

        {/* Success message — green box, fades out after 3.5s */}
        <div
          className="flex items-center gap-2.5 px-4 py-3 rounded-[12px]"
          style={{ background: "rgba(16,60,35,0.85)", border: "1px solid rgba(52,211,153,0.45)", transition: "opacity 0.6s", opacity: showSuccess ? 1 : 0, pointerEvents: "none" }}
        >
          <svg className="size-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          </svg>
          <p className="font-['Poppins:Medium',sans-serif] text-emerald-300 text-[12px]">
            {successMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
