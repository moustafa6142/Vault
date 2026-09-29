import { useState, useEffect } from "react";
import { getPendingReminders, cancelReminder, getFiredReminders, dismissFiredReminder, StoredReminder } from "../utils/reminders";

function timeRemaining(fireAt: number): string {
  const diff = fireAt - Date.now();
  if (diff <= 0) return "Now";
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (days >= 1)  return `in ${days} day${days > 1 ? "s" : ""}`;
  if (hours >= 1) return `in ${hours} hour${hours > 1 ? "s" : ""}`;
  if (mins >= 1)  return `in ${mins} min${mins !== 1 ? "s" : ""}`;
  return "in less than a minute";
}

function getDomain(url: string): string {
  try { return new URL(url).hostname.replace("www.", ""); } catch { return url; }
}

function FaviconBox({ url }: { url: string }) {
  return (
    <div className="w-9 h-9 rounded-[10px] bg-[#0f0f18] flex items-center justify-center flex-shrink-0 overflow-hidden">
      <img
        src={`https://www.google.com/s2/favicons?domain=${getDomain(url)}&sz=32`}
        alt=""
        className="w-5 h-5 object-contain"
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
    </div>
  );
}

interface RemindersSheetProps {
  onClose: () => void;
  onChanged: () => void;
}

export function RemindersSheet({ onClose, onChanged }: RemindersSheetProps) {
  const [pending, setPending] = useState<StoredReminder[]>([]);
  const [fired,   setFired]   = useState<StoredReminder[]>([]);

  const refresh = () => {
    setPending(getPendingReminders());
    setFired(getFiredReminders());
  };

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 15000);
    return () => clearInterval(t);
  }, []);

  const handleCancel = (id: string) => {
    cancelReminder(id);
    refresh();
    onChanged();
  };

  const handleDismissFired = (id: string) => {
    dismissFiredReminder(id);
    refresh();
    onChanged();
  };

  const totalCount = pending.length + fired.length;

  return (
    <div
      className="absolute inset-0 bg-black/60 flex items-end z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full bg-[#13131f] rounded-t-[28px] px-5 pt-3 pb-8 max-h-[78vh] flex flex-col">
        {/* Handle */}
        <div className="w-10 h-1 bg-[#2a2a3a] rounded-full mx-auto mb-5 flex-shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <p className="font-['Poppins:SemiBold',sans-serif] text-[#e8e8f5] text-[18px]">Reminders</p>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#9b59ff]" />
            <span className="font-['Poppins:Regular',sans-serif] text-[#61617f] text-[13px]">
              {totalCount} {totalCount === 1 ? "reminder" : "reminders"}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-3">

          {/* ── Fired (need acknowledgment) ── */}
          {fired.length > 0 && (
            <>
              <p className="font-['Poppins:Medium',sans-serif] text-[11px] text-amber-400 uppercase tracking-wider px-1 flex-shrink-0">
                🔔 Fired — tap to open
              </p>
              {fired.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-[16px] border"
                  style={{ background: "rgba(155,89,255,0.07)", borderColor: "rgba(155,89,255,0.25)" }}
                >
                  <FaviconBox url={r.url} />
                  <div className="flex-1 min-w-0">
                    <p className="font-['Poppins:Medium',sans-serif] text-[#e8e8f5] text-[13px] truncate">{r.title}</p>
                    <p className="font-['Poppins:Regular',sans-serif] text-[#9b59ff] text-[11px] mt-0.5">Reminder fired</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => window.open(r.url, "_blank", "noopener,noreferrer")}
                      className="px-3 py-1.5 rounded-full bg-[#9b59ff] font-['Poppins:Medium',sans-serif] text-white text-[11px] active:opacity-80"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDismissFired(r.id)}
                      className="w-7 h-7 rounded-full bg-[#2a2a3a] flex items-center justify-center active:opacity-70"
                    >
                      <svg className="size-3.5 text-[#61617f]" fill="none" viewBox="0 0 24 24">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ── Pending ── */}
          {pending.length > 0 && (
            <>
              {fired.length > 0 && (
                <p className="font-['Poppins:Medium',sans-serif] text-[11px] text-[#61617f] uppercase tracking-wider px-1 mt-1">
                  Upcoming
                </p>
              )}
              {pending.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-[16px] bg-[#1a1a28] border border-[#232336]"
                >
                  <FaviconBox url={r.url} />
                  <div className="flex-1 min-w-0">
                    <p className="font-['Poppins:Medium',sans-serif] text-[#e8e8f5] text-[13px] truncate">{r.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <svg className="size-3 text-[#9b59ff]" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M12 6v6l4 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                      </svg>
                      <p className="font-['Poppins:Regular',sans-serif] text-[#9b59ff] text-[11px]">{timeRemaining(r.fireAt)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCancel(r.id)}
                    className="w-7 h-7 rounded-full bg-[#2a2a3a] flex items-center justify-center flex-shrink-0 active:opacity-70"
                  >
                    <svg className="size-3.5 text-[#61617f]" fill="none" viewBox="0 0 24 24">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                    </svg>
                  </button>
                </div>
              ))}
            </>
          )}

          {/* ── Empty ── */}
          {totalCount === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 py-10">
              <div className="w-12 h-12 rounded-full bg-[#1a1a28] flex items-center justify-center">
                <svg className="size-6 text-[#3a3a50]" fill="none" viewBox="0 0 24 24">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
              <p className="font-['Poppins:Regular',sans-serif] text-[#3a3a50] text-[13px]">No reminders</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
