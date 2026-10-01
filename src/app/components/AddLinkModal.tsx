import { useState, useEffect, useRef } from "react";
import { NewCollectionModal, Collection } from "./NewCollectionModal";
import { scheduleReminder } from "../utils/reminders";

type Lang = "en" | "ar";

interface AddToVaultProps {
  onClose: () => void;
  onSave: (url: string, title: string, note?: string, reminder?: string, collectionIds?: string[], previewImage?: string, previewLogo?: string, description?: string) => void;
  collections: Collection[];
  onAddCollection: (col: Collection) => void;
  lang?: Lang;
}

interface LinkPreview {
  title?: string;
  description?: string;
  image?: string;
  logo?: string;
}

const T = {
  en: {
    header: "Add to Vault",
    urlLabel: "Paste Your Link",
    urlPlaceholder: "https://..",
    titleLabel: "Custom Title",
    titlePlaceholder: "Title here...",
    noteLabel: "Add Note",
    notePlaceholder: "Why are you saving this?",
    collectionsLabel: "Select Collections",
    newCollection: "New",
    reminderLabel: "Set a Reminder",
    saveBtn: "Save to Vault",
    urlRequired: "Please enter a URL",
    urlInvalid: "Please enter a valid URL",
    reminders: { "10m": "In 10 Min", "1h": "In 1 Hour", "3h": "In 3 Hours", "tomorrow": "Tomorrow", "weekend": "This Weekend" } as Record<string, string>,
    reminderConfirm: { "10m": "in 10 minutes", "1h": "in 1 hour", "3h": "in 3 hours", "tomorrow": "tomorrow at 9am", "weekend": "this weekend at 9am" } as Record<string, string>,
    reminderSet: "✓ You'll be reminded",
  },
  ar: {
    header: "أضف إلى Vault",
    urlLabel: "الصق رابطك",
    urlPlaceholder: "https://..",
    titleLabel: "عنوان مخصص",
    titlePlaceholder: "العنوان هنا...",
    noteLabel: "إضافة ملاحظة",
    notePlaceholder: "لماذا تحفظ هذا؟",
    collectionsLabel: "اختر المجموعات",
    newCollection: "جديد",
    reminderLabel: "ضبط تذكير",
    saveBtn: "حفظ في Vault",
    urlRequired: "الرجاء إدخال رابط",
    urlInvalid: "الرجاء إدخال رابط صحيح",
    reminders: { "10m": "خلال 10 دقائق", "1h": "خلال ساعة", "3h": "خلال 3 ساعات", "tomorrow": "غداً", "weekend": "هذا الويكند" } as Record<string, string>,
    reminderConfirm: { "10m": "خلال 10 دقائق", "1h": "خلال ساعة", "3h": "خلال 3 ساعات", "tomorrow": "غداً الساعة 9", "weekend": "هذا الويكند الساعة 9" } as Record<string, string>,
    reminderSet: "✓ سيتم تذكيرك",
  },
} as const;

const REMINDER_VALUES = ["10m", "1h", "3h", "tomorrow", "weekend"];

function isValidUrl(str: string): boolean {
  try { new URL(str.startsWith("http") ? str : `https://${str}`); return true; } catch { return false; }
}

function getDomain(url: string): string {
  try { return new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace("www.", ""); } catch { return url; }
}

