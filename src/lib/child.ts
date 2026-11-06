import { isChildName, normalizeChildName } from "@/lib/phrases";

const NAME_KEY = "hoc-ten-be";
const MUTE_KEY = "hoc-nhac-tat";

let memoryName: string | null = null;

export function readChildName() {
  if (memoryName && isChildName(memoryName)) return memoryName;
  if (typeof window === "undefined") return null;
  try {
    const saved = normalizeChildName(window.localStorage.getItem(NAME_KEY) ?? "");
    if (!isChildName(saved)) return null;
    memoryName = saved;
    return saved;
  } catch {
    return null;
  }
}

export function saveChildName(name: string) {
  memoryName = name;
  try {
    window.localStorage.setItem(NAME_KEY, name);
  } catch {
    // The name still lives for this visit if storage is blocked.
  }
}

export function readMusicMuted() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

export function saveMusicMuted(muted: boolean) {
  try {
    window.localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
  } catch {
    // Mute still applies until the page reloads.
  }
}
