import { useState, useEffect, useRef } from "react";

// ── Sliding toast notification ────────────────────────────────────────────────
function OtpToast({ code, onDone }: { code: string; onDone: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Slide in
    const t1 = setTimeout(() => setVisible(true), 50);
    // Slide out after 3.5s
    const t2 = setTimeout(() => { setVisible(false); }, 3500);
    // Remove after slide-out animation
    const t3 = setTimeout(() => onDone(), 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div
      className="absolute left-4 right-4 z-50"
      style={{
        top: 16,
        transform: visible ? "translateY(0)" : "translateY(-120px)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease",
      }}
    >
      <div
        className="flex items-center gap-3 px-4 py-3.5 rounded-[18px]"
        style={{
          background: "rgba(26,26,40,0.97)",
          border: "1px solid rgba(155,89,255,0.4)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(155,89,255,0.1)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* Icon */}
        <div className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #9b59ff, #7b69ff)" }}>
          <svg className="size-5 text-white" fill="none" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
              stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-['Poppins:SemiBold',sans-serif] text-[#e8e8f5] text-[13px]">Vault — Verification Code</p>
          <p className="font-['Poppins:Regular',sans-serif] text-[#61617f] text-[12px]">
            Your code is: <span className="font-['Poppins:SemiBold',sans-serif] text-[#9b59ff] text-[14px] tracking-widest">{code}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── OTP Box ───────────────────────────────────────────────────────────────────
function OtpBox({ value, isFocused, inputRef, onKeyDown, onChange, onFocus }: {
  value: string;
  isFocused: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange: (v: string) => void;
  onFocus: () => void;
}) {
  const filled = value !== "";
  return (
    <div
      className="relative flex items-center justify-center rounded-[16px] transition-all duration-200"
      style={{
        width: 72, height: 72,
        background: filled || isFocused ? "#1a1a28" : "#13131f",
        border: filled
          ? "2px solid rgba(155,89,255,0.9)"
          : isFocused
          ? "2px solid rgba(155,89,255,0.5)"
          : "2px solid #232336",
        boxShadow: filled ? "0 0 12px rgba(155,89,255,0.2)" : "none",
      }}
    >
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        maxLength={1}
        value={value}
        onFocus={onFocus}
        onChange={(e) => {
          const v = e.target.value.replace(/\D/g, "");
          onChange(v.slice(-1));
        }}
        onKeyDown={onKeyDown}
        className="absolute inset-0 w-full h-full bg-transparent outline-none text-center font-['Poppins:SemiBold',sans-serif] text-[28px] text-[#e8e8f5] caret-transparent"
        style={{ WebkitAppearance: "none" }}
      />
    </div>
  );
}

// ── Timer ─────────────────────────────────────────────────────────────────────
function useTimer(seconds: number, onExpire: () => void) {
  const [remaining, setRemaining] = useState(seconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = (s?: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const start = s ?? seconds;
    setRemaining(start);
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    reset();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  return { display: `${mm}:${ss}`, expired: remaining === 0, reset };
}

// ── Main Component ────────────────────────────────────────────────────────────
interface OtpVerifyPageProps {
  phone: string;
  otpCode: string;
  onBack: () => void;
  onVerified: (resetToken: string) => void;
  onResend: () => Promise<string>;
  onVerify: (phone: string, code: string) => Promise<string | null>;
}

export function OtpVerifyPage({ phone, otpCode, onBack, onVerified, onResend, onVerify }: OtpVerifyPageProps) {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [focusedIdx, setFocusedIdx] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(true);
  const [currentCode, setCurrentCode] = useState(otpCode);
  const [timerExpired, setTimerExpired] = useState(false);

  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const { display: timerDisplay, reset: resetTimer } = useTimer(90, () => setTimerExpired(true));

  const allFilled = digits.every((d) => d !== "");

  const handleChange = (idx: number, val: string) => {
    const next = [...digits];
    next[idx] = val;
    setDigits(next);
    if (val && idx < 3) {
      refs[idx + 1].current?.focus();
      setFocusedIdx(idx + 1);
    }
    setError("");
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[idx] === "" && idx > 0) {
        const next = [...digits];
        next[idx - 1] = "";
        setDigits(next);
        refs[idx - 1].current?.focus();
        setFocusedIdx(idx - 1);
      }
    }
  };

  const handleVerify = async () => {
    if (!allFilled) return;
    setError("");
    setLoading(true);
    const code = digits.join("");
    const err = await onVerify(phone, code);
    setLoading(false);
    if (err) {
      setError(err);
      setDigits(["", "", "", ""]);
      refs[0].current?.focus();
      setFocusedIdx(0);
    } else {
      onVerified("");
    }
  };

  const handleResend = async () => {
    if (!timerExpired) return;
    const newCode = await onResend();
    if (newCode) {
      setCurrentCode(newCode);
      setShowToast(true);
      setTimerExpired(false);
      setDigits(["", "", "", ""]);
      setError("");
      resetTimer(90);
      refs[0].current?.focus();
      setFocusedIdx(0);
    }
  };

  // Focus first box on mount
  useEffect(() => { refs[0].current?.focus(); }, []);

  const maskedPhone = phone.length > 4
    ? phone.slice(0, -4).replace(/\d/g, "*") + phone.slice(-4)
    : phone;

  return (
    <div className="absolute inset-0 flex flex-col px-6 overflow-hidden" style={{ background: "#0d0d1a" }}>
      {/* Purple glow */}
      <div className="absolute left-1/2 -translate-x-1/2 w-[300px] h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(130,70,255,0.2) 0%, transparent 70%)", filter: "blur(20px)", top: "-60px" }} />

      {/* Toast */}
      {showToast && (
        <OtpToast code={currentCode} onDone={() => setShowToast(false)} />
      )}

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
          <p className="font-['Poppins:SemiBold',sans-serif] text-white text-[26px] leading-tight">Verification Code</p>
          <p className="font-['Poppins:Regular',sans-serif] text-[#61617f] text-[13px] leading-relaxed">
            Enter the 4-digit code sent to{" "}
            <span className="text-[#e8e8f5]">{maskedPhone}</span>
          </p>
        </div>
      </div>

      {/* OTP Boxes */}
      <div className="flex justify-between gap-3 z-10 mb-3">
        {digits.map((d, i) => (
          <OtpBox
            key={i}
            value={d}
            isFocused={focusedIdx === i}
            inputRef={refs[i]}
            onChange={(v) => handleChange(i, v)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onFocus={() => setFocusedIdx(i)}
          />
        ))}
      </div>

      {/* Timer */}
      <div className="flex justify-end z-10 mb-6">
        {!timerExpired ? (
          <span className="font-['Poppins:Medium',sans-serif] text-[#61617f] text-[14px]">{timerDisplay}</span>
        ) : (
          <span className="font-['Poppins:Regular',sans-serif] text-[#61617f] text-[12px]">Code expired</span>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="font-['Poppins:Regular',sans-serif] text-red-400 text-[12px] text-center mb-4 z-10">{error}</p>
      )}

      {/* Verify button */}
      <button
        type="button"
        onClick={handleVerify}
        disabled={!allFilled || loading}
        className="w-full py-4 rounded-[16px] font-['Poppins:SemiBold',sans-serif] text-white text-[16px] transition-all z-10"
        style={{
          background: allFilled && !loading
            ? "linear-gradient(180deg, #9b59ff 0%, #7b69ff 100%)"
            : "#1e1433",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Verifying..." : "Verify"}
      </button>

      {/* Resend */}
      <div className="flex justify-center mt-5 z-10">
        <p className="font-['Poppins:Regular',sans-serif] text-[#61617f] text-[13px]">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={!timerExpired}
            className={`font-['Poppins:Medium',sans-serif] transition-colors ${
              timerExpired ? "text-[#9b59ff]" : "text-[#3a3a50]"
            }`}
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
}
