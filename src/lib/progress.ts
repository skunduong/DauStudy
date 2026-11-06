import type { Category, Word } from "@/lib/words";

/*
 * Words open a few at a time. A topic starts with its level-1 words. Once the child has tapped
 * the right picture on the first try in NEEDED of the last WINDOW rounds, the next STEP words open
 * (level 2, then level 3). Progress is kept per topic in localStorage, like the stars.
 */

const PROGRESS_KEY = "hoc-tieng-anh-progress";
const PROGRESS_EVENT = "hoc-tieng-anh-progress-changed";

export const WINDOW = 8;
export const NEEDED = 6;
export const STEP = 2;
/** A board shows six pictures, so a topic never starts with fewer words than that. */
const BOARD = 6;

export type TopicProgress = {
  /** How many of the topic's words are open, counted in level order. */
  open: number;
  /** The rounds since words last opened, newest last: 1 = right on the first tap, 0 = not. */
  recent: number[];
  /** How many rounds each word has been the answer. */
  seen: Record<string, number>;
  /** Misses per word. A first-try success takes one away. */
  misses: Record<string, number>;
};

type Saved = Record<string, Partial<TopicProgress>>;

/** The topic's words, easy level first. The sort is stable, so the list order holds within a level. */
export function levelOrder(words: readonly Word[]): Word[] {
  return [...words].sort((a, b) => a.level - b.level);
}

function starterCount(words: readonly Word[]) {
  const levelOne = words.filter((word) => word.level === 1).length;
  return Math.min(words.length, Math.max(levelOne, BOARD));
}

function isCounts(value: unknown): value is Record<string, number> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parse(raw: string): Saved {
  if (!raw) return {};
  try {
    const value: unknown = JSON.parse(raw);
    return typeof value === "object" && value !== null && !Array.isArray(value) ? (value as Saved) : {};
  } catch {
    return {};
  }
}

/** The raw saved string. A string keeps useSyncExternalStore snapshots stable between reads. */
export function readProgressRaw(): string {
  try {
    return window.localStorage.getItem(PROGRESS_KEY) ?? "";
  } catch {
    return "";
  }
}

export function serverProgressRaw() {
  return "";
}

export function subscribeProgress(onStoreChange: () => void) {
  window.addEventListener(PROGRESS_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(PROGRESS_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function topicProgress(raw: string, category: Category): TopicProgress {
  const saved = parse(raw)[category.id] ?? {};
  const total = category.words.length;
  const start = starterCount(category.words);
  const open = typeof saved.open === "number" && Number.isFinite(saved.open) ? Math.floor(saved.open) : start;
  return {
    open: Math.min(total, Math.max(start, open)),
    recent: Array.isArray(saved.recent) ? saved.recent.filter((value) => value === 0 || value === 1).slice(-WINDOW) : [],
    seen: isCounts(saved.seen) ? saved.seen : {},
    misses: isCounts(saved.misses) ? saved.misses : {},
  };
}

/** The words the child plays with right now. */
export function openWords(category: Category, progress: TopicProgress): Word[] {
  return levelOrder(category.words).slice(0, progress.open);
}

/** The highest level in the topic. */
export function topLevel(category: Category): number {
  return Math.max(...category.words.map((word) => word.level));
}

/** The level the child has reached: the level of the last word that opened. */
export function currentLevel(category: Category, progress: TopicProgress): number {
  const open = openWords(category, progress);
  return open.length > 0 ? open[open.length - 1].level : 1;
}

/**
 * How likely a word is to be the answer. A word that just opened is asked almost at once, while
 * every other picture on the board is one the child knows. Missed words come back more often.
 */
export function answerWeight(progress: TopicProgress, word: Word): number {
  const seen = progress.seen[word.id] ?? 0;
  const misses = progress.misses[word.id] ?? 0;
  const fresh = seen === 0 ? 20 : seen === 1 ? 4 : 1;
  return fresh + Math.min(misses, 3) * 2;
}

export type RoundResult = {
  /** Words that opened after this round. */
  opened: Word[];
  /** The new level when this round moved the child up a level, otherwise null. */
  levelUp: number | null;
};

/** Saves one finished round and opens new words when the child is ready. */
export function recordRound(category: Category, wordId: string, firstTry: boolean): RoundResult {
  const raw = readProgressRaw();
  const saved = parse(raw);
  const current = topicProgress(raw, category);
  const next: TopicProgress = {
    open: current.open,
    recent: [...current.recent, firstTry ? 1 : 0].slice(-WINDOW),
    seen: { ...current.seen, [wordId]: (current.seen[wordId] ?? 0) + 1 },
    misses: { ...current.misses, [wordId]: Math.max(0, (current.misses[wordId] ?? 0) + (firstTry ? -1 : 1)) },
  };

  let opened: Word[] = [];
  const right = next.recent.reduce((sum, value) => sum + value, 0);
  if (next.open < category.words.length && next.recent.length >= WINDOW && right >= NEEDED) {
    const ordered = levelOrder(category.words);
    const open = Math.min(ordered.length, next.open + STEP);
    opened = ordered.slice(next.open, open);
    next.open = open;
    next.recent = [];
  }

  saved[category.id] = next;
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(saved));
  } catch {
    // Private mode or full storage: the game still plays, it just starts over next time.
  }
  window.dispatchEvent(new Event(PROGRESS_EVENT));
  const before = currentLevel(category, current);
  const after = currentLevel(category, next);
  return { opened, levelUp: after > before ? after : null };
}
