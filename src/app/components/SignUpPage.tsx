import { useState, useRef, useEffect } from "react";
import logoImg from "../../imports/image-9.png";

interface SignUpPageProps {
  onSignUp: (phone: string, dialCode: string, password: string, fullName: string) => Promise<string | null>;
  onGoLogin: () => void;
}

const COUNTRIES = [
  { code: "eg", dial: "+20",  name: "Egypt" },
  { code: "sa", dial: "+966", name: "Saudi Arabia" },
  { code: "ae", dial: "+971", name: "UAE" },
  { code: "kw", dial: "+965", name: "Kuwait" },
  { code: "qa", dial: "+974", name: "Qatar" },
  { code: "bh", dial: "+973", name: "Bahrain" },
  { code: "om", dial: "+968", name: "Oman" },
  { code: "jo", dial: "+962", name: "Jordan" },
  { code: "lb", dial: "+961", name: "Lebanon" },
  { code: "iq", dial: "+964", name: "Iraq" },
  { code: "sy", dial: "+963", name: "Syria" },
  { code: "ye", dial: "+967", name: "Yemen" },
  { code: "sd", dial: "+249", name: "Sudan" },
  { code: "ly", dial: "+218", name: "Libya" },
  { code: "dz", dial: "+213", name: "Algeria" },
  { code: "ma", dial: "+212", name: "Morocco" },
  { code: "tn", dial: "+216", name: "Tunisia" },
  { code: "us", dial: "+1",   name: "USA" },
  { code: "gb", dial: "+44",  name: "UK" },
  { code: "de", dial: "+49",  name: "Germany" },
  { code: "fr", dial: "+33",  name: "France" },
  { code: "tr", dial: "+90",  name: "Turkey" },
];

// flagcdn.com only supports specific widths: w20, w40, w80 …
function Flag({ code }: { code: string }) {
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      alt={code.toUpperCase()}
      width={24}
      height={16}
      className="rounded-sm flex-shrink-0 object-cover"
      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
    />
  );
}

