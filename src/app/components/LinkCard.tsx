import { useState } from "react";
import { SavedLink } from "../App";
import { Collection } from "./NewCollectionModal";

interface LinkCardProps {
  link: SavedLink;
  collections: Collection[];
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  compact?: boolean;
}

function getRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "1d";
  return `${days}d`;
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

// ── Shared menu ───────────────────────────────────────────────────────────────
function CardMenu({ onOpen, onDelete, onClose }: { onOpen: () => void; onDelete: () => void; onClose: () => void }) {
  return (
    <div className="absolute right-0 top-7 z-50 bg-[#13131f] border border-[#2a2a3a] rounded-[12px] overflow-hidden w-32 shadow-xl">
      <button
        onClick={() => { onOpen(); onClose(); }}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-[#e8e8f5] font-['Poppins:Regular',sans-serif] text-[13px] active:bg-[#1a1a28]"
      >
        <svg className="size-3.5" fill="none" viewBox="0 0 24 24">
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M15 3h6v6M10 14L21 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </svg>
        Open
      </button>
      <div className="h-px bg-[#2a2a3a]" />
      <button
        onClick={() => { onDelete(); onClose(); }}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-red-400 font-['Poppins:Regular',sans-serif] text-[13px] active:bg-[#1a1a28]"
      >
        <svg className="size-3.5" fill="none" viewBox="0 0 24 24">
          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </svg>
        Delete
      </button>
    </div>
  );
}

// ── Compact card (2-column grid) ──────────────────────────────────────────────
function CompactCard({ link, collections, onDelete, onToggleFavorite }: LinkCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const [copied, setCopied] = useState(false);

  const domain = getDomain(link.url);
  const linkCollections = collections.filter((c) => link.collections?.includes(c.id));
  const firstCollection = linkCollections[0];

  const handleOpen = () => window.open(link.url, "_blank", "noopener,noreferrer");

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: link.title, url: link.url }); return; } catch { }
    }
    try {
      await navigator.clipboard.writeText(link.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { }
  };

  return (
    <>
      {menuOpen && <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />}

      <div className="bg-[#1a1a28] rounded-[18px] border border-[#232336] flex flex-col relative">

        {/* Preview image — overflow-hidden scoped to image only so dropdown isn't clipped */}
        <div className="overflow-hidden rounded-t-[18px]">
          {link.previewImage && !imgFailed ? (
            <img
              src={link.previewImage}
              alt={link.title}
              className="w-full h-[130px] object-cover"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="h-[130px] bg-gradient-to-br from-[#1e1e35] to-[#13131f] flex flex-col items-center justify-center gap-1.5">
              <img
                src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
                alt=""
                className="w-8 h-8 object-contain opacity-70"
              />
              <p className="font-['Poppins:Regular',sans-serif] text-[#3a3a50] text-[10px] truncate px-2 max-w-full">
                {domain}
              </p>
            </div>
          )}
        </div>

        {/* 3-dot — absolute to card (outside image overflow) so dropdown isn't clipped */}
        <div className="absolute top-2 right-2 z-50">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
          >
            <svg className="size-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="5" cy="12" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="19" cy="12" r="1.5" />
            </svg>
          </button>
          {menuOpen && <CardMenu onOpen={handleOpen} onDelete={() => onDelete(link.id)} onClose={() => setMenuOpen(false)} />}
        </div>

        {/* Favorite badge */}
        {link.isFavorite && (
          <div className="absolute top-2 left-2 z-50 w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <svg className="size-3 text-red-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </div>
        )}

        {/* Content */}
        <div className="px-3 pt-2.5 pb-3 flex flex-col flex-1">

          {/* Collection chip */}
          {firstCollection && (
            <div className="flex items-center gap-1 self-start bg-[#9b59ff]/12 border border-[#9b59ff]/25 px-2 py-0.5 rounded-full mb-2">
              <span className="text-[9px]">{firstCollection.emoji}</span>
              <span className="font-['Poppins:Medium',sans-serif] text-[#9b59ff] text-[9px] max-w-[70px] truncate">
                {firstCollection.name}
              </span>
            </div>
          )}

          {/* Title */}
          <p className="font-['Poppins:SemiBold',sans-serif] text-[#e8e8f5] text-[13px] leading-snug line-clamp-2">
            {link.title}
          </p>

          {/* Note */}
          {(link.note || link.description) && (
            <p className="font-['Poppins:Regular',sans-serif] text-[#61617f] text-[11px] line-clamp-1 leading-snug mt-1">
              {link.note || link.description}
            </p>
          )}

          {/* Spacer — pushes footer to bottom regardless of content length */}
          <div className="flex-1" />

          {/* Footer */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              {link.reminder && (
                <svg className="size-3 text-[#9b59ff]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22c1.1 0 2-.9 2-2H10c0 1.1.9 2 2 2zm6-6V11c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                </svg>
              )}
              <button onClick={handleShare} className="active:opacity-60">
                {copied ? (
                  <svg className="size-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                  </svg>
                ) : (
                  <svg className="size-3.5 text-[#61617f]" fill="none" viewBox="0 0 24 24">
                    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                )}
              </button>
              <button onClick={() => onToggleFavorite(link.id)} className="active:opacity-60">
                {link.isFavorite ? (
                  <svg className="size-3.5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                ) : (
                  <svg className="size-3.5 text-[#61617f]" fill="none" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                )}
              </button>
            </div>

            <button
              onClick={handleOpen}
              className="flex items-center gap-1 bg-[#9b59ff] px-2.5 py-1 rounded-full active:opacity-80"
            >
              <span className="font-['Poppins:Medium',sans-serif] text-white text-[11px]">Open</span>
              <svg className="size-2.5" fill="none" viewBox="0 0 24 24">
                <path d="M15 3h6v6M10 14L21 3" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>
          </div>

          {/* Time */}
          <div className="flex items-center gap-1 mt-1.5">
            <svg className="size-3 text-[#2a2a3a]" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 6v6l4 2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
            </svg>
            <span className="font-['Poppins:Regular',sans-serif] text-[#2a2a3a] text-[10px]">
              {getRelativeTime(link.savedAt)} ago
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Full card (single column — used in collections detail etc.) ───────────────
export function LinkCard({ link, collections, onDelete, onToggleFavorite, compact }: LinkCardProps) {
  if (compact) {
    return <CompactCard link={link} collections={collections} onDelete={onDelete} onToggleFavorite={onToggleFavorite} />;
  }

  const [menuOpen, setMenuOpen] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const [copied, setCopied] = useState(false);

  const domain = getDomain(link.url);
  const linkCollections = collections.filter((c) => link.collections?.includes(c.id));
  const firstCollection = linkCollections[0];

  const handleOpen = () => window.open(link.url, "_blank", "noopener,noreferrer");

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: link.title, url: link.url }); return; } catch { }
    }
    try {
      await navigator.clipboard.writeText(link.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { }
  };

  return (
    <>
      {menuOpen && <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />}

      <div className="bg-[#1a1a28] rounded-[20px] border border-[#232336]">
        <div className="flex items-center justify-end px-3 pt-3 pb-2">
          <div className="relative">
            <button onClick={() => setMenuOpen((v) => !v)} className="text-[#61617f] p-1">
              <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="5" cy="12" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="19" cy="12" r="1.5" />
              </svg>
            </button>
            {menuOpen && <CardMenu onOpen={handleOpen} onDelete={() => onDelete(link.id)} onClose={() => setMenuOpen(false)} />}
          </div>
        </div>

        <div className="overflow-hidden">
          {link.previewImage && !imgFailed ? (
            <img src={link.previewImage} alt={link.title} className="w-full h-[170px] object-cover" onError={() => setImgFailed(true)} />
          ) : (
            <div className="h-[90px] bg-gradient-to-br from-[#1e1e35] to-[#13131f] flex items-center justify-center gap-3 border-t border-b border-[#232336]">
              <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} alt="" className="w-10 h-10 object-contain opacity-60" />
              <p className="font-['Poppins:Regular',sans-serif] text-[#3a3a50] text-[13px] truncate max-w-[200px]">{domain}</p>
            </div>
          )}
        </div>

        <div className="px-4 pt-3 pb-4">
          <div className="flex items-center justify-between mb-2.5">
            {firstCollection ? (
              <div className="flex items-center gap-1.5 bg-[#9b59ff]/15 border border-[#9b59ff]/30 px-3 py-1 rounded-full">
                <span className="text-[12px]">{firstCollection.emoji}</span>
                <span className="font-['Poppins:Medium',sans-serif] text-[#9b59ff] text-[11px]">{firstCollection.name}</span>
              </div>
            ) : <div />}
            <div className="flex items-center gap-3.5">
              {link.reminder && (
                <svg className="size-[18px] text-[#9b59ff]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22c1.1 0 2-.9 2-2H10c0 1.1.9 2 2 2zm6-6V11c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                </svg>
              )}
              <button onClick={handleShare} className="active:opacity-60 transition-opacity">
                {copied ? (
                  <svg className="size-[18px] text-emerald-400" fill="none" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                ) : (
                  <svg className="size-[18px] text-[#61617f]" fill="none" viewBox="0 0 24 24">
                    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                )}
              </button>
              <button onClick={() => onToggleFavorite(link.id)} className="active:opacity-60 transition-opacity">
                {link.isFavorite ? (
                  <svg className="size-[18px] text-red-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                ) : (
                  <svg className="size-[18px] text-[#61617f]" fill="none" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <p className="font-['Poppins:SemiBold',sans-serif] text-[#e8e8f5] text-[17px] leading-snug">{link.title}</p>

          {(link.note || link.description) && (
            <p className="font-['Poppins:Regular',sans-serif] text-[#61617f] text-[13px] mt-1 line-clamp-2 leading-snug">
              {link.note || link.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1.5">
              <svg className="size-3.5 text-[#3a3a50]" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 6v6l4 2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
              </svg>
              <span className="font-['Poppins:Regular',sans-serif] text-[#3a3a50] text-[11px]">
                Saved {getRelativeTime(link.savedAt)} ago
              </span>
            </div>
            <button onClick={handleOpen} className="flex items-center gap-1.5 bg-[#9b59ff] px-4 py-1.5 rounded-full active:opacity-80 transition-opacity">
              <span className="font-['Poppins:Medium',sans-serif] text-white text-[13px]">Open</span>
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
