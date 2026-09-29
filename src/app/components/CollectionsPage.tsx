import { SavedLink } from "../App";
import { Collection } from "./NewCollectionModal";

interface CollectionsPageProps {
  links: SavedLink[];
  collections: Collection[];
  onNewCollection: () => void;
  onOpenCollection: (id: string) => void;
}

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

function StatBox({ number, label }: { number: number; label: string }) {
  return (
    <div className="flex-1 bg-[#1a1a28] rounded-[16px] flex flex-col items-center justify-center py-4 gap-1">
      <span className="font-['Poppins:SemiBold',sans-serif] text-[#e8e8f5] text-[26px] leading-none">
        {number}
      </span>
      <span className="font-['Poppins:Regular',sans-serif] text-[#61617f] text-[11px] text-center">
        {label}
      </span>
    </div>
  );
}

function EmptyCollections({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3">
      <p className="font-['Poppins:SemiBold',sans-serif] text-[#e8e8f5] text-[18px]">
        No collections yet
      </p>
      <p className="font-['Poppins:Regular',sans-serif] text-[#61617f] text-[13px]">
        Start organizing your links.
      </p>
      <button
        onClick={onAdd}
        className="mt-3 w-12 h-12 bg-gradient-to-b from-[#9b59ff] to-[#7b69ff] rounded-[16px] flex items-center justify-center active:opacity-80 transition-opacity shadow-lg"
      >
        <svg className="size-6" fill="none" viewBox="0 0 24 24">
          <path d="M5 12H19M12 5V19" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      </button>
    </div>
  );
}

function CollectionCard({ collection, links, onOpen }: { collection: Collection; links: SavedLink[]; onOpen: () => void }) {
  const colLinks = links.filter((l) => l.collections?.includes(collection.id));
  const lastLink = colLinks.sort((a, b) => b.savedAt.getTime() - a.savedAt.getTime())[0];
  const lastUpdated = lastLink ? lastLink.savedAt : collection.createdAt;

  return (
    <div onClick={onOpen} className="bg-[#1a1a28] rounded-[18px] p-4 flex flex-col gap-2 border border-[#232336] active:opacity-80 transition-opacity cursor-pointer">
      {/* Emoji */}
      <span className="text-[30px] leading-none">{collection.emoji}</span>

      {/* Name */}
      <p className="font-['Poppins:SemiBold',sans-serif] text-[#e8e8f5] text-[15px] leading-snug mt-1">
        {collection.name}
      </p>

      {/* Link count */}
      <p className="font-['Poppins:Regular',sans-serif] text-[#61617f] text-[12px]">
        {colLinks.length} {colLinks.length === 1 ? "link" : "links"}
      </p>

      {/* Last updated + chevron */}
      <div className="flex items-center justify-between mt-1">
        <span className="font-['Poppins:Regular',sans-serif] text-[#3a3a50] text-[11px]">
          {getRelativeTime(lastUpdated)}
        </span>
        <svg className="size-4 text-[#3a3a50]" fill="none" viewBox="0 0 24 24">
          <path d="M9 18l6-6-6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  );
}

export function CollectionsPage({ links, collections, onNewCollection, onOpenCollection }: CollectionsPageProps) {
  const totalFavorites = links.filter((l) => l.isFavorite).length;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 pt-2 pb-4">
        <p className="font-['Poppins:SemiBold',sans-serif] text-[#e8e8f5] text-[26px]">
          Collections
        </p>
        {collections.length > 0 && (
          <button
            onClick={onNewCollection}
            className="flex items-center gap-1.5 bg-gradient-to-b from-[#9b59ff] to-[#7b69ff] px-4 py-2 rounded-full active:opacity-80 transition-opacity"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24">
              <path d="M5 12H19M12 5V19" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <span className="font-['Poppins:Medium',sans-serif] text-white text-[13px]">New</span>
          </button>
        )}
      </div>

      {/* Stats row */}
      <div className="flex-shrink-0 flex gap-3 px-4 mb-5">
        <StatBox number={links.length} label="Total Links" />
        <StatBox number={collections.length} label="Collections" />
        <StatBox number={totalFavorites} label="Favorite" />
      </div>

      {/* Content */}
      {collections.length === 0 ? (
        <EmptyCollections onAdd={onNewCollection} />
      ) : (
        <div className="flex-1 overflow-y-auto px-4 pb-6">
          <div className="grid grid-cols-2 gap-3">
            {collections.map((col) => (
              <CollectionCard key={col.id} collection={col} links={links} onOpen={() => onOpenCollection(col.id)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
