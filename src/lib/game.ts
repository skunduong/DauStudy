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

export function makeRound(
  words: readonly Word[],
  roundId: number,
  avoidId?: string,
): Round {
  const pool = words.filter((word) => word.id !== avoidId);
  const source = pool.length > 0 ? pool : words;
  const answer = source[Math.floor(Math.random() * source.length)];
  const distractors = shuffle(words.filter((word) => word.id !== answer.id)).slice(0, 5);
  return {
    id: roundId,
    answer,
    choices: shuffle([answer, ...distractors]),
  };
}
