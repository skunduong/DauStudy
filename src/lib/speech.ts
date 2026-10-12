import { PRAISE, WRONG } from "@/lib/phrases";

let generation = 0;
let current: HTMLAudioElement | null = null;

function clipUrl(lang: "en" | "vi", text: string) {
  return `/api/speech?lang=${lang}&q=${encodeURIComponent(text)}`;
}

function play(lang: "en" | "vi", text: string) {
  if (typeof window === "undefined") return;
  const token = ++generation;
  current?.pause();
  const audio = new Audio(clipUrl(lang, text));
  current = audio;
  void audio.play().catch(() => {
    if (token !== generation) return;
    // The pictures still work if this clip cannot play.
  });
}

export function stopSpeech() {
  generation += 1;
  current?.pause();
  current = null;
}

export function speakEnglish(phrase: string) {
  play("en", phrase);
}

export function playPraise() {
  play("vi", PRAISE);
}

export function playWrong() {
  play("vi", WRONG);
}
