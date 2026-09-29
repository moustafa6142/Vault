import { useState } from "react";
import { SavedLink } from "../App";
import { Collection } from "./NewCollectionModal";
import { LinkCard } from "./LinkCard";

interface CollectionDetailPageProps {
  collection: Collection;
  links: SavedLink[];
  collections: Collection[];
  onBack: () => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDeleteCollection: (id: string) => void;
  onRenameCollection: (id: string, name: string, emoji: string) => void;
}

const EMOJIS = [
  "🎨", "✨", "🌐", "🔬", "🎬", "🎮", "📁",
  "📚", "💡", "🚀", "💎", "⚡", "🎵", "🏆",
  "💼", "🌿", "🔖", "❤️",
];

function getRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

function RenameSheet({
  collection,
  onClose,
  onSave,
}: {
  collection: Collection;
  onClose: () => void;
  onSave: (name: string, emoji: string) => void;
}) {
  const [name, setName] = useState(collection.name);
  const [emoji, setEmoji] = useState(collection.emoji);

  return (
    <div
      className="absolute inset-0 bg-black/60 flex items-end z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full bg-[#13131f] rounded-t-[28px] px-5 pt-3 pb-8">
        <div className="w-10 h-1 bg-[#2a2a3a] rounded-full mx-auto mb-5" />
        <p className="font-['Poppins:SemiBold',sans-serif] text-[#e8e8f5] text-[20px] mb-4">Edit Collection</p>

        {/* Emoji grid */}
        <div className="grid grid-cols-9 gap-2 mb-4">
          {EMOJIS.map((e) => (
            <button
              key={e}
              onClick={() => setEmoji(e)}
              className={`aspect-square rounded-[10px] flex items-center justify-center text-[18px] border-2 transition-all ${
                emoji === e ? "bg-[#1a1a28] border-[#9b59ff]" : "bg-[#1a1a28] border-transparent"
              }`}
            >
              {e}
            </button>
          ))}
        </div>

        {/* Name input */}
        <div className="flex items-center bg-[#0f0f18] rounded-[14px] px-4 py-3.5 mb-5 gap-3">
          <span className="text-[20px]">{emoji}</span>
          <input
            className="flex-1 bg-transparent outline-none font-['Poppins:Regular',sans-serif] text-[#e8e8f5] text-[14px] placeholder:text-[#3a3a50]"
            placeholder="Collection Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-[14px] bg-[#1a1a28] font-['Poppins:Medium',sans-serif] text-[#61617f] text-[15px]"
          >
            Cancel
          </button>
          <button
            onClick={() => name.trim() && onSave(name.trim(), emoji)}
            disabled={!name.trim()}
            className="flex-1 py-3.5 rounded-[14px] bg-gradient-to-b from-[#9b59ff] to-[#7b69ff] font-['Poppins:SemiBold',sans-serif] text-white text-[15px] disabled:opacity-40"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmSheet({
  collection,
  onClose,
  onConfirm,
}: {
  collection: Collection;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="absolute inset-0 bg-black/60 flex items-end z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full bg-[#13131f] rounded-t-[28px] px-5 pt-3 pb-8">
        <div className="w-10 h-1 bg-[#2a2a3a] rounded-full mx-auto mb-5" />

        <div className="flex flex-col items-center gap-2 mb-6 text-center">
          <span className="text-[36px]">{collection.emoji}</span>
          <p className="font-['Poppins:SemiBold',sans-serif] text-[#e8e8f5] text-[18px]">
            Delete "{collection.name}"?
          </p>
          <p className="font-['Poppins:Regular',sans-serif] text-[#61617f] text-[13px]">
            The collection will be removed. Your links won't be deleted.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-[14px] bg-[#1a1a28] font-['Poppins:Medium',sans-serif] text-[#61617f] text-[15px]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3.5 rounded-[14px] bg-red-500/90 font-['Poppins:SemiBold',sans-serif] text-white text-[15px]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export function CollectionDetailPage({
  collection,
  links,
  collections,
  onBack,
  onDelete,
  onToggleFavorite,
  onDeleteCollection,
  onRenameCollection,
}: CollectionDetailPageProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showRename, setShowRename] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const colLinks = links.filter((l) => l.collections?.includes(collection.id));
  const lastLink = [...colLinks].sort((a, b) => b.savedAt.getTime() - a.savedAt.getTime())[0];
  const lastUpdated = lastLink ? lastLink.savedAt : collection.createdAt;

  const handleDeleteCollection = () => {
    setShowDeleteConfirm(false);
    onDeleteCollection(collection.id);
    onBack();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Top nav row */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-[10px] bg-[#1a1a28] flex items-center justify-center active:opacity-70 transition-opacity"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="#e8e8f5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </button>

        {/* 3-dot menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-9 h-9 rounded-[10px] bg-[#1a1a28] flex items-center justify-center active:opacity-70 transition-opacity"
          >
            <svg className="size-4" fill="#61617f" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-11 z-50 bg-[#13131f] border border-[#2a2a3a] rounded-[14px] overflow-hidden w-44 shadow-xl">
                <button
                  onClick={() => { setMenuOpen(false); setShowRename(true); }}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-[#e8e8f5] font-['Poppins:Regular',sans-serif] text-[14px] active:bg-[#1a1a28]"
                >
                  <svg className="size-4 text-[#9b59ff]" fill="none" viewBox="0 0 24 24">
                    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                  Rename
                </button>
                <div className="h-px bg-[#2a2a3a]" />
                <button
                  onClick={() => { setMenuOpen(false); setShowDeleteConfirm(true); }}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-red-400 font-['Poppins:Regular',sans-serif] text-[14px] active:bg-[#1a1a28]"
                >
                  <svg className="size-4" fill="none" viewBox="0 0 24 24">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                  Delete Collection
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Collection identity */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 pb-5">
        <div className="w-12 h-12 bg-[#1a1a28] rounded-[14px] flex items-center justify-center flex-shrink-0">
          <span className="text-[26px]">{collection.emoji}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="font-['Poppins:SemiBold',sans-serif] text-[#e8e8f5] text-[20px] leading-tight">
            {collection.name}
          </p>
          <p className="font-['Poppins:Regular',sans-serif] text-[#61617f] text-[13px]">
            {colLinks.length} {colLinks.length === 1 ? "link" : "links"} · {getRelativeTime(lastUpdated)}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="flex-shrink-0 h-px bg-[#1a1a28] mx-4 mb-4" />

      {/* Links list */}
      {colLinks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8">
          <div className="w-14 h-14 bg-[#1a1a28] rounded-full flex items-center justify-center">
            <span className="text-[26px]">{collection.emoji}</span>
          </div>
          <p className="font-['Poppins:Medium',sans-serif] text-[#61617f] text-[15px] text-center">
            No links in this collection yet
          </p>
          <p className="font-['Poppins:Regular',sans-serif] text-[#3a3a50] text-[12px] text-center">
            Add links and assign them to "{collection.name}"
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 flex flex-col gap-4 pb-6">
          {colLinks.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              collections={collections}
              onDelete={onDelete}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}

      {/* Rename sheet */}
      {showRename && (
        <RenameSheet
          collection={collection}
          onClose={() => setShowRename(false)}
          onSave={(name, emoji) => {
            onRenameCollection(collection.id, name, emoji);
            setShowRename(false);
          }}
        />
      )}

      {/* Delete confirm sheet */}
      {showDeleteConfirm && (
        <DeleteConfirmSheet
          collection={collection}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteCollection}
        />
      )}
    </div>
  );
}
