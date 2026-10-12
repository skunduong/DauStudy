import { shuffle } from "@/lib/game";
import { categoryById, type Word } from "@/lib/words";

const families: Word[][] = [
  categoryById("shapes").words,
  categoryById("colors").words,
  categoryById("animals").words,
  categoryById("fruits").words,
];

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
