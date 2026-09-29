import { useState } from "react";

interface ForgotPasswordPageProps {
  onBack: () => void;
  onCodeSent: (phone: string, code: string) => void;
  onSendCode: (phone: string) => Promise<{ code: string } | string>;
}

export function ForgotPasswordPage({ onBack, onCodeSent, onSendCode }: ForgotPasswordPageProps) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    setError("");
    if (!phone.trim()) { setError("Please enter your phone number"); return; }
    setLoading(true);
    const result = await onSendCode(phone.trim());
    setLoading(false);
    if (typeof result === "string") {
      setError(result);
    } else {
      onCodeSent(phone.trim(), result.code);
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col px-6 overflow-hidden" style={{ background: "#0d0d1a" }}>
      {/* Purple glow */}
      <div className="absolute left-1/2 -translate-x-1/2 w-[300px] h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(130,70,255,0.2) 0%, transparent 70%)", filter: "blur(20px)", top: "-60px" }} />

      {/* Header */}
      <div className="flex items-start gap-4 pt-14 pb-8 z-10">
        <button
          type="button"
          onClick={onBack}
          className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0 mt-1"
          style={{ background: "#1a1a28" }}
        >
          <svg className="size-5 text-[#e8e8f5]" fill="none" viewBox="0 0 24 24">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          </svg>
        </button>
        <div className="flex flex-col gap-1">
          <p className="font-['Poppins:SemiBold',sans-serif] text-white text-[26px] leading-tight">Forgot Password?</p>
          <p className="font-['Poppins:Regular',sans-serif] text-[#61617f] text-[13px] leading-relaxed">
            Enter your phone number and we'll send you a verification code.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-5 z-10">
        <div className="flex flex-col gap-2">
          <p className="font-['Poppins:Medium',sans-serif] text-[#e8e8f5] text-[14px]">Phone Number</p>
          <div
            className="flex items-center gap-3 px-4 py-4 rounded-[16px] border border-[#2a2a3a] focus-within:border-[#9b59ff]/60 transition-colors overflow-hidden"
            style={{ background: "#13131f" }}
          >
            <svg className="size-[18px] flex-shrink-0 text-[#61617f]" fill="none" viewBox="0 0 24 24">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .14h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
                stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
            <input
              className="flex-1 min-w-0 bg-transparent outline-none font-['Poppins:Regular',sans-serif] text-[#e8e8f5] text-[14px] placeholder:text-[#3a3a50]"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setError(""); }}
              type="tel"
              inputMode="tel"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
          </div>
        </div>

        {error && (
          <p className="font-['Poppins:Regular',sans-serif] text-red-400 text-[12px] -mt-2">{error}</p>
        )}

        <button
          type="button"
          onClick={handleSend}
          disabled={loading || !phone.trim()}
          className="w-full py-4 rounded-[16px] font-['Poppins:SemiBold',sans-serif] text-white text-[16px] active:opacity-80 transition-opacity disabled:opacity-50"
          style={{ background: "linear-gradient(180deg, #9b59ff 0%, #7b69ff 100%)" }}
        >
          {loading ? "Sending..." : "Send Code"}
        </button>
      </div>
    </div>
  );
}
