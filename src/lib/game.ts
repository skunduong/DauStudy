import type { Word } from "@/lib/words";

export type Round = {
  id: number;
  answer: Word;
  choices: Word[];
};

export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    const current = copy[index];
    copy[index] = copy[swap];
    copy[swap] = current;
  }
  return copy;
}

function pickWeighted(words: readonly Word[], weight: (word: Word) => number): Word {
  const weights = words.map((word) => Math.max(0, weight(word)));
  const total = weights.reduce((sum, value) => sum + value, 0);
  if (!(total > 0)) return words[Math.floor(Math.random() * words.length)];
  let roll = Math.random() * total;
  for (let index = 0; index < words.length; index += 1) {
    roll -= weights[index];
    if (roll < 0) return words[index];
  }
  return words[words.length - 1];
}

export type RoundOptions = {
  /** The last answer, so the same word is not asked twice in a row. */
  avoidId?: string;
  /** How likely each word is to be the answer. Every word counts the same when left out. */
  weight?: (word: Word) => number;
};

/**
 * One board: an answer and up to five other pictures, all from `words`.
 * Pass only the words the child has opened, so every picture on the board is one they have met.
 */
export function makeRound(words: readonly Word[], roundId: number, options: RoundOptions = {}): Round {
  const { avoidId, weight = () => 1 } = options;
  const pool = words.filter((word) => word.id !== avoidId);
  const answer = pickWeighted(pool.length > 0 ? pool : words, weight);
  const distractors = shuffle(words.filter((word) => word.id !== answer.id)).slice(0, 5);
  return {
    id: roundId,
    answer,
    choices: shuffle([answer, ...distractors]),
  };
}
