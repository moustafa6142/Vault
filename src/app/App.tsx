import { useState, useEffect, useRef } from "react";
import svgPaths from "../imports/Home/svg-3xb51zsgsn";
import { AddLinkModal } from "./components/AddLinkModal";
import { LinkCard } from "./components/LinkCard";
import { Collection } from "./components/NewCollectionModal";
import { NewCollectionModal } from "./components/NewCollectionModal";
import { CollectionsPage } from "./components/CollectionsPage";
import { CollectionDetailPage } from "./components/CollectionDetailPage";
import { initReminders, getPendingReminders, getFiredReminders, dismissFiredReminder, setReminderCallback, StoredReminder } from "./utils/reminders";
import { SplashScreen } from "./components/SplashScreen";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { SettingsPage } from "./components/SettingsPage";
import { PrivacyPolicyPage } from "./components/PrivacyPolicyPage";
import { LoginPage } from "./components/LoginPage";
import { SignUpPage } from "./components/SignUpPage";
import { RemindersSheet } from "./components/RemindersSheet";
import { ForgotPasswordPage } from "./components/ForgotPasswordPage";
import { OtpVerifyPage } from "./components/OtpVerifyPage";
import { CreateNewPasswordPage } from "./components/CreateNewPasswordPage";
import { projectId, publicAnonKey } from "/utils/supabase/info";

const SERVER = `https://${projectId}.supabase.co/functions/v1/make-server-e14daf12`;

export interface SavedLink {
  id: string;
  url: string;
  title: string;
  note?: string;
  reminder?: string;
  collections?: string[];
  previewImage?: string;
  previewLogo?: string;
  description?: string;
  isFavorite: boolean;
  savedAt: Date;
}

type Page = "home" | "collections" | "settings";
type Filter = "all" | "new" | "fav";
type AuthScreen = "login" | "signup" | "forgot-password" | "otp-verify" | "create-new-password";

