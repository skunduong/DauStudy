import { shuffle } from "@/lib/game";
import { categoryById, type Word } from "@/lib/words";

/** The thinking games use the easier words (level 1–2), so the puzzle is the thinking, not the word. */
const easy = (id: string) => categoryById(id).words.filter((word) => word.level <= 2);

const families: Word[][] = [easy("shapes"), easy("colors"), easy("animals"), easy("fruits")];

const pool: Word[] = families.flat();

export type MemoryCard = {
  key: string;
  word: Word;
};

export type OddCard = {
  key: string;
  word: Word;
  odd: boolean;
};

export type OddRound = {
  id: number;
  cards: OddCard[];
};

export type PatternRound = {
  id: number;
  sequence: Word[];
  choices: Word[];
  answerId: string;
};

function differentFrom(words: readonly Word[], id: string) {
  const rest = words.filter((word) => word.id !== id);
  return rest[Math.floor(Math.random() * rest.length)];
}

export function makeMemoryBoard(): MemoryCard[] {
  const picks = shuffle(pool).slice(0, 3);
  const cards = picks.flatMap((word) => [
    { key: `${word.id}-a`, word },
    { key: `${word.id}-b`, word },
  ]);
  return shuffle(cards);
}

export function makeOddRound(id: number): OddRound {
  const family = families[id % families.length];
  const same = family[Math.floor(Math.random() * family.length)];
  const odd = differentFrom(family, same.id);
  const cards = shuffle([
    { word: same, odd: false },
    { word: same, odd: false },
    { word: same, odd: false },
    { word: odd, odd: true },
  ]).map((card, index) => ({ ...card, key: `${id}-${index}` }));
  return { id, cards };
}

export function makePatternRound(id: number): PatternRound {
  const family = families[id % families.length];
  const [first, second, third] = shuffle(family);
  return {
    id,
    sequence: [first, second, first, second],
    choices: shuffle([first, second, third]),
    answerId: first.id,
  };
}

// A pentagon and a hexagon shadow, or gray and silver, are too close for a toddler: level 1–2 only.
const shapes = easy("shapes");
const sortColors = easy("colors").filter((word) => word.id !== "white");
const countable: Word[] = [...easy("animals"), ...easy("fruits"), ...easy("objects")];

export type ShadowRound = {
  id: number;
  target: Word;
  choices: Word[];
};

export type CountRound = {
  id: number;
  word: Word;
  count: number;
};

export type ColorSortRound = {
  id: number;
  shape: Word;
  answer: Word;
  choices: Word[];
};

export function makeShadowRound(id: number): ShadowRound {
  const picks = shuffle(shapes).slice(0, 3);
  const target = picks[Math.floor(Math.random() * picks.length)];
  return { id, target, choices: shuffle(picks) };
}

export function makeCountRound(id: number, avoidId?: string): CountRound {
  const pool = countable.filter((word) => word.id !== avoidId);
  const source = pool.length > 0 ? pool : countable;
  return {
    id,
    word: source[Math.floor(Math.random() * source.length)],
    count: (id % 5) + 1,
  };
}

export function makeColorSortRound(id: number): ColorSortRound {
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  const picks = shuffle(sortColors).slice(0, 3);
  const answer = picks[Math.floor(Math.random() * picks.length)];
  return { id, shape, answer, choices: shuffle(picks) };
}

export type PuzzleRound = {
  id: number;
  word: Word;
  tray: number[];
};

export type SizeRound = {
  id: number;
  word: Word;
  bigFirst: boolean;
};

export function makePuzzleRound(id: number, avoidId?: string): PuzzleRound {
  const pool = countable.filter((word) => word.id !== avoidId);
  const source = pool.length > 0 ? pool : countable;
  return {
    id,
    word: source[Math.floor(Math.random() * source.length)],
    tray: shuffle([0, 1, 2, 3]),
  };
}

export function makeSizeRound(id: number): SizeRound {
  return {
    id,
    word: shapes[Math.floor(Math.random() * shapes.length)],
    bigFirst: Math.random() < 0.5,
  };
}
