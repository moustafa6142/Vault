import { useState } from "react";

export interface Collection {
  id: string;
  name: string;
  emoji: string;
  createdAt: Date;
}

interface NewCollectionModalProps {
  onClose: () => void;
  onCreate: (collection: Collection) => void;
}

const EMOJIS = [
  "🎨", "✨", "🌐", "🔬", "🎬", "🎮", "📁",
  "📚", "💡", "🚀", "💎", "⚡", "🎵", "🏆",
  "💼", "🌿", "🔖", "❤️",
];

export function NewCollectionModal({ onClose, onCreate }: NewCollectionModalProps) {
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJIS[0]);
  const [name, setName] = useState("");

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate({
      id: `col_${Date.now()}`,
      name: trimmed,
      emoji: selectedEmoji,
      createdAt: new Date(),
    });
  };

  return (
    <div
      className="absolute inset-0 bg-black/60 flex items-end z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full bg-[#13131f] rounded-t-[28px] px-5 pt-3 pb-8">
        {/* Handle */}
        <div className="w-10 h-1 bg-[#2a2a3a] rounded-full mx-auto mb-5" />

        {/* Title */}
        <p className="font-['Poppins:SemiBold',sans-serif] text-[#e8e8f5] text-[22px] mb-5">
          New Collections
        </p>

        {/* Emoji grid */}
        <div className="grid grid-cols-7 gap-2 mb-5">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => setSelectedEmoji(emoji)}
              className={`w-full aspect-square rounded-[14px] flex items-center justify-center text-[22px] transition-all ${
                selectedEmoji === emoji
                  ? "bg-[#1a1a28] border-2 border-[#9b59ff]"
                  : "bg-[#1a1a28] border-2 border-transparent"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Name input */}
        <div className="flex items-center bg-[#0f0f18] rounded-[14px] px-4 py-3.5 mb-6 gap-3">
          <span className="text-[20px] flex-shrink-0">{selectedEmoji}</span>
          <input
            className="flex-1 bg-transparent outline-none font-['Poppins:Regular',sans-serif] text-[#e8e8f5] text-[14px] placeholder:text-[#3a3a50]"
            placeholder="Collection Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            autoFocus
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-4 rounded-[16px] bg-[#1a1a28] font-['Poppins:Medium',sans-serif] text-[#61617f] text-[15px] active:opacity-70 transition-opacity"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="flex-1 py-4 rounded-[16px] bg-gradient-to-b from-[#9b59ff] to-[#7b69ff] font-['Poppins:SemiBold',sans-serif] text-white text-[15px] active:opacity-80 transition-opacity disabled:opacity-40"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
