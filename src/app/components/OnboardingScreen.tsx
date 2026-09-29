import { useState } from "react";

interface OnboardingScreenProps {
  onDone: () => void;
}

function Illustration1() {
  return (
    <svg viewBox="0 0 280 280" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#9b59ff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#9b59ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cardGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#2a1a4a" />
          <stop offset="100%" stopColor="#130d25" />
        </radialGradient>
        <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9b59ff" />
          <stop offset="100%" stopColor="#6c3fc9" />
        </linearGradient>
        <filter id="shadow1" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#9b59ff" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Background glow */}
      <ellipse cx="140" cy="150" rx="110" ry="90" fill="url(#glow1)" />

      {/* Shield base */}
      <g filter="url(#shadow1)">
        <path d="M140 220 C140 220 90 195 90 155 L90 120 L140 105 L190 120 L190 155 C190 195 140 220 140 220Z" fill="url(#cardGrad)" stroke="rgba(155,89,255,0.4)" strokeWidth="1.5" />
        <path d="M140 210 C140 210 98 188 98 153 L98 126 L140 113 L182 126 L182 153 C182 188 140 210 140 210Z" fill="rgba(155,89,255,0.06)" />
      </g>

      {/* Chain link icon on shield */}
      <g transform="translate(140,157)">
        <path d="M-10 -5 C-10 -9.5 -6.5 -13 -2 -13 L2 -13 C6.5 -13 10 -9.5 10 -5 L10 -1 C10 3.5 6.5 7 2 7 L-2 7" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M10 5 C10 9.5 6.5 13 2 13 L-2 13 C-6.5 13 -10 9.5 -10 5 L-10 1 C-10 -3.5 -6.5 -7 -2 -7 L2 -7" stroke="rgba(155,89,255,0.9)" strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>

      {/* Floating card 1 (top-left) */}
      <g transform="rotate(-12, 60, 90)">
        <rect x="30" y="60" width="70" height="48" rx="10" fill="url(#cardGrad)" stroke="rgba(155,89,255,0.3)" strokeWidth="1" />
        <rect x="38" y="73" width="30" height="3" rx="1.5" fill="rgba(232,232,245,0.7)" />
        <rect x="38" y="80" width="45" height="2.5" rx="1.25" fill="rgba(155,89,255,0.5)" />
        <rect x="38" y="86" width="35" height="2" rx="1" fill="rgba(97,97,127,0.4)" />
        {/* favicon dot */}
        <rect x="38" y="66" width="14" height="4" rx="2" fill="rgba(155,89,255,0.5)" />
      </g>

      {/* Floating card 2 (top-right) */}
      <g transform="rotate(10, 215, 85)">
        <rect x="178" y="58" width="68" height="46" rx="10" fill="url(#cardGrad)" stroke="rgba(155,89,255,0.3)" strokeWidth="1" />
        <rect x="186" y="71" width="28" height="3" rx="1.5" fill="rgba(232,232,245,0.7)" />
        <rect x="186" y="78" width="43" height="2.5" rx="1.25" fill="rgba(155,89,255,0.5)" />
        <rect x="186" y="84" width="33" height="2" rx="1" fill="rgba(97,97,127,0.4)" />
        <rect x="186" y="64" width="14" height="4" rx="2" fill="rgba(52,211,153,0.5)" />
      </g>

      {/* Floating card 3 (bottom-left) */}
      <g transform="rotate(-6, 65, 200)">
        <rect x="28" y="185" width="68" height="40" rx="10" fill="url(#cardGrad)" stroke="rgba(155,89,255,0.25)" strokeWidth="1" />
        <rect x="36" y="195" width="25" height="3" rx="1.5" fill="rgba(232,232,245,0.6)" />
        <rect x="36" y="202" width="40" height="2" rx="1" fill="rgba(97,97,127,0.4)" />
        <rect x="36" y="190" width="12" height="3.5" rx="1.75" fill="rgba(239,68,68,0.5)" />
      </g>

      {/* Floating card 4 (bottom-right) */}
      <g transform="rotate(8, 215, 195)">
        <rect x="182" y="183" width="68" height="40" rx="10" fill="url(#cardGrad)" stroke="rgba(155,89,255,0.25)" strokeWidth="1" />
        <rect x="190" y="193" width="25" height="3" rx="1.5" fill="rgba(232,232,245,0.6)" />
        <rect x="190" y="200" width="40" height="2" rx="1" fill="rgba(97,97,127,0.4)" />
        <rect x="190" y="188" width="12" height="3.5" rx="1.75" fill="rgba(59,130,246,0.5)" />
      </g>

      {/* Purple accent dots */}
      <circle cx="55" cy="140" r="3" fill="rgba(155,89,255,0.6)" />
      <circle cx="225" cy="145" r="2.5" fill="rgba(155,89,255,0.5)" />
      <circle cx="140" cy="88" r="2" fill="rgba(155,89,255,0.4)" />
      <circle cx="100" cy="220" r="2" fill="rgba(155,89,255,0.3)" />
      <circle cx="185" cy="215" r="2.5" fill="rgba(155,89,255,0.4)" />
    </svg>
  );
}