function PreviewSkeleton() {
  return (
    <div className="bg-[#13131f] border border-[#2a2a3a] rounded-[14px] overflow-hidden animate-pulse">
      <div className="h-[110px] bg-[#1a1a28]" />
      <div className="p-3 flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-[#2a2a3a] flex-shrink-0" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="h-3 bg-[#2a2a3a] rounded w-3/4" />
          <div className="h-2.5 bg-[#2a2a3a] rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

function LinkPreviewCard({ preview, url }: { preview: LinkPreview; url: string }) {
  const [imgFailed, setImgFailed] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const domain = getDomain(url);
  return (
    <div className="bg-[#13131f] border border-[#2a2a3a] rounded-[14px] overflow-hidden">
      {preview.image && !imgFailed && (
        <div className="h-[110px] bg-[#1a1a28] overflow-hidden">
          <img src={preview.image} alt="" className="w-full h-full object-cover" onError={() => setImgFailed(true)} />
        </div>
      )}
      <div className="px-3 py-2.5 flex items-start gap-2.5">
        <div className="w-6 h-6 rounded-md bg-[#1a1a28] flex items-center justify-center flex-shrink-0 overflow-hidden mt-0.5">
          {preview.logo && !logoFailed ? (
            <img src={preview.logo} alt="" className="w-full h-full object-contain" onError={() => setLogoFailed(true)} />
          ) : (
            <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`} alt="" className="w-4 h-4 object-contain" />
          )}
        </div>
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          {preview.title && <p className="font-['Poppins:Medium',sans-serif] text-[#e8e8f5] text-[12px] line-clamp-2 leading-tight">{preview.title}</p>}
          {preview.description && <p className="font-['Poppins:Regular',sans-serif] text-[#61617f] text-[11px] line-clamp-2 leading-snug">{preview.description}</p>}
          <p className="font-['Poppins:Regular',sans-serif] text-[#9b59ff] text-[11px] mt-0.5">{domain}</p>
        </div>
      </div>
    </div>
  );
}

const PROXIES = [
  (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
  (u: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
];

function withTimeout(ms: number): AbortSignal {
  const c = new AbortController();
  setTimeout(() => c.abort(), ms);
  return c.signal;
}

function getYouTubeId(u: string): string | null {
  try {
    const x = new URL(u);
    const host = x.hostname.replace(/^(www\.|m\.|music\.)/, "");
    if (host === "youtu.be") return x.pathname.slice(1).split("/")[0] || null;
    if (host === "youtube.com" || host === "youtube-nocookie.com") {
      if (x.pathname === "/watch") return x.searchParams.get("v");
      const m = x.pathname.match(/^\/(shorts|embed|live|v)\/([\w-]{6,})/);
      if (m) return m[2];
    }
  } catch { /* ignore */ }
  return null;
}

function faviconFor(u: string): string {
  return `https://www.google.com/s2/favicons?sz=128&domain_url=${encodeURIComponent(u)}`;
}

function abs(base: string, v?: string | null): string | undefined {
  if (!v) return undefined;
  try { return new URL(v, base).toString(); } catch { return undefined; }
}

async function viaMicrolink(u: string): Promise<LinkPreview | null> {
  const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(u)}`, { signal: withTimeout(8000) });
  const data = await res.json();
  if (data.status !== "success") return null;
  return {
    title: data.data.title ?? undefined,
    description: data.data.description ?? undefined,
    image: data.data.image?.url ?? undefined,
    logo: data.data.logo?.url ?? undefined,
  };
}

async function viaOEmbed(u: string): Promise<LinkPreview | null> {
  const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(u)}`, { signal: withTimeout(6000) });
  const d = await res.json();
  if (!d || d.error) return null;
  return { title: d.title, description: d.author_name ? d.author_name : undefined, image: d.thumbnail_url };
}

async function viaHtml(u: string): Promise<LinkPreview | null> {
  for (const mk of PROXIES) {
    try {
      const res = await fetch(mk(u), { signal: withTimeout(7000) });
      if (!res.ok) continue;
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const meta = (k: string) =>
        doc.querySelector(`meta[property="${k}"], meta[name="${k}"]`)?.getAttribute("content") || undefined;
      const title = meta("og:title") || meta("twitter:title") || doc.title || undefined;
      const image = abs(u, meta("og:image") || meta("twitter:image") || meta("twitter:image:src"));
      const icon = abs(u, doc.querySelector('link[rel~="icon"]')?.getAttribute("href"));
      if (title || image) {
        return { title, description: meta("og:description") || meta("description"), image, logo: icon };
      }
    } catch { /* try next proxy */ }
  }
  return null;
}

async function fetchPreview(u: string): Promise<LinkPreview> {
  const yt = getYouTubeId(u);
  const base: LinkPreview = { logo: faviconFor(u) };
  if (yt) base.image = `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`;

  const attempts: Array<() => Promise<LinkPreview | null>> = yt
    ? [() => viaOEmbed(u), () => viaMicrolink(u), () => viaHtml(u)]
    : [() => viaMicrolink(u), () => viaHtml(u), () => viaOEmbed(u)];

  let merged: LinkPreview = { ...base };
  for (const run of attempts) {
    try {
      const r = await run();
      if (r) {
        merged = {
          title: r.title || merged.title,
          description: r.description || merged.description,
          image: r.image || merged.image,
          logo: r.logo || merged.logo,
        };
        if (merged.title && merged.image) break;
      }
    } catch { /* next provider */ }
  }
  if (!merged.title) merged.title = getDomain(u);
  return merged;
}

export function AddLinkModal({ onClose, onSave, collections, onAddCollection, lang = "en" }: AddToVaultProps) {
  const t = T[lang];

  const [url, setUrl]                   = useState("");
  const [title, setTitle]               = useState("");
  const [note, setNote]                 = useState("");
  const [reminder, setReminder]         = useState<string | null>(null);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [showNewCollection, setShowNewCollection]     = useState(false);
  const [urlError, setUrlError]         = useState("");
  const [preview, setPreview]           = useState<LinkPreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const debounceRef        = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = url.trim();
    if (!trimmed || !isValidUrl(trimmed)) { setPreview(null); setPreviewLoading(false); return; }
    setPreviewLoading(true);
    let cancelled = false;
    debounceRef.current = setTimeout(async () => {
      const normalized = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
      const p = await fetchPreview(normalized);
      if (cancelled) return;
      setPreview(p);
      setPreviewLoading(false);
    }, 500);
    return () => { cancelled = true; if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [url]);

  const handleUrlChange = (val: string) => {
    setUrl(val);
    if (urlError) setUrlError("");
  };

  // Reminders no longer need Notification permission — uses in-app toast system
  const handleReminderToggle = (value: string) => {
    setReminder((prev) => (prev === value ? null : value));
  };

  const handleSave = async () => {
    const trimmed = url.trim();
    if (!trimmed) { setUrlError(t.urlRequired); return; }
    if (!isValidUrl(trimmed)) { setUrlError(t.urlInvalid); return; }

    const normalized  = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
    const finalTitle  = title.trim() || getDomain(normalized);

    if (reminder) await scheduleReminder(finalTitle, normalized, reminder);

    onSave(normalized, finalTitle, note.trim(), reminder ?? undefined, selectedCollections, preview?.image, preview?.logo, preview?.description);
  };

  const handleCollectionToggle = (id: string) =>
    setSelectedCollections((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);

  const handleCreateCollection = (col: Collection) => {
    onAddCollection(col);
    setSelectedCollections((prev) => [...prev, col.id]);
    setShowNewCollection(false);
  };

  return (
    <div className="absolute inset-0 bg-[#0f0f18] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 pt-6 pb-3 border-b border-[#1e1e2e]">
        <button type="button" onClick={onClose} className="w-9 h-9 rounded-[10px] bg-[#1a1a28] flex items-center justify-center active:opacity-70 transition-opacity">
          <svg className="size-5" fill="none" viewBox="0 0 24 24">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="#e8e8f5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </button>
        <p className="font-['Poppins:SemiBold',sans-serif] text-[#e8e8f5] text-[20px]">{t.header}</p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-5">

        {/* URL field */}
        <div className="flex flex-col gap-2">
          <p className="font-['Poppins:Medium',sans-serif] text-[#e8e8f5] text-[14px]">{t.urlLabel}</p>
          <div className={`flex items-center bg-[#1a1a28] rounded-[14px] px-3 py-3 border ${urlError ? "border-red-500/50" : "border-transparent"}`}>
            <svg className="size-4 text-[#61617f] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
            <input
              className="flex-1 bg-transparent outline-none font-['Poppins:Regular',sans-serif] text-[#e8e8f5] text-[13px] placeholder:text-[#3a3a50] min-w-0"
              placeholder={t.urlPlaceholder}
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              autoFocus
              inputMode="url"
              autoCapitalize="none"
              autoCorrect="off"
              onPaste={(e) => {
                const pasted = e.clipboardData?.getData("text") ?? "";
                if (pasted.trim()) { e.preventDefault(); handleUrlChange(pasted.trim()); }
              }}
            />
          </div>
          {urlError && <p className="font-['Poppins:Regular',sans-serif] text-red-400 text-[11px]">{urlError}</p>}
          {previewLoading && <PreviewSkeleton />}
          {!previewLoading && preview && <LinkPreviewCard preview={preview} url={url} />}
        </div>

        {/* Custom Title */}
        <div className="flex flex-col gap-2">
          <p className="font-['Poppins:Medium',sans-serif] text-[#e8e8f5] text-[14px]">{t.titleLabel}</p>
          <div className="bg-[#1a1a28] rounded-[14px] px-4 py-3 border border-transparent focus-within:border-[#9b59ff]/30 transition-colors">
            <input
              className="w-full bg-transparent outline-none font-['Poppins:Regular',sans-serif] text-[#e8e8f5] text-[13px] placeholder:text-[#3a3a50]"
              placeholder={t.titlePlaceholder}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>

        {/* Add Note */}
        <div className="flex flex-col gap-2">
          <p className="font-['Poppins:Medium',sans-serif] text-[#e8e8f5] text-[14px]">{t.noteLabel}</p>
          <div className="bg-[#1a1a28] rounded-[14px] px-4 py-3 border border-transparent focus-within:border-[#9b59ff]/30 transition-colors">
            <textarea
              className="w-full bg-transparent outline-none font-['Poppins:Regular',sans-serif] text-[#e8e8f5] text-[13px] placeholder:text-[#3a3a50] resize-none h-[90px]"
              placeholder={t.notePlaceholder}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        {/* Select Collections */}
        <div className="flex flex-col gap-3">
          <p className="font-['Poppins:Medium',sans-serif] text-[#e8e8f5] text-[14px]">{t.collectionsLabel}</p>
          <div className="flex flex-wrap gap-2">
            {collections.map((col) => (
              <button
                key={col.id}
                type="button"
                onClick={() => handleCollectionToggle(col.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full border font-['Poppins:Medium',sans-serif] text-[13px] transition-all active:opacity-80 ${
                  selectedCollections.includes(col.id)
                    ? "border-[#9b59ff] text-[#9b59ff] bg-[#9b59ff]/10"
                    : "border-[#2a2a3a] text-[#61617f]"
                }`}
              >
                <span>{col.emoji}</span>{col.name}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowNewCollection(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-dashed border-[#61617f] font-['Poppins:Medium',sans-serif] text-[#61617f] text-[13px] active:opacity-70 transition-opacity"
            >
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24">
                <path d="M5 12H19M12 5V19" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
              </svg>
              {t.newCollection}
            </button>
          </div>
        </div>

        {/* Set a Reminder */}
        <div className="flex flex-col gap-3">
          <p className="font-['Poppins:Medium',sans-serif] text-[#e8e8f5] text-[14px]">{t.reminderLabel}</p>
          <div className="flex flex-wrap gap-2">
            {REMINDER_VALUES.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleReminderToggle(val)}
                className={`px-4 py-2 rounded-full border font-['Poppins:Regular',sans-serif] text-[13px] transition-all active:opacity-80 ${
                  reminder === val
                    ? "border-[#9b59ff] text-[#9b59ff] bg-[#9b59ff]/10"
                    : "border-[#2a2a3a] text-[#61617f]"
                }`}
              >
                {t.reminders[val]}
              </button>
            ))}
          </div>
          {reminder && (
            <p className="font-['Poppins:Regular',sans-serif] text-[#9b59ff] text-[11px]">
              {t.reminderSet} {t.reminderConfirm[reminder]}
            </p>
          )}
        </div>

        {/* Save button — inside scroll area so it stays below content and doesn't float above keyboard */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full py-4 rounded-[16px] bg-gradient-to-b from-[#9b59ff] to-[#7b69ff] font-['Poppins:SemiBold',sans-serif] text-white text-[16px] active:opacity-80 transition-opacity mt-2 mb-2"
        >
          {t.saveBtn}
        </button>
      </div>

      {showNewCollection && (
        <NewCollectionModal onClose={() => setShowNewCollection(false)} onCreate={handleCreateCollection} />
      )}
    </div>
  );
}