function EyeOpen() {
  return (
    <svg className="size-[18px] text-[#61617f]" fill="none" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function EyeSlash() {
  return (
    <svg className="size-[18px] text-[#61617f]" fill="none" viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M1 1l22 22" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

export function SignUpPage({ onSignUp, onGoLogin }: SignUpPageProps) {
  const [fullName, setFullName]             = useState("");
  const [phone, setPhone]                   = useState("");
  const [country, setCountry]               = useState(COUNTRIES[0]);
  const [showCountryDrop, setShowCountryDrop] = useState(false);
  const [password, setPassword]             = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass]             = useState(false);
  const [showConfirm, setShowConfirm]       = useState(false);
  const [error, setError]                   = useState("");
  const [loading, setLoading]               = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  // Real-time password match state
  const passwordsFilled = password.length > 0 && confirmPassword.length > 0;
  const passwordsMatch  = password === confirmPassword;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node))
        setShowCountryDrop(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSubmit = async () => {
    setError("");
    if (!fullName.trim())      { setError("Please enter your full name"); return; }
    if (!phone.trim())         { setError("Please enter your phone number"); return; }
    if (password.length < 6)   { setError("Password must be at least 6 characters"); return; }
    if (!passwordsMatch)       { setError("Passwords do not match"); return; }

    setLoading(true);
    const err = await onSignUp(phone.trim(), country.dial, password, fullName.trim());
    setLoading(false);
    if (err) setError(err);
    // on success, App.tsx will switch screen to login automatically
  };

  const fieldBase     = "flex items-center gap-3 px-4 py-3.5 rounded-[14px] border transition-colors";
  const fieldBaseClip = `${fieldBase} overflow-hidden`;
  const fieldBg       = { background: "#13131f" };

  return (
    <div className="absolute inset-0 flex flex-col overflow-y-auto" style={{ background: "#0d0d1a" }}>
      {/* Purple glow */}
      <div className="absolute left-1/2 -translate-x-1/2 w-[340px] h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(130,70,255,0.22) 0%, transparent 70%)", filter: "blur(20px)", top: "-50px" }} />

      <div className="flex flex-col items-center px-6 py-10 z-10 min-h-full">

        {/* Logo — same size as Login, no VAULT text */}
        <div className="flex flex-col items-center mb-6">
          <img src={logoImg} alt="Vault" style={{ width: 130, height: 130, objectFit: "contain", mixBlendMode: "screen" }} />
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <p className="font-['Poppins:SemiBold',sans-serif] text-white text-[26px] mb-1">Create Your Vault</p>
          <p className="font-['Poppins:Regular',sans-serif] text-[#61617f] text-[13px]">
            Save & organize your favorite links in one place.
          </p>
        </div>

        {/* Form */}
        <div className="w-full flex flex-col gap-5">

          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <p className="font-['Poppins:Medium',sans-serif] text-[#e8e8f5] text-[14px]">Full Name</p>
            <div className={`${fieldBaseClip} border-[#2a2a3a] focus-within:border-[#9b59ff]/60`} style={fieldBg}>
              <svg className="size-[18px] flex-shrink-0 text-[#61617f]" fill="none" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <input
                className="flex-1 bg-transparent outline-none font-['Poppins:Regular',sans-serif] text-[#e8e8f5] text-[14px] placeholder:text-[#3a3a50]"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-2">
            <p className="font-['Poppins:Medium',sans-serif] text-[#e8e8f5] text-[14px]">Phone Number</p>
            <div className={`${fieldBase} border-[#2a2a3a] focus-within:border-[#9b59ff]/60`} style={fieldBg}>
              {/* Country picker */}
              <div className="relative flex-shrink-0" ref={dropRef}>
                <button
                  onClick={() => setShowCountryDrop((v) => !v)}
                  className="flex items-center gap-1.5 pr-3 border-r border-[#2a2a3a] mr-1"
                >
                  <Flag code={country.code} />
                  <span className="font-['Poppins:Regular',sans-serif] text-[#e8e8f5] text-[13px]">{country.dial}</span>
                  <svg className="size-3 text-[#61617f]" fill="none" viewBox="0 0 24 24">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                </button>

                {showCountryDrop && (
                  <div className="absolute left-0 top-10 z-50 w-60 max-h-60 overflow-y-auto rounded-[14px] border border-[#2a2a3a] shadow-2xl" style={{ background: "#13131f" }}>
                    {COUNTRIES.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => { setCountry(c); setShowCountryDrop(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left ${country.code === c.code ? "bg-[#9b59ff]/15" : "active:bg-[#1a1a28]"}`}
                      >
                        <Flag code={c.code} />
                        <span className="font-['Poppins:Regular',sans-serif] text-[#e8e8f5] text-[13px] flex-1">{c.name}</span>
                        <span className="font-['Poppins:Regular',sans-serif] text-[#61617f] text-[12px]">{c.dial}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <input
                className="flex-1 bg-transparent outline-none font-['Poppins:Regular',sans-serif] text-[#e8e8f5] text-[14px] placeholder:text-[#3a3a50] min-w-0"
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
            <div className={`${fieldBaseClip} border-[#2a2a3a] focus-within:border-[#9b59ff]/60`} style={fieldBg}>
              <svg className="size-[18px] flex-shrink-0 text-[#61617f]" fill="none" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
              <input
                className="flex-1 min-w-0 bg-transparent outline-none font-['Poppins:Regular',sans-serif] text-[#e8e8f5] text-[14px] placeholder:text-[#3a3a50]"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPass ? "text" : "password"}
                style={{ WebkitAppearance: "none" }}
              />
              <button type="button" onClick={() => setShowPass((v) => !v)} className="flex-shrink-0 p-1 -mr-1">
                {showPass ? <EyeOpen /> : <EyeSlash />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <p className="font-['Poppins:Medium',sans-serif] text-[#e8e8f5] text-[14px]">Confirm Password</p>
            <div
              className={`${fieldBaseClip} ${
                passwordsFilled
                  ? passwordsMatch
                    ? "border-emerald-500/60"
                    : "border-red-500/60"
                  : "border-[#2a2a3a] focus-within:border-[#9b59ff]/60"
              }`}
              style={fieldBg}
            >
              <svg className="size-[18px] flex-shrink-0 text-[#61617f]" fill="none" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
              <input
                className="flex-1 min-w-0 bg-transparent outline-none font-['Poppins:Regular',sans-serif] text-[#e8e8f5] text-[14px] placeholder:text-[#3a3a50]"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={showConfirm ? "text" : "password"}
                style={{ WebkitAppearance: "none" }}
              />
              <button type="button" onClick={() => setShowConfirm((v) => !v)} className="flex-shrink-0 p-1 -mr-1">
                {showConfirm ? <EyeOpen /> : <EyeSlash />}
              </button>
            </div>

            {/* Real-time match feedback */}
            {passwordsFilled && (
              <p className={`font-['Poppins:Regular',sans-serif] text-[12px] ${passwordsMatch ? "text-emerald-400" : "text-red-400"}`}>
                {passwordsMatch ? "✓ Passwords match" : "✗ Passwords don't match"}
              </p>
            )}
          </div>

          {/* Submit error */}
          {error && (
            <p className="font-['Poppins:Regular',sans-serif] text-red-400 text-[12px] text-center -mt-1">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 rounded-[16px] bg-gradient-to-b from-[#9b59ff] to-[#7b69ff] font-['Poppins:SemiBold',sans-serif] text-white text-[16px] active:opacity-80 transition-opacity disabled:opacity-60 mt-2"
          >
            {loading ? "Creating account..." : "Start Saving"}
          </button>

          <p className="text-center font-['Poppins:Regular',sans-serif] text-[#61617f] text-[13px] pb-4">
            Already have an account?{" "}
            <button onClick={onGoLogin} className="text-[#9b59ff] font-['Poppins:Medium',sans-serif]">
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