function Illustration2() {
  const colors = [
    "#9b59ff", "#22c55e", "#3b82f6", "#f59e0b",
    "#ef4444", "#06b6d4", "#ec4899", "#8b5cf6",
  ];
  const labels = ["Design", "Dev", "Work", "Media", "News", "Docs", "Ideas", "Archive"];
  return (
    <svg viewBox="0 0 280 280" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6c3fc9" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6c3fc9" stopOpacity="0" />
        </radialGradient>
        <filter id="shadow2">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.4" />
        </filter>
      </defs>

      <ellipse cx="140" cy="148" rx="105" ry="85" fill="url(#glow2)" />

      {/* Phone frame */}
      <g filter="url(#shadow2)">
        <rect x="82" y="60" width="116" height="178" rx="16" fill="#13131f" stroke="rgba(155,89,255,0.4)" strokeWidth="1.5" />
        {/* Status bar */}
        <rect x="108" y="70" width="44" height="4" rx="2" fill="rgba(255,255,255,0.08)" />
        {/* Search bar */}
        <rect x="94" y="82" width="92" height="14" rx="7" fill="rgba(255,255,255,0.07)" />
        <circle cx="103" cy="89" r="3" fill="rgba(255,255,255,0.15)" />
      </g>

      {/* Grid of collection cards */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 94 + col * 54;
        const y = 104 + row * 56;
        const color = colors[i];
        return (
          <g key={i}>
            <rect x={x} y={y} width="44" height="44" rx="10" fill={`${color}22`} stroke={`${color}55`} strokeWidth="1" />
            {/* folder icon top */}
            <rect x={x + 8} y={y + 8} width="28" height="18" rx="4" fill={`${color}55`} />
            <rect x={x + 8} y={y + 6} width="14" height="5" rx="2.5" fill={`${color}66`} />
            {/* label */}
            <rect x={x + 7} y={y + 30} width={labels[i].length * 3.2} height="3" rx="1.5" fill="rgba(232,232,245,0.45)" />
          </g>
        );
      })}
    </svg>
  );
}

function Illustration3() {
  return (
    <svg viewBox="0 0 280 280" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glow3" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#9b59ff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#9b59ff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e1235" />
          <stop offset="100%" stopColor="#0f0f1e" />
        </linearGradient>
        <filter id="shadow3">
          <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="#9b59ff" floodOpacity="0.25" />
        </filter>
      </defs>

      <ellipse cx="140" cy="145" rx="115" ry="90" fill="url(#glow3)" />

      {/* Cloud shape */}
      <g filter="url(#shadow3)">
        <path d="M100 135 C100 120 110 108 125 108 C127 95 138 85 152 85 C166 85 178 95 180 108 L183 108 C194 108 203 117 203 128 C203 139 194 148 183 148 L100 148 C89 148 80 139 80 128 C80 117 89 108 100 108 Z" fill="url(#cloudGrad)" stroke="rgba(155,89,255,0.5)" strokeWidth="1.5" />
        {/* Sync arrows */}
        <path d="M130 125 C130 120 135 116 140 116 L150 116" stroke="rgba(155,89,255,0.8)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M148 113 L151 116 L148 119" stroke="rgba(155,89,255,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M150 133 C150 138 145 142 140 142 L130 142" stroke="rgba(155,89,255,0.8)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M132 139 L129 142 L132 145" stroke="rgba(155,89,255,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Dashed lines down */}
      <line x1="105" y1="152" x2="90" y2="175" stroke="rgba(155,89,255,0.3)" strokeWidth="1" strokeDasharray="3,3" />
      <line x1="140" y1="152" x2="140" y2="180" stroke="rgba(155,89,255,0.3)" strokeWidth="1" strokeDasharray="3,3" />
      <line x1="175" y1="152" x2="190" y2="175" stroke="rgba(155,89,255,0.3)" strokeWidth="1" strokeDasharray="3,3" />

      {/* Phone 1 (left) */}
      <g>
        <rect x="68" y="172" width="44" height="68" rx="8" fill="#13131f" stroke="rgba(155,89,255,0.4)" strokeWidth="1" />
        <rect x="74" y="182" width="32" height="4" rx="2" fill="rgba(155,89,255,0.3)" />
        <rect x="74" y="190" width="22" height="2.5" rx="1.25" fill="rgba(97,97,127,0.4)" />
        <rect x="74" y="196" width="28" height="2.5" rx="1.25" fill="rgba(97,97,127,0.3)" />
        <rect x="74" y="202" width="20" height="2.5" rx="1.25" fill="rgba(97,97,127,0.3)" />
        <rect x="74" y="210" width="32" height="12" rx="4" fill="rgba(155,89,255,0.15)" />
        <circle cx="80" cy="240" r="4" fill="rgba(97,97,127,0.25)" />
      </g>

      {/* Tablet (center) */}
      <g>
        <rect x="118" y="178" width="44" height="60" rx="8" fill="#13131f" stroke="rgba(155,89,255,0.5)" strokeWidth="1.5" />
        <rect x="124" y="187" width="32" height="4" rx="2" fill="rgba(155,89,255,0.4)" />
        <rect x="124" y="195" width="22" height="2.5" rx="1.25" fill="rgba(97,97,127,0.4)" />
        <rect x="124" y="201" width="28" height="2.5" rx="1.25" fill="rgba(97,97,127,0.3)" />
        <rect x="124" y="207" width="18" height="2.5" rx="1.25" fill="rgba(97,97,127,0.3)" />
        <rect x="124" y="215" width="32" height="11" rx="4" fill="rgba(155,89,255,0.2)" />
        <circle cx="140" cy="235" r="3.5" fill="rgba(97,97,127,0.25)" />
      </g>

      {/* Watch / small device (right) */}
      <g>
        <rect x="168" y="174" width="44" height="64" rx="8" fill="#13131f" stroke="rgba(155,89,255,0.35)" strokeWidth="1" />
        <rect x="174" y="183" width="32" height="4" rx="2" fill="rgba(155,89,255,0.3)" />
        <rect x="174" y="191" width="22" height="2.5" rx="1.25" fill="rgba(97,97,127,0.4)" />
        <rect x="174" y="197" width="26" height="2.5" rx="1.25" fill="rgba(97,97,127,0.3)" />
        <rect x="174" y="203" width="18" height="2.5" rx="1.25" fill="rgba(97,97,127,0.3)" />
        <rect x="174" y="211" width="32" height="11" rx="4" fill="rgba(155,89,255,0.12)" />
        <circle cx="190" cy="234" r="4" fill="rgba(97,97,127,0.25)" />
      </g>

      {/* Floating dots */}
      <circle cx="55" cy="120" r="2.5" fill="rgba(155,89,255,0.4)" />
      <circle cx="225" cy="110" r="2" fill="rgba(155,89,255,0.35)" />
      <circle cx="245" cy="170" r="2" fill="rgba(155,89,255,0.3)" />
    </svg>
  );
}