function extractDomain(url: string): string {
  try {
    return new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

type Lang = "en" | "ar";

const NAV_LABELS: Record<Lang, { home: string; collections: string; settings: string }> = {
  en: { home: "Home", collections: "Collections", settings: "Settings" },
  ar: { home: "الرئيسية", collections: "المجموعات", settings: "الإعدادات" },
};

function BottomNav({ page, onNavigate, lang }: { page: Page; onNavigate: (p: Page) => void; lang: Lang }) {
  const nav = NAV_LABELS[lang];
  return (
    <div className="flex-shrink-0 px-6 pb-5 pt-2">
      <div className="bg-[#1a1a28] flex items-center justify-around px-4 py-3 rounded-[30px]">
        <button onClick={() => onNavigate("home")} className={`flex items-center gap-2 px-4 py-2 rounded-[30px] transition-colors ${page === "home" ? "bg-[rgba(155,89,255,0.15)]" : ""}`}>
          <svg className="size-[22px]" fill="none" viewBox="0 0 24 24">
            <path d={svgPaths.p27eb6300} stroke={page === "home" ? "#9B59FF" : "#61617F"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
          {page === "home" && <span className="font-['Poppins:Medium',sans-serif] text-[#9b59ff] text-[15px]">{nav.home}</span>}
        </button>

        <button onClick={() => onNavigate("collections")} className={`flex items-center gap-2 px-4 py-2 rounded-[30px] transition-colors ${page === "collections" ? "bg-[rgba(155,89,255,0.15)]" : ""}`}>
          <svg className="size-[22px]" fill="none" viewBox="0 0 24 24">
            <path d={svgPaths.p1352c600} stroke={page === "collections" ? "#9B59FF" : "#61617F"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p2209c100} stroke={page === "collections" ? "#9B59FF" : "#61617F"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p24280c70} stroke={page === "collections" ? "#9B59FF" : "#61617F"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.pb4bb020} stroke={page === "collections" ? "#9B59FF" : "#61617F"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
          {page === "collections" && <span className="font-['Poppins:Medium',sans-serif] text-[#9b59ff] text-[15px]">{nav.collections}</span>}
        </button>

        <button onClick={() => onNavigate("settings")} className={`flex items-center gap-2 px-4 py-2 rounded-[30px] transition-colors ${page === "settings" ? "bg-[rgba(155,89,255,0.15)]" : ""}`}>
          <svg className="size-[22px]" fill="none" viewBox="0 0 24 24">
            <path d={svgPaths.p2dcd6f00} stroke={page === "settings" ? "#9B59FF" : "#61617F"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
          {page === "settings" && <span className="font-['Poppins:Medium',sans-serif] text-[#9b59ff] text-[15px]">{nav.settings}</span>}
        </button>
      </div>
    </div>
  );
}

const HOME_TEXT: Record<Lang, { title: string; subtitle: string; search: string; emptyTitle: string; emptySub: string; emptyBtn: string; showingFav: string; showingNew: string; noResults: string; noResultsSub: string; all: string; new_: string; fav: string }> = {
  en: { title: "Welcome to Vault", subtitle: "Save links. Find them later.", search: "Search your links", emptyTitle: "Your vault is empty", emptySub: "Start by saving your first link.", emptyBtn: "Add your first link", showingFav: "Showing favorites", showingNew: "Showing last 7 days", noResults: "No results found", noResultsSub: "Try a different filter or search", all: "All", new_: "New", fav: "Fav" },
  ar: { title: "مرحباً في Vault", subtitle: "احفظ روابطك. ابحث عنها لاحقاً.", search: "ابحث في روابطك", emptyTitle: "قبوك فارغ", emptySub: "ابدأ بحفظ أول رابط لك.", emptyBtn: "أضف أول رابط", showingFav: "عرض المفضلة", showingNew: "آخر 7 أيام", noResults: "لا توجد نتائج", noResultsSub: "جرّب فلتراً أو بحثاً مختلفاً", all: "الكل", new_: "جديد", fav: "مفضلة" },
};

function EmptyState({ onAdd, lang }: { onAdd: () => void; lang: Lang }) {
  const ht = HOME_TEXT[lang];
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="w-16 h-16 rounded-full bg-[#1a1a28] flex items-center justify-center mb-2">
          <svg className="size-8" fill="none" viewBox="0 0 24 24">
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="#61617F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="#61617F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
        <p className="font-['Poppins:Medium',sans-serif] text-[#e8e8f5] text-[18px]">{ht.emptyTitle}</p>
        <p className="font-['Poppins:Regular',sans-serif] text-[#61617f] text-[12px]">{ht.emptySub}</p>
      </div>
      <button onClick={onAdd} className="bg-gradient-to-b from-[#9b59ff] to-[#7b69ff] flex items-center gap-2 px-6 py-3 rounded-[12px] text-white font-['Poppins:Medium',sans-serif] text-[15px] active:opacity-80 transition-opacity">
        <svg className="size-5" fill="none" viewBox="0 0 24 24">
          <path d="M5 12H19M12 5V19" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </svg>
        {ht.emptyBtn}
      </button>
    </div>
  );
}

function getDomain(url: string): string {
  try { return new URL(url).hostname.replace("www.", ""); } catch { return url; }
}

function ReminderToast({ reminder, lang, onDismiss }: { reminder: StoredReminder; lang: Lang; onDismiss: () => void }) {
  const domain = getDomain(reminder.url);
  const isAr = lang === "ar";

  // No auto-dismiss — user closes manually or opens the link

  return (
    <div className="fixed top-4 left-4 right-4 z-[200] animate-[slideDown_0.35s_ease-out]">
      <div className="bg-[#1a1a28] border border-[#9b59ff]/35 rounded-[20px] p-4 shadow-2xl">
        {/* Top row */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-[12px] bg-[#9b59ff]/15 border border-[#9b59ff]/25 flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`} alt="" className="w-6 h-6 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-['Poppins:SemiBold',sans-serif] text-[#9b59ff] text-[12px]">
              {isAr ? "تذكير Vault 🔗" : "Vault Reminder 🔗"}
            </p>
            <p className="font-['Poppins:Medium',sans-serif] text-[#e8e8f5] text-[13px] line-clamp-1 leading-snug">
              {reminder.title}
            </p>
          </div>
          <button type="button" onClick={onDismiss} className="w-7 h-7 rounded-full bg-[#0f0f18] flex items-center justify-center flex-shrink-0 active:opacity-70">
            <svg className="size-3.5 text-[#61617f]" fill="none" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
            </svg>
          </button>
        </div>
        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => { window.open(reminder.url, "_blank", "noopener,noreferrer"); onDismiss(); }}
            className="flex-1 py-2.5 rounded-[12px] bg-gradient-to-b from-[#9b59ff] to-[#7b69ff] font-['Poppins:SemiBold',sans-serif] text-white text-[13px] active:opacity-80"
          >
            {isAr ? "فتح الرابط" : "Open Link"}
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="flex-1 py-2.5 rounded-[12px] bg-[#0f0f18] border border-[#2a2a3a] font-['Poppins:Medium',sans-serif] text-[#61617f] text-[13px] active:opacity-70"
          >
            {isAr ? "تجاهل" : "Dismiss"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Decode phone from Supabase JWT — email payload is always "{digits}@vault-auth.app"
// JWT uses base64url (- and _), atob needs standard base64 (+ and /)
function phoneFromToken(token: string): string {
  try {
    const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(b64));
    const email: string = payload.email ?? "";
    return email.replace(/@vault-auth\.app$/, "");
  } catch { return ""; }
}

export default function App() {
  // Inject Google AdSense script once on mount
  useEffect(() => {
    if (document.querySelector('script[data-ad-client="ca-pub-9244785945414753"]')) return;
    const s = document.createElement("script");
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9244785945414753";
    s.async = true;
    s.crossOrigin = "anonymous";
    s.setAttribute("data-ad-client", "ca-pub-9244785945414753");
    document.head.appendChild(s);
  }, []);

  const [splashDone, setSplashDone] = useState(false);
  // Show onboarding only on first ever launch — never again after that
  const [onboardingDone, setOnboardingDone] = useState(() => !!localStorage.getItem("vault_onboarding_done"));
  const [authScreen, setAuthScreen] = useState<AuthScreen>("login");
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("vault_lang") as Lang) || "en");

  const handleLangChange = (l: Lang) => {
    setLang(l);
    localStorage.setItem("vault_lang", l);
  };

  // ── Auth state ──────────────────────────────────────────────────────────────
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem("vault_auth_token"));
  const [userId, setUserId] = useState<string | null>(() => localStorage.getItem("vault_user_id"));
  const [loggedIn, setLoggedIn] = useState(() => !!(localStorage.getItem("vault_auth_token") || localStorage.getItem("vault_refresh_token")));
  const [signUpSuccess, setSignUpSuccess] = useState("");
  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotOtpCode, setForgotOtpCode] = useState("");
  const [forgotResetToken, setForgotResetToken] = useState("");

  // ── App data ────────────────────────────────────────────────────────────────
  const [links, setLinks] = useState<SavedLink[]>(() =>
    load<any[]>("vault_links", []).map((l: any) => ({ ...l, savedAt: new Date(l.savedAt) }))
  );
  const [collections, setCollections] = useState<Collection[]>(() =>
    load<any[]>("vault_collections", []).map((c: any) => ({ ...c, createdAt: new Date(c.createdAt) }))
  );
  const [userName, setUserName] = useState<string>(() => load<string>("vault_username", ""));
  const [userPhone, setUserPhone] = useState<string>(() => {
    const token = localStorage.getItem("vault_auth_token");
    if (token) {
      const p = phoneFromToken(token);
      if (p) {
        localStorage.setItem("vault_user_phone", p); // overwrite any stale cached value
        return p;
      }
    }
    return localStorage.getItem("vault_user_phone") ?? "";
  });

  // ── Keyboard detection via focus events (reliable in APK WebView) ────────────
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toUpperCase();
      if (tag === "INPUT" || tag === "TEXTAREA") setKeyboardOpen(true);
    };
    const onFocusOut = () => {
      // Small delay to handle focus moving between inputs (not a real close)
      setTimeout(() => {
        const tag = document.activeElement?.tagName?.toUpperCase();
        if (tag !== "INPUT" && tag !== "TEXTAREA") setKeyboardOpen(false);
      }, 150);
    };
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  // ── UI state ────────────────────────────────────────────────────────────────
  const [page, setPage] = useState<Page>("home");
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [showAddLink, setShowAddLink] = useState(false);
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [showFilter, setShowFilter] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const getReminderCount = () => getPendingReminders().length + getFiredReminders().length;
  const [reminderCount, setReminderCount] = useState(getReminderCount);

  const [activeReminder, setActiveReminder] = useState<StoredReminder | null>(null);

  useEffect(() => {
    setReminderCallback((r) => setActiveReminder(r));
    initReminders();
  }, []);

  // Update reminder badge every minute
  useEffect(() => {
    const t = setInterval(() => setReminderCount(getReminderCount()), 60000);
    return () => clearInterval(t);
  }, []);

  // ── Mobile back gesture — use refs to always read latest state ───────────────
  const authScreenRef = useRef(authScreen);
  const loggedInRef = useRef(loggedIn);
  const pageRef = useRef(page);
  const collectionIdRef = useRef(selectedCollectionId);

  useEffect(() => { authScreenRef.current = authScreen; }, [authScreen]);
  useEffect(() => { loggedInRef.current = loggedIn; }, [loggedIn]);
  useEffect(() => { pageRef.current = page; }, [page]);
  useEffect(() => { collectionIdRef.current = selectedCollectionId; }, [selectedCollectionId]);

  useEffect(() => {
    // Seed one history entry so the first popstate doesn't exit the app
    history.pushState({ vault: true }, "");

    const handlePopState = () => {
      if (loggedInRef.current) {
        // Inside the main app
        if (collectionIdRef.current) {
          setSelectedCollectionId(null);
        } else if (pageRef.current !== "home") {
          setPage("home");
        }
      } else {
        // Auth flow — navigate back
        const s = authScreenRef.current;
        if (s === "signup" || s === "forgot-password") {
          setAuthScreen("login");
        } else if (s === "otp-verify") {
          setAuthScreen("forgot-password");
        } else if (s === "create-new-password") {
          setAuthScreen("otp-verify");
        }
        // If already at login, do nothing (stay in app)
      }
      // Always re-push so the next back gesture is also caught
      history.pushState({ vault: true }, "");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // ── Server helpers ──────────────────────────────────────────────────────────
  const authHeaders = (token: string) => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  });

  const fetchServerData = async (token: string) => {
    try {
      const res = await fetch(`${SERVER}/user/data`, { headers: authHeaders(token) });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.links) && data.links.length > 0) {
        const parsed = data.links
          .map((l: any) => ({ ...l, savedAt: new Date(l.savedAt) }))
          .sort((a: any, b: any) => b.savedAt.getTime() - a.savedAt.getTime());
        setLinks(parsed);
        localStorage.setItem("vault_links", JSON.stringify(parsed));
      }
      if (Array.isArray(data.collections) && data.collections.length > 0) {
        const parsed = data.collections
          .map((c: any) => ({ ...c, createdAt: new Date(c.createdAt) }))
          .sort((a: any, b: any) => a.createdAt.getTime() - b.createdAt.getTime());
        setCollections(parsed);
        localStorage.setItem("vault_collections", JSON.stringify(parsed));
      }
      if (data.name) {
        setUserName(data.name);
        localStorage.setItem("vault_username", data.name);
      }
    } catch (e) {
      console.log("fetchServerData error:", e);
    }
  };

  // ── Token refresh — keeps session alive for weeks ────────────────────────────
  const refreshAuthToken = async (): Promise<string | null> => {
    const rt = localStorage.getItem("vault_refresh_token");
    if (!rt) return null;
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/auth/v1/token?grant_type=refresh_token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "apikey": publicAnonKey, "Authorization": `Bearer ${publicAnonKey}` },
          body: JSON.stringify({ refresh_token: rt }),
        }
      );
      if (!res.ok) return null;
      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem("vault_auth_token", data.access_token);
        if (data.refresh_token) localStorage.setItem("vault_refresh_token", data.refresh_token);
        setAuthToken(data.access_token);
        const p = phoneFromToken(data.access_token);
        if (p) { setUserPhone(p); localStorage.setItem("vault_user_phone", p); }
        return data.access_token;
      }
    } catch { /* network error */ }
    return null;
  };

  // Refresh token every 50 min while logged in (access token lives ~60 min)
  useEffect(() => {
    if (!loggedIn) return;
    const t = setInterval(() => refreshAuthToken(), 50 * 60 * 1000);
    return () => clearInterval(t);
  }, [loggedIn]);

  // On mount: refresh token first, then fetch fresh data
  useEffect(() => {
    const init = async () => {
      let token = localStorage.getItem("vault_auth_token");
      const hasRefresh = !!localStorage.getItem("vault_refresh_token");

      if (!token && !hasRefresh) return;

      // Always try to refresh on startup to get a fresh token
      const refreshed = await refreshAuthToken();
      if (refreshed) token = refreshed;

      if (!token) {
        handleLogout();
        return;
      }

      try {
        const res = await fetch(`${SERVER}/user/data`, { headers: authHeaders(token) });
        if (res.status === 401) {
          handleLogout();
          return;
        }
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data.links) && data.links.length > 0) {
          const parsed = data.links
            .map((l: any) => ({ ...l, savedAt: new Date(l.savedAt) }))
            .sort((a: any, b: any) => b.savedAt.getTime() - a.savedAt.getTime());
          setLinks(parsed);
          localStorage.setItem("vault_links", JSON.stringify(parsed));
        }
        if (Array.isArray(data.collections) && data.collections.length > 0) {
          const parsed = data.collections
            .map((c: any) => ({ ...c, createdAt: new Date(c.createdAt) }))
            .sort((a: any, b: any) => a.createdAt.getTime() - b.createdAt.getTime());
          setCollections(parsed);
          localStorage.setItem("vault_collections", JSON.stringify(parsed));
        }
        if (data.name) {
          setUserName(data.name);
          localStorage.setItem("vault_username", data.name);
        }
      } catch { /* network error — stay logged in with cached data */ }
    };
    init();
  }, []);

  // Debounced sync to server on data changes
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncToServer = (token: string, payload: object) => {
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(async () => {
      try {
        await fetch(`${SERVER}/user/data`, {
          method: "POST",
          headers: authHeaders(token),
          body: JSON.stringify(payload),
        });
      } catch (e) {
        console.log("syncToServer error:", e);
      }
    }, 1500);
  };

  // Persist links locally + sync to server
  useEffect(() => {
    localStorage.setItem("vault_links", JSON.stringify(links));
    if (authToken) syncToServer(authToken, { links });
  }, [links]);

  useEffect(() => {
    localStorage.setItem("vault_collections", JSON.stringify(collections));
    if (authToken) syncToServer(authToken, { collections });
  }, [collections]);

  useEffect(() => {
    localStorage.setItem("vault_username", userName);
    if (authToken) syncToServer(authToken, { name: userName });
  }, [userName]);

  // ── Auth handlers ───────────────────────────────────────────────────────────
  const handleSignIn = async (phone: string, password: string): Promise<string | null> => {
    try {
      const res = await fetch(`${SERVER}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${publicAnonKey}` },
        body: JSON.stringify({ phone, password }),
      });
      let data: any = {};
      try { data = await res.json(); } catch { /* plain text body */ }
      if (!res.ok) return data.error || `Server error (${res.status}). Please try again.`;

      localStorage.setItem("vault_auth_token", data.token);
      if (data.refreshToken) localStorage.setItem("vault_refresh_token", data.refreshToken);
      localStorage.setItem("vault_user_id", data.userId);
      setAuthToken(data.token);
      setUserId(data.userId);
      if (data.fullName) {
        setUserName(data.fullName);
        localStorage.setItem("vault_username", data.fullName);
      }
      // Always derive phone from JWT — never rely on server returning it correctly
      const derivedPhone = phoneFromToken(data.token);
      if (derivedPhone) {
        setUserPhone(derivedPhone);
        localStorage.setItem("vault_user_phone", derivedPhone);
      } else if (data.phone) {
        setUserPhone(data.phone);
        localStorage.setItem("vault_user_phone", data.phone);
      }
      await fetchServerData(data.token);
      setPage("home");
      setLoggedIn(true);
      return null;
    } catch (e) {
      console.log("Sign in error:", e);
      return "Connection error. Check your internet and try again.";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("vault_auth_token");
    localStorage.removeItem("vault_refresh_token");
    localStorage.removeItem("vault_user_id");
    localStorage.removeItem("vault_links");
    localStorage.removeItem("vault_collections");
    localStorage.removeItem("vault_username");
    localStorage.removeItem("vault_user_phone");
    setAuthToken(null);
    setUserId(null);
    setLinks([]);
    setCollections([]);
    setUserName("");
    setUserPhone("");
    setSignUpSuccess("");
    setLoggedIn(false);
  };

  // Soft logout: clears auth but keeps local data — used when changing password from settings
  const handleChangePassword = () => {
    localStorage.removeItem("vault_auth_token");
    localStorage.removeItem("vault_refresh_token");
    localStorage.removeItem("vault_user_id");
    setAuthToken(null);
    setUserId(null);
    setLoggedIn(false);
    setAuthScreen("forgot-password");
  };

  const handleDeleteAccount = async () => {
    if (!authToken) return;
    try {
      await fetch(`${SERVER}/auth/account`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${authToken}` },
      });
    } catch (e) {
      console.log("Delete account error:", e);
    }
    handleLogout();
  };

  const handleSignUp = async (phone: string, _dialCode: string, password: string, fullName: string): Promise<string | null> => {
    try {
      const res = await fetch(`${SERVER}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${publicAnonKey}` },
        body: JSON.stringify({ phone, password, fullName }),
      });
      let data: any = {};
      try { data = await res.json(); } catch { /* plain text body */ }
      if (!res.ok) return data.error || `Server error (${res.status}). Please try again.`;

      // Don't auto-login after signup — redirect to login with success message
      setSignUpSuccess("Account created successfully! Please sign in.");
      setAuthScreen("login");
      return null;
    } catch (e) {
      console.log("Sign up error:", e);
      return "Connection error. Check your internet and try again.";
    }
  };

  const handleSendCode = async (phone: string): Promise<{ code: string } | string> => {
    try {
      const res = await fetch(`${SERVER}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${publicAnonKey}` },
        body: JSON.stringify({ phone }),
      });
      let data: any = {};
      try { data = await res.json(); } catch { /* plain text */ }
      if (!res.ok) return data.error || `Error (${res.status}). Please try again.`;
      return { code: data.code };
    } catch {
      return "Connection error. Please try again.";
    }
  };

  const handleVerifyOtp = async (phone: string, code: string): Promise<string | null> => {
    try {
      const res = await fetch(`${SERVER}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${publicAnonKey}` },
        body: JSON.stringify({ phone, code }),
      });
      let data: any = {};
      try { data = await res.json(); } catch { /* plain text */ }
      if (!res.ok) return data.error || "Verification failed.";
      setForgotResetToken(data.resetToken);
      return null;
    } catch {
      return "Connection error. Please try again.";
    }
  };

  const handleResendOtp = async (): Promise<string> => {
    const result = await handleSendCode(forgotPhone);
    if (typeof result === "string") return "";
    setForgotOtpCode(result.code);
    return result.code;
  };

  const handleResetPassword = async (newPassword: string): Promise<string | null> => {
    try {
      const res = await fetch(`${SERVER}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${publicAnonKey}` },
        body: JSON.stringify({ resetToken: forgotResetToken, newPassword }),
      });
      let data: any = {};
      try { data = await res.json(); } catch { /* plain text */ }
      if (!res.ok) return data.error || `Error (${res.status}). Please try again.`;
      setSignUpSuccess("Password updated! Please sign in with your new password.");
      setAuthScreen("login");
      return null;
    } catch {
      return "Connection error. Please try again.";
    }
  };

  // ── Data handlers ───────────────────────────────────────────────────────────
  const addLink = (
    url: string, title: string, note?: string, reminder?: string,
    collectionIds?: string[], previewImage?: string, previewLogo?: string, description?: string,
  ) => {
    setLinks((prev) => [{
      id: Date.now().toString(), url,
      title: title || extractDomain(url),
      note, reminder, collections: collectionIds,
      previewImage, previewLogo, description,
      isFavorite: false, savedAt: new Date(),
    }, ...prev]);
    setShowAddLink(false);
  };

  const deleteLink = (id: string) => setLinks((prev) => prev.filter((l) => l.id !== id));
  const toggleFavorite = (id: string) =>
    setLinks((prev) => prev.map((l) => l.id === id ? { ...l, isFavorite: !l.isFavorite } : l));
  const addCollection = (col: Collection) => setCollections((prev) => [...prev, col]);
  const deleteCollection = (id: string) => setCollections((prev) => prev.filter((c) => c.id !== id));
  const renameCollection = (id: string, name: string, emoji: string) =>
    setCollections((prev) => prev.map((c) => c.id === id ? { ...c, name, emoji } : c));

  // ── Search + filter ──────────────────────────────────────────────────────────
  const q = searchQuery.toLowerCase();
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const filteredLinks = links
    .filter((l) => !q || l.title.toLowerCase().includes(q) || l.url.toLowerCase().includes(q) || (l.note && l.note.toLowerCase().includes(q)))
    .filter((l) => {
      if (filter === "fav") return l.isFavorite;
      if (filter === "new") return l.savedAt.getTime() >= sevenDaysAgo;
      return true;
    });

  const ht = HOME_TEXT[lang];
  const FILTERS: { key: Filter; label: string }[] = [
    { key: "all", label: ht.all },
    { key: "new", label: ht.new_ },
    { key: "fav", label: ht.fav },
  ];

  // ── Horizontal swipe navigation ───────────────────────────────────────────────
  const MAIN_PAGES: Page[] = ["home", "collections", "settings"];
  const pageIndex = MAIN_PAGES.indexOf(page);

  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartRef2 = useRef<{ x: number; y: number; time: number } | null>(null);
  const swipeDirRef = useRef<"h" | "v" | null>(null);

  const canSwipe = !selectedCollectionId && !showAddLink && !showNewCollection && !showReminders && !showFilter;

  const onTouchStart = (e: React.TouchEvent) => {
    if (!canSwipe) return;
    touchStartRef2.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, time: Date.now() };
    swipeDirRef.current = null;
    setIsDragging(false);
    setDragOffset(0);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef2.current || !canSwipe) return;
    const dx = e.touches[0].clientX - touchStartRef2.current.x;
    const dy = e.touches[0].clientY - touchStartRef2.current.y;

    if (swipeDirRef.current === null) {
      if (Math.abs(dx) > 7 || Math.abs(dy) > 7)
        swipeDirRef.current = Math.abs(dx) >= Math.abs(dy) ? "h" : "v";
      return;
    }
    if (swipeDirRef.current === "v") return;

    // Apply edge resistance
    let eff = dx;
    if (dx > 0 && pageIndex === 0) eff = dx * 0.15;
    if (dx < 0 && pageIndex === MAIN_PAGES.length - 1) eff = dx * 0.15;

    setDragOffset(eff);
    setIsDragging(true);
  };

  const onTouchEnd = () => {
    if (swipeDirRef.current !== "h" || !touchStartRef2.current) {
      setIsDragging(false);
      setDragOffset(0);
      touchStartRef2.current = null;
      swipeDirRef.current = null;
      return;
    }
    const dt = Date.now() - touchStartRef2.current.time;
    const velocity = Math.abs(dragOffset) / Math.max(dt, 1);
    const shouldNav = Math.abs(dragOffset) > 55 || velocity > 0.45;

    if (shouldNav) {
      if (dragOffset < 0 && pageIndex < MAIN_PAGES.length - 1) setPage(MAIN_PAGES[pageIndex + 1]);
      else if (dragOffset > 0 && pageIndex > 0) setPage(MAIN_PAGES[pageIndex - 1]);
    }
    setIsDragging(false);
    setDragOffset(0);
    touchStartRef2.current = null;
    swipeDirRef.current = null;
  };

  return (
    <div className="size-full bg-[#07070f]">
      <div className="bg-[#0f0f18] relative flex flex-col w-full h-full overflow-hidden">
        {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}

        {/* Onboarding — only on first launch, shown once after splash */}
        {splashDone && !onboardingDone && (
          <OnboardingScreen
            onDone={() => {
              localStorage.setItem("vault_onboarding_done", "1");
              setOnboardingDone(true);
            }}
          />
        )}

        {/* Auth screens */}
        {splashDone && onboardingDone && !loggedIn && authScreen === "login" && (
          <LoginPage
            onSignIn={handleSignIn}
            onGoSignUp={() => { setSignUpSuccess(""); setAuthScreen("signup"); }}
            onForgotPassword={() => setAuthScreen("forgot-password")}
            successMessage={signUpSuccess}
          />
        )}
        {splashDone && onboardingDone && !loggedIn && authScreen === "signup" && (
          <SignUpPage onSignUp={handleSignUp} onGoLogin={() => { setSignUpSuccess(""); setAuthScreen("login"); }} />
        )}
        {splashDone && onboardingDone && !loggedIn && authScreen === "forgot-password" && (
          <ForgotPasswordPage
            onBack={() => setAuthScreen("login")}
            onSendCode={handleSendCode}
            onCodeSent={(phone, code) => {
              setForgotPhone(phone);
              setForgotOtpCode(code);
              setAuthScreen("otp-verify");
            }}
          />
        )}
        {splashDone && onboardingDone && !loggedIn && authScreen === "otp-verify" && (
          <OtpVerifyPage
            phone={forgotPhone}
            otpCode={forgotOtpCode}
            onBack={() => setAuthScreen("forgot-password")}
            onVerify={handleVerifyOtp}
            onResend={handleResendOtp}
            onVerified={() => setAuthScreen("create-new-password")}
          />
        )}
        {splashDone && onboardingDone && !loggedIn && authScreen === "create-new-password" && (
          <CreateNewPasswordPage
            onBack={() => setAuthScreen("otp-verify")}
            onUpdate={handleResetPassword}
          />
        )}

        {/* Main app */}
        {splashDone && onboardingDone && loggedIn && (
          <>
            {/* ── Swipeable 3-page container ── */}
            <div
              className="flex-1 overflow-hidden relative"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onTouchCancel={onTouchEnd}
            >
              {/* Flex row: Home | Collections | Settings */}
              <div
                className="flex h-full"
                style={{
                  width: "300%",
                  transform: `translateX(calc(${-pageIndex * 33.3334}% + ${isDragging ? dragOffset : 0}px))`,
                  transition: isDragging ? "none" : "transform 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  willChange: "transform",
                }}
              >
                {/* ── HOME ── */}
                <div className="flex flex-col relative overflow-hidden" style={{ width: "33.3334%" }}>
                  {/* Header */}
                  <div className="flex-shrink-0 px-4 pt-6 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-0.5">
                        <p className="font-['Poppins:SemiBold',sans-serif] text-[#e8e8f5] text-[24px]">{ht.title}</p>
                        <p className="font-['Poppins:Regular',sans-serif] text-[#61617f] text-[14px]">{ht.subtitle}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowReminders(true)}
                        className="relative w-10 h-10 rounded-[12px] bg-[#1a1a28] flex items-center justify-center active:opacity-70 transition-opacity flex-shrink-0"
                      >
                        <svg className="size-[22px]" fill="none" viewBox="0 0 24 24">
                          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={reminderCount > 0 ? "#9b59ff" : "#61617f"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                          <path d="M13.73 21a2 2 0 01-3.46 0" stroke={reminderCount > 0 ? "#9b59ff" : "#61617f"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                        </svg>
                        {reminderCount > 0 && (
                          <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-[#9b59ff] flex items-center justify-center px-1">
                            <span className="font-['Poppins:SemiBold',sans-serif] text-white text-[10px]">{reminderCount}</span>
                          </div>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Search + filter */}
                  {links.length > 0 && (
                    <div className="flex-shrink-0 px-4 pb-3">
                      <div className="flex items-center bg-[#1a1a28] rounded-[14px] px-4 py-3 gap-3">
                        <svg className="size-4 text-[#61617f] flex-shrink-0" fill="none" viewBox="0 0 24 24">
                          <path d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                        </svg>
                        <input
                          className="flex-1 bg-transparent outline-none font-['Poppins:Regular',sans-serif] text-[#e8e8f5] text-[13px] placeholder:text-[#3a3a50]"
                          placeholder={ht.search}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery ? (
                          <button onClick={() => setSearchQuery("")}>
                            <svg className="size-4 text-[#61617f]" fill="none" viewBox="0 0 24 24">
                              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
                            </svg>
                          </button>
                        ) : (
                          <button onClick={() => setShowFilter((v) => !v)}>
                            <svg className="size-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" style={{ color: filter !== "all" ? "#9b59ff" : "#61617f" }}>
                              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                            </svg>
                          </button>
                        )}
                      </div>
                      {showFilter && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowFilter(false)} />
                          <div className="relative z-50 mt-2 flex gap-2">
                            {FILTERS.map(({ key, label }) => (
                              <button key={key} onClick={() => { setFilter(key); setShowFilter(false); }}
                                className={`flex-1 py-2.5 rounded-[12px] font-['Poppins:Medium',sans-serif] text-[13px] transition-all ${filter === key ? "bg-gradient-to-b from-[#9b59ff] to-[#7b69ff] text-white" : "bg-[#1a1a28] text-[#61617f]"}`}>
                                {label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                      {filter !== "all" && !showFilter && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="font-['Poppins:Regular',sans-serif] text-[#9b59ff] text-[12px]">
                            {filter === "fav" ? ht.showingFav : ht.showingNew}
                          </span>
                          <button onClick={() => setFilter("all")}>
                            <svg className="size-3.5 text-[#9b59ff]" fill="none" viewBox="0 0 24 24">
                              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Links */}
                  {links.length === 0 ? (
                    <EmptyState onAdd={() => setShowAddLink(true)} lang={lang} />
                  ) : (
                    <div className="flex-1 overflow-y-auto px-3 pb-6">
                      {filteredLinks.length === 0 ? (
                        <div className="pt-20 flex flex-col items-center gap-2">
                          <p className="font-['Poppins:Medium',sans-serif] text-[#61617f] text-[15px]">{ht.noResults}</p>
                          <p className="font-['Poppins:Regular',sans-serif] text-[#3a3a50] text-[12px]">{ht.noResultsSub}</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-x-3 gap-y-5 pt-1">
                          {filteredLinks.map((link) => (
                            <LinkCard key={link.id} link={link} collections={collections} onDelete={deleteLink} onToggleFavorite={toggleFavorite} compact />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* FAB */}
                  {links.length > 0 && !keyboardOpen && (
                    <button
                      onClick={() => setShowAddLink(true)}
                      className="absolute bottom-4 right-4 z-[60] bg-gradient-to-b from-[#9b59ff] to-[#7b69ff] p-4 rounded-[18px] shadow-xl active:opacity-80 transition-opacity"
                    >
                      <svg className="size-6" fill="none" viewBox="0 0 24 24">
                        <path d="M5 12H19M12 5V19" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* ── COLLECTIONS ── */}
                <div className="flex flex-col overflow-hidden" style={{ width: "33.3334%" }}>
                  <CollectionsPage
                    links={links} collections={collections}
                    onNewCollection={() => setShowNewCollection(true)}
                    onOpenCollection={(id) => setSelectedCollectionId(id)}
                  />
                </div>

                {/* ── SETTINGS ── */}
                <div className="flex flex-col overflow-hidden" style={{ width: "33.3334%" }}>
                  <SettingsPage userName={userName} onUserNameChange={setUserName} userPhone={userPhone} onLogout={handleLogout} onDeleteAccount={handleDeleteAccount} onChangePassword={handleChangePassword} onPrivacyPolicy={() => setShowPrivacyPolicy(true)} lang={lang} onLangChange={handleLangChange} />
                </div>
              </div>

              {/* Privacy Policy overlay */}
              {showPrivacyPolicy && (
                <PrivacyPolicyPage onBack={() => setShowPrivacyPolicy(false)} lang={lang} />
              )}

              {/* Collection detail — absolute overlay */}
              {selectedCollectionId && (
                <div className="absolute inset-0" style={{ background: "#0f0f18" }}>
                  <CollectionDetailPage
                    collection={collections.find((c) => c.id === selectedCollectionId)!}
                    links={links} collections={collections}
                    onBack={() => setSelectedCollectionId(null)}
                    onDelete={deleteLink} onToggleFavorite={toggleFavorite}
                    onDeleteCollection={deleteCollection} onRenameCollection={renameCollection}
                  />
                </div>
              )}
            </div>

            {/* Bottom nav — hidden while keyboard is open or on inner pages */}
            {!selectedCollectionId && !keyboardOpen && !showPrivacyPolicy && (
              <BottomNav page={page} onNavigate={(p) => { setPage(p); setSelectedCollectionId(null); }} lang={lang} />
            )}

            {/* Modals / sheets */}
            {activeReminder && (
              <ReminderToast
                reminder={activeReminder}
                lang={lang}
                onDismiss={() => { setActiveReminder(null); setReminderCount(getReminderCount()); }}
              />
            )}

            {showAddLink && (
              <AddLinkModal
                onClose={() => setShowAddLink(false)}
                onSave={(...args) => { addLink(...args); setReminderCount(getPendingReminders().length); }}
                collections={collections}
                onAddCollection={addCollection}
                lang={lang}
              />
            )}
            {showNewCollection && (
              <NewCollectionModal onClose={() => setShowNewCollection(false)} onCreate={(col) => { addCollection(col); setShowNewCollection(false); }} />
            )}
            {showReminders && (
              <RemindersSheet
                onClose={() => setShowReminders(false)}
                onChanged={() => setReminderCount(getReminderCount())}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
