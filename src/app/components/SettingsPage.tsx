import { useState, useEffect } from "react";

type Lang = "en" | "ar";

interface SettingsPageProps {
  userName: string;
  onUserNameChange: (name: string) => void;
  userPhone?: string;
  onLogout: () => void;
  onDeleteAccount: () => Promise<void>;
  onChangePassword: () => void;
  onPrivacyPolicy: () => void;
  lang: Lang;
  onLangChange: (l: Lang) => void;
}

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  const visible = digits.slice(-3);
  return "•".repeat(Math.max(0, digits.length - 3)) + visible;
}

const T = {
  en: {
    settings: "Settings",
    profile: "Profile",
    preferences: "Preferences",
    about: "About",
    account: "Account",
    editName: "Edit Name",
    tapToAddName: "Tap to set your name",
    language: "Language",
    langSub: "App display language",
    notifications: "Notifications",
    notifSub: "In-app reminders for your links",
    notifDenied: "In-app reminders for your links",
    phoneNumber: "Phone Number",
    phoneNumberSub: "Registered account number",
    changePassword: "Change Password",
    changePasswordSub: "Update your account password",
    rateApp: "Rate the App",
    rateAppSub: "Love it? Leave a review ⭐",
    contactUs: "Contact Us",
    privacyPolicy: "Privacy Policy",
    version: "Version",
    signOut: "Sign Out",
    signOutDesc: "You'll be signed out. You can sign back in anytime.",
    deleteAccount: "Delete Account",
    deleteDesc: "Your account and all saved links and collections will be",
    deleteDescRed: "permanently deleted",
    deleteDescEnd: ". This cannot be undone.",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    deleting: "Deleting...",
    yourName: "Your name",
  },
  ar: {
    settings: "الإعدادات",
    profile: "الملف الشخصي",
    preferences: "التفضيلات",
    about: "عن التطبيق",
    account: "الحساب",
    editName: "تعديل الاسم",
    tapToAddName: "اضغط لإضافة اسمك",
    language: "اللغة",
    langSub: "لغة واجهة التطبيق",
    notifications: "الإشعارات",
    notifSub: "تذكيرات داخل التطبيق",
    notifDenied: "تذكيرات داخل التطبيق",
    phoneNumber: "رقم الهاتف",
    phoneNumberSub: "رقم الحساب المسجل",
    changePassword: "تغيير كلمة السر",
    changePasswordSub: "تحديث كلمة سر حسابك",
    rateApp: "قيّم التطبيق",
    rateAppSub: "أعجبك؟ اترك تقييماً ⭐",
    contactUs: "تواصل معنا",
    privacyPolicy: "سياسة الخصوصية",
    version: "الإصدار",
    signOut: "تسجيل الخروج",
    signOutDesc: "سيتم تسجيل خروجك. يمكنك تسجيل الدخول مجدداً في أي وقت.",
    deleteAccount: "حذف الحساب",
    deleteDesc: "سيتم حذف حسابك وجميع روابطك ومجموعاتك",
    deleteDescRed: "بشكل نهائي",
    deleteDescEnd: ". لا يمكن التراجع عن ذلك.",
    cancel: "إلغاء",
    save: "حفظ",
    delete: "حذف",
    deleting: "جارٍ الحذف...",
    yourName: "اسمك",
  },
} as const;

// ── Toggle switch ─────────────────────────────────────────────────────────────
function Toggle({ on, onToggle, disabled }: { on: boolean; onToggle: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`relative w-[46px] h-[26px] rounded-full transition-colors flex-shrink-0 ${on ? "bg-[#9b59ff]" : "bg-[#2a2a3a]"} ${disabled ? "opacity-40" : ""}`}
    >
      <div
        className={`absolute top-[3px] w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${on ? "translate-x-[23px]" : "translate-x-[3px]"}`}
      />
    </button>
  );
}

