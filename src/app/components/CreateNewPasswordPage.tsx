import { useState } from "react";

interface CreateNewPasswordPageProps {
  onBack: () => void;
  onUpdate: (newPassword: string) => Promise<string | null>;
}

export function CreateNewPasswordPage({ onBack, onUpdate }: CreateNewPasswordPageProps) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordsFilled = password.length > 0 && confirm.length > 0;
  const passwordsMatch = password === confirm;

  const handleUpdate = async () => {
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (!passwordsMatch) { setError("Passwords do not match"); return; }
    setLoading(true);
    const err = await onUpdate(password);
    setLoading(false);
    if (err) setError(err);
  };

  const fieldStyle = {
    background: "#13131f",
  };

  return (
    <div className="absolute inset-0 flex flex-col px-6 overflow-hidden" style={{ background: "#0d0d1a" }}>
      {/* Purple glow */}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-[300px] h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(130,70,255,0.2) 0%, transparent 70%)", filter: "blur(20px)", top: "-60px" }}
      />

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
        <div className="flex flex-col gap-1.5">
          <p className="font-['Poppins:SemiBold',sans-serif] text-white text-[26px] leading-tight">Create New Password</p>
          <p className="font-['Poppins:Regular',sans-serif] text-[#61617f] text-[13px] leading-relaxed">
            Your new password must be different from your previous password.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-5 z-10">

        {/* New Password */}
        <div className="flex flex-col gap-2">
          <p className="font-['Poppins:SemiBold',sans-serif] text-[#e8e8f5] text-[15px]">New Password</p>
          <div
            className="flex items-center gap-3 px-4 py-4 rounded-[20px] border border-[#2a2a3a] focus-within:border-[#9b59ff]/60 transition-colors overflow-hidden"
            style={fieldStyle}
          >
            <svg className="size-[18px] flex-shrink-0 text-[#61617f]" fill="none" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
            <input
              className="flex-1 min-w-0 bg-transparent outline-none font-['Poppins:Regular',sans-serif] text-[#e8e8f5] text-[14px] placeholder:text-[#3a3a50]"
              placeholder="Create a new password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              type={showPass ? "text" : "password"}
              style={{ WebkitAppearance: "none" }}
            />
            <button type="button" onClick={() => setShowPass((v) => !v)} className="flex-shrink-0 p-1 -mr-1">
              {showPass ? (
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
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-2">
          <p className="font-['Poppins:SemiBold',sans-serif] text-[#e8e8f5] text-[15px]">Confirm Password</p>
          <div
            className={`flex items-center gap-3 px-4 py-4 rounded-[20px] border transition-colors overflow-hidden ${
              passwordsFilled
                ? passwordsMatch
                  ? "border-emerald-500/60"
                  : "border-red-500/60"
                : "border-[#2a2a3a] focus-within:border-[#9b59ff]/60"
            }`}
            style={fieldStyle}
          >
            <svg className="size-[18px] flex-shrink-0 text-[#61617f]" fill="none" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
            <input
              className="flex-1 min-w-0 bg-transparent outline-none font-['Poppins:Regular',sans-serif] text-[#e8e8f5] text-[14px] placeholder:text-[#3a3a50]"
              placeholder="Re-enter your password"
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setError(""); }}
              type={showConfirm ? "text" : "password"}
              style={{ WebkitAppearance: "none" }}
              onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
            />
            <button type="button" onClick={() => setShowConfirm((v) => !v)} className="flex-shrink-0 p-1 -mr-1">
              {showConfirm ? (
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

          {/* Hint / match feedback */}
          {passwordsFilled ? (
            <p className={`font-['Poppins:Regular',sans-serif] text-[12px] ${passwordsMatch ? "text-emerald-400" : "text-red-400"}`}>
              {passwordsMatch ? "✓ Passwords match" : "✗ Passwords don't match"}
            </p>
          ) : (
            <p className="font-['Poppins:Regular',sans-serif] text-[#3a3a50] text-[12px]">
              • Make it strong and easy to remember
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="font-['Poppins:Regular',sans-serif] text-red-400 text-[12px] -mt-2">{error}</p>
        )}

        {/* Update button */}
        <button
          type="button"
          onClick={handleUpdate}
          disabled={loading || !password || !confirm}
          className="w-full py-4 rounded-[20px] font-['Poppins:SemiBold',sans-serif] text-white text-[16px] active:opacity-80 transition-opacity disabled:opacity-50 mt-1"
          style={{ background: "linear-gradient(180deg, #9b59ff 0%, #7b69ff 100%)" }}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}
