const STORAGE_KEY = "vault_reminders";
const FIRED_KEY   = "vault_reminders_fired";

export interface StoredReminder {
  id: string;
  title: string;
  url: string;
  fireAt: number;
}

// ── Pending ───────────────────────────────────────────────────────────────────
function getStored(): StoredReminder[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}
function saveStored(r: StoredReminder[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(r));
}

// ── Fired (awaiting user acknowledgment) ─────────────────────────────────────
function getFiredStored(): StoredReminder[] {
  try { return JSON.parse(localStorage.getItem(FIRED_KEY) || "[]"); } catch { return []; }
}
function saveFiredStored(r: StoredReminder[]) {
  localStorage.setItem(FIRED_KEY, JSON.stringify(r));
}

export function getFiredReminders(): StoredReminder[] { return getFiredStored(); }
export function dismissFiredReminder(id: string) {
  saveFiredStored(getFiredStored().filter((r) => r.id !== id));
}

// ── In-app callback ───────────────────────────────────────────────────────────
let onReminderFire: ((r: StoredReminder) => void) | null = null;
export function setReminderCallback(cb: (r: StoredReminder) => void) {
  onReminderFire = cb;
}

function fireReminder(reminder: StoredReminder) {
  // Remove from pending
  saveStored(getStored().filter((r) => r.id !== reminder.id));

  if (localStorage.getItem("vault_notif") === "false") return;

  // Move to fired list so RemindersSheet can show it
  saveFiredStored([...getFiredStored(), reminder]);

  // Notify app via callback (in-app toast)
  if (onReminderFire) {
    onReminderFire(reminder);
    return;
  }

  // Fallback: browser Notification (browser/PWA only)
  if (typeof Notification !== "undefined" && Notification.permission === "granted") {
    try {
      const domain = new URL(reminder.url).hostname;
      const n = new Notification("Vault Reminder 🔗", {
        body: `Time to check: ${reminder.title}`,
        icon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
        tag: reminder.id,
        requireInteraction: true,
      });
      n.onclick = () => { window.open(reminder.url, "_blank", "noopener,noreferrer"); n.close(); };
    } catch { /* ignore */ }
  }
}

export function getReminderDelay(type: string): number {
  const now = new Date();
  switch (type) {
    case "10m":     return 10 * 60 * 1000;
    case "1h":      return 60 * 60 * 1000;
    case "3h":      return 3 * 60 * 60 * 1000;
    case "tomorrow": {
      const d = new Date(now);
      d.setDate(d.getDate() + 1);
      d.setHours(9, 0, 0, 0);
      return Math.max(1000, d.getTime() - now.getTime());
    }
    case "weekend": {
      const day = now.getDay();
      const daysUntilSat = day === 6 ? 7 : 6 - day;
      const d = new Date(now);
      d.setDate(d.getDate() + daysUntilSat);
      d.setHours(9, 0, 0, 0);
      return Math.max(1000, d.getTime() - now.getTime());
    }
    default: return 0;
  }
}

export async function scheduleReminder(
  title: string,
  url: string,
  type: string,
): Promise<"scheduled"> {
  const delay = getReminderDelay(type);
  if (delay <= 0) return "scheduled";

  const fullUrl = url.startsWith("http") ? url : `https://${url}`;
  const reminder: StoredReminder = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
    title: title || new URL(fullUrl).hostname,
    url: fullUrl,
    fireAt: Date.now() + delay,
  };

  saveStored([...getStored(), reminder]);
  setTimeout(() => fireReminder(reminder), delay);
  return "scheduled";
}

export function getPendingReminders(): StoredReminder[] {
  return getStored().filter((r) => r.fireAt > Date.now());
}

export function cancelReminder(id: string) {
  saveStored(getStored().filter((r) => r.id !== id));
}

export function initReminders() {
  const now = Date.now();
  const remaining: StoredReminder[] = [];

  for (const r of getStored()) {
    if (r.fireAt <= now) {
      fireReminder(r);
    } else {
      remaining.push(r);
      setTimeout(() => fireReminder(r), r.fireAt - now);
    }
  }
  saveStored(remaining);
}
