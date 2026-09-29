import logoImg from "../../imports/image-9.png";

interface SplashScreenProps {
  onDone: () => void;
}

export function SplashScreen({ onDone }: SplashScreenProps) {
  // Timing:
  // 0 – 600ms   → empty dark screen
  // 600ms       → logo fades + scales in (700ms transition)
  // ~1300ms     → logo fully visible
  // 4200ms      → start fade-out (700ms)
  // 4900ms      → onDone fires → app fades in

  return (
    <div
      className="absolute inset-0 z-[100] flex items-center justify-center"
      style={{
        backgroundColor: "#0d0d1a",
        animation: "splashExit 0.7s ease-in-out 4.2s forwards",
      }}
      onAnimationEnd={onDone}
    >
      <div
        style={{
          opacity: 0,
          animation: "splashLogoIn 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.6s forwards",
        }}
      >
        <img
          src={logoImg}
          alt="Vault"
          style={{
            width: 200,
            height: 200,
            objectFit: "contain",
            mixBlendMode: "screen",
          }}
        />
      </div>

      <style>{`
        @keyframes splashLogoIn {
          from { opacity: 0; transform: scale(0.75); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes splashExit {
          from { opacity: 1; }
          to   { opacity: 0; pointer-events: none; }
        }
      `}</style>
    </div>
  );
}