const SCREENS = [
  {
    title: "Save What Matters",
    subtitle: "Save valuable content the moment you find it.",
    Illustration: Illustration1,
  },
  {
    title: "Organize with Collections",
    subtitle: "Create collections that make finding your content effortless.",
    Illustration: Illustration2,
  },
  {
    title: "Your Links, Everywhere",
    subtitle: "Access your saved links securely across all your devices.",
    Illustration: Illustration3,
  },
];

export function OnboardingScreen({ onDone }: OnboardingScreenProps) {
  const [step, setStep] = useState(0);
  const isLast = step === SCREENS.length - 1;
  const { title, subtitle, Illustration } = SCREENS[step];

  const handleNext = () => {
    if (isLast) {
      onDone();
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <div className="absolute inset-0 z-[100] flex flex-col bg-[#0d0d1a] overflow-hidden">
      {/* Illustration area */}
      <div className="flex-1 flex items-center justify-center px-8 pt-10 relative">
        {/* Background subtle gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 60%, rgba(155,89,255,0.12) 0%, transparent 70%)",
          }}
        />
        <div className="w-full max-w-[300px] aspect-square relative z-10">
          <Illustration />
        </div>
      </div>

      {/* Text + dots + buttons */}
      <div className="flex-shrink-0 px-8 pb-12 flex flex-col items-center gap-5">
        {/* Title */}
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="font-['Poppins:SemiBold',sans-serif] text-[#e8e8f5] text-[26px] leading-tight">
            {title}
          </p>
          <p className="font-['Poppins:Regular',sans-serif] text-[#6b6b8f] text-[14px] leading-relaxed max-w-[260px]">
            {subtitle}
          </p>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center gap-2">
          {SCREENS.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === step ? "22px" : "7px",
                height: "7px",
                background: i === step ? "#9b59ff" : "rgba(155,89,255,0.25)",
              }}
            />
          ))}
        </div>

        {/* Next / Get Started button */}
        <button
          type="button"
          onClick={handleNext}
          className="w-full py-4 rounded-[16px] font-['Poppins:SemiBold',sans-serif] text-white text-[16px] active:opacity-85 transition-opacity"
          style={{ background: "linear-gradient(135deg, #9b59ff 0%, #7b3fe0 100%)" }}
        >
          {isLast ? "Get Started" : "Next"}
        </button>

        {/* Skip — hidden on last screen */}
        {!isLast && (
          <button
            type="button"
            onClick={onDone}
            className="font-['Poppins:Regular',sans-serif] text-[#4a4a6a] text-[14px] py-1 active:opacity-70 transition-opacity"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