// ── Language pill ─────────────────────────────────────────────────────────────
function LangPill({ lang, onToggle }: { lang: Lang; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center bg-[#0f0f18] border border-[#2a2a3a] rounded-full p-[3px] gap-[2px] flex-shrink-0"
    >
      {(["en", "ar"] as Lang[]).map((l) => (
        <span
          key={l}
          className={`px-3 py-[3px] rounded-full font-['Poppins:Medium',sans-serif] text-[12px] transition-all ${
            lang === l ? "bg-[#9b59ff] text-white" : "text-[#61617f]"
          }`}
        >
          {l === "en" ? "EN" : "AR"}
        </span>
      ))}
    </button>
  );
}

// ── Settings row ──────────────────────────────────────────────────────────────
function SettingsRow({ icon, label, subtitle, right, onPress, danger }: {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  danger?: boolean;
}) {
  const Tag = onPress ? "button" : "div";
  return (
    <Tag
      {...(onPress ? { onClick: onPress, type: "button" } : {})}
      className={`w-full flex items-center gap-3 px-4 py-3.5 text-left ${onPress ? "active:opacity-70 transition-opacity" : ""}`}
    >
      <div className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-['Poppins:Medium',sans-serif] text-[14px] ${danger ? "text-red-400" : "text-[#e8e8f5]"}`}>
          {label}
        </p>
        {subtitle && (
          <p className="font-['Poppins:Regular',sans-serif] text-[#61617f] text-[11px] mt-0.5 leading-tight">
            {subtitle}
          </p>
        )}
      </div>
      {right !== undefined ? right : (
        onPress && (
          <svg className="size-4 text-[#3a3a50] flex-shrink-0" fill="none" viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        )
      )}
    </Tag>
  );
}

function Divider() {
  return <div className="h-px bg-[#232336] mx-4" />;
}

function SectionLabel({ label }: { label: string }) {
  return <p className="font-['Poppins:Medium',sans-serif] text-[#61617f] text-[11px] mb-2 px-1 uppercase tracking-wider">{label}</p>;
}

// ── Sheets ────────────────────────────────────────────────────────────────────
function EditNameSheet({ current, t, onClose, onSave }: {
  current: string;
  t: typeof T["en"];
  onClose: () => void;
  onSave: (n: string) => void;
}) {
  const [val, setVal] = useState(current);
  return (
    <div className="absolute inset-0 bg-black/60 flex items-end z-50" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full bg-[#13131f] rounded-t-[28px] px-5 pt-3 pb-8">
        <div className="w-10 h-1 bg-[#2a2a3a] rounded-full mx-auto mb-5" />
        <p className="font-['Poppins:SemiBold',sans-serif] text-[#e8e8f5] text-[18px] mb-4">{t.editName}</p>
        <div className="bg-[#0f0f18] rounded-[14px] px-4 py-3.5 mb-5 border border-[#2a2a3a] focus-within:border-[#9b59ff]/50 transition-colors">
          <input
            className="w-full bg-transparent outline-none font-['Poppins:Regular',sans-serif] text-[#e8e8f5] text-[15px] placeholder:text-[#3a3a50]"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            autoFocus
            placeholder={t.yourName}
          />
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 py-3.5 rounded-[14px] bg-[#1a1a28] font-['Poppins:Medium',sans-serif] text-[#61617f] text-[15px]">{t.cancel}</button>
          <button type="button" onClick={() => val.trim() && onSave(val.trim())} disabled={!val.trim()} className="flex-1 py-3.5 rounded-[14px] bg-gradient-to-b from-[#9b59ff] to-[#7b69ff] font-['Poppins:SemiBold',sans-serif] text-white text-[15px] disabled:opacity-40">{t.save}</button>
        </div>
      </div>
    </div>
  );
}

function LogoutSheet({ t, onClose, onConfirm }: { t: typeof T["en"]; onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="absolute inset-0 bg-black/60 flex items-end z-50" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full bg-[#13131f] rounded-t-[28px] px-5 pt-3 pb-8">
        <div className="w-10 h-1 bg-[#2a2a3a] rounded-full mx-auto mb-5" />
        <div className="flex flex-col items-center gap-2 mb-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[#1a1a28] flex items-center justify-center mb-1">
            <svg className="size-6 text-[#9b59ff]" fill="none" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
          <p className="font-['Poppins:SemiBold',sans-serif] text-[#e8e8f5] text-[18px]">{t.signOut}</p>
          <p className="font-['Poppins:Regular',sans-serif] text-[#61617f] text-[13px]">{t.signOutDesc}</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 py-3.5 rounded-[14px] bg-[#1a1a28] font-['Poppins:Medium',sans-serif] text-[#61617f] text-[15px]">{t.cancel}</button>
          <button type="button" onClick={onConfirm} className="flex-1 py-3.5 rounded-[14px] bg-gradient-to-b from-[#9b59ff] to-[#7b69ff] font-['Poppins:SemiBold',sans-serif] text-white text-[15px]">{t.signOut}</button>
        </div>
      </div>
    </div>
  );
}

function DeleteAccountSheet({ t, onClose, onConfirm, loading }: { t: typeof T["en"]; onClose: () => void; onConfirm: () => void; loading: boolean }) {
  return (
    <div className="absolute inset-0 bg-black/60 flex items-end z-50" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full bg-[#13131f] rounded-t-[28px] px-5 pt-3 pb-8">
        <div className="w-10 h-1 bg-[#2a2a3a] rounded-full mx-auto mb-5" />
        <div className="flex flex-col items-center gap-2 mb-6 text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mb-1">
            <svg className="size-6 text-red-400" fill="none" viewBox="0 0 24 24">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
          <p className="font-['Poppins:SemiBold',sans-serif] text-[#e8e8f5] text-[18px]">{t.deleteAccount}</p>
          <p className="font-['Poppins:Regular',sans-serif] text-[#61617f] text-[13px] leading-relaxed">
            {t.deleteDesc} <span className="text-red-400">{t.deleteDescRed}</span>{t.deleteDescEnd}
          </p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onClose} disabled={loading} className="flex-1 py-3.5 rounded-[14px] bg-[#1a1a28] font-['Poppins:Medium',sans-serif] text-[#61617f] text-[15px] disabled:opacity-50">{t.cancel}</button>
          <button type="button" onClick={onConfirm} disabled={loading} className="flex-1 py-3.5 rounded-[14px] bg-red-500 font-['Poppins:SemiBold',sans-serif] text-white text-[15px] disabled:opacity-50">
            {loading ? t.deleting : t.delete}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function SettingsPage({ userName, onUserNameChange, userPhone = "", onLogout, onDeleteAccount, onChangePassword, onPrivacyPolicy, lang, onLangChange }: SettingsPageProps) {
  const t = T[lang];

  const [showEditName, setShowEditName]       = useState(false);
  const [showLogout, setShowLogout]           = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [deleteLoading, setDeleteLoading]     = useState(false);

  // Notifications — in-app reminders only, no browser Notification API needed
  const [notifOn, setNotifOn] = useState(() => localStorage.getItem("vault_notif") !== "false");

  const handleNotifToggle = () => {
    const next = !notifOn;
    setNotifOn(next);
    localStorage.setItem("vault_notif", next ? "true" : "false");
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    await onDeleteAccount();
    setDeleteLoading(false);
    setShowDeleteAccount(false);
  };

  const iconBg = (color: string) => `w-9 h-9 rounded-[10px] ${color} flex items-center justify-center`;

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-6 pb-4">
        <p className="font-['Poppins:SemiBold',sans-serif] text-[#e8e8f5] text-[26px]">{t.settings}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 flex flex-col gap-5 pb-8">

        {/* ── Profile card ── */}
        <button
          type="button"
          onClick={() => setShowEditName(true)}
          className="w-full flex items-center justify-between px-4 py-4 rounded-[18px] active:opacity-80 transition-opacity"
          style={{ background: "linear-gradient(135deg, #2d1b69 0%, #1a1a40 60%, #0f0f28 100%)", border: "1px solid rgba(155,89,255,0.3)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#9b59ff]/25 border border-[#9b59ff]/40 flex items-center justify-center flex-shrink-0">
              <svg className="size-6 text-[#9b59ff]" fill="none" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="flex flex-col gap-0.5">
              {userName ? (
                <p className="font-['Poppins:SemiBold',sans-serif] text-[#e8e8f5] text-[16px] text-left">{userName}</p>
              ) : (
                <p className="font-['Poppins:Regular',sans-serif] text-[#3a3a50] text-[14px] text-left">{t.tapToAddName}</p>
              )}
              <p className="font-['Poppins:Regular',sans-serif] text-[#9b59ff]/60 text-[11px] text-left">{t.profile}</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-[9px] bg-[#9b59ff]/20 flex items-center justify-center flex-shrink-0">
            <svg className="size-3.5 text-[#9b59ff]" fill="none" viewBox="0 0 24 24">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </button>

        {/* ── Preferences ── */}
        <div>
          <SectionLabel label={t.preferences} />
          <div className="bg-[#1a1a28] rounded-[18px] border border-[#232336] overflow-hidden">

            {/* Phone Number — display only, masked */}
            <div className="w-full flex items-center gap-3 px-4 py-3.5">
              <div className={iconBg("bg-[#1a2035]")}>
                <svg className="size-5 text-indigo-400" fill="none" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.01 2.21 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-['Poppins:Medium',sans-serif] text-[#e8e8f5] text-[14px]">{t.phoneNumber}</p>
                <p className="font-['Poppins:Regular',sans-serif] text-[#61617f] text-[11px] mt-0.5 leading-tight">{t.phoneNumberSub}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {userPhone ? (
                  <span
                    className="font-['Courier_Prime',monospace] text-[#9b59ff] text-[14px] tracking-widest"
                    style={{ letterSpacing: "0.15em" }}
                  >
                    {maskPhone(userPhone)}
                  </span>
                ) : (
                  <span className="font-['Poppins:Regular',sans-serif] text-[#3a3a50] text-[13px]">—</span>
                )}
              </div>
            </div>

            <Divider />

            {/* Change Password */}
            <SettingsRow
              icon={<div className={iconBg("bg-[#1a1a2e]")}>
                <svg className="size-5 text-[#9b59ff]" fill="none" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>}
              label={t.changePassword}
              subtitle={t.changePasswordSub}
              onPress={onChangePassword}
            />

            <Divider />

            {/* Language */}
            <SettingsRow
              icon={<div className={iconBg("bg-[#1a2a3a]")}>
                <svg className="size-5 text-sky-400" fill="none" viewBox="0 0 24 24">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>}
              label={t.language}
              subtitle={t.langSub}
              right={<LangPill lang={lang} onToggle={() => onLangChange(lang === "en" ? "ar" : "en")} />}
            />

            <Divider />

            {/* Notifications */}
            <SettingsRow
              icon={<div className={iconBg("bg-[#1a1a00]")}>
                <svg className="size-5 text-amber-400" fill="none" viewBox="0 0 24 24">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>}
              label={t.notifications}
              subtitle={t.notifSub}
              right={<Toggle on={notifOn} onToggle={handleNotifToggle} />}
            />
          </div>
        </div>

        {/* ── About ── */}
        <div>
          <SectionLabel label={t.about} />
          <div className="bg-[#1a1a28] rounded-[18px] border border-[#232336] overflow-hidden">

            <SettingsRow
              icon={<div className={iconBg("bg-[#3d2a00]")}>
                <svg className="size-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>}
              label={t.rateApp}
              subtitle={t.rateAppSub}
              onPress={() => {}}
            />

            <Divider />

            <SettingsRow
              icon={<div className={iconBg("bg-[#001a1a]")}>
                <svg className="size-5 text-teal-400" fill="none" viewBox="0 0 24 24">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>}
              label={t.contactUs}
              onPress={() => window.open("https://t.me/moustafakamar", "_blank", "noopener,noreferrer")}
            />

            <Divider />

            <SettingsRow
              icon={<div className={iconBg("bg-[#0d2a1a]")}>
                <svg className="size-5 text-emerald-400" fill="none" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>}
              label={t.privacyPolicy}
              onPress={onPrivacyPolicy}
            />

            <Divider />

            <SettingsRow
              icon={<div className={iconBg("bg-[#1a1a2e]")}>
                <svg className="size-5 text-[#61617f]" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
                </svg>
              </div>}
              label={t.version}
              right={<span className="font-['Poppins:Regular',sans-serif] text-[#61617f] text-[13px]">1.0.0</span>}
            />
          </div>
        </div>

        {/* ── Account ── */}
        <div>
          <SectionLabel label={t.account} />
          <div className="bg-[#1a1a28] rounded-[18px] border border-[#232336] overflow-hidden">
            <SettingsRow
              icon={<div className={iconBg("bg-[#1a1a2e]")}>
                <svg className="size-5 text-[#9b59ff]" fill="none" viewBox="0 0 24 24">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>}
              label={t.signOut}
              onPress={() => setShowLogout(true)}
            />
            <Divider />
            <SettingsRow
              icon={<div className={iconBg("bg-red-500/10")}>
                <svg className="size-5 text-red-400" fill="none" viewBox="0 0 24 24">
                  <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>}
              label={t.deleteAccount}
              onPress={() => setShowDeleteAccount(true)}
              danger
            />
          </div>
        </div>

      </div>

      {/* Sheets */}
      {showEditName && (
        <EditNameSheet
          current={userName}
          t={t}
          onClose={() => setShowEditName(false)}
          onSave={(name) => { onUserNameChange(name); setShowEditName(false); }}
        />
      )}
      {showLogout && (
        <LogoutSheet t={t} onClose={() => setShowLogout(false)} onConfirm={onLogout} />
      )}
      {showDeleteAccount && (
        <DeleteAccountSheet
          t={t}
          onClose={() => setShowDeleteAccount(false)}
          onConfirm={handleDeleteAccount}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
