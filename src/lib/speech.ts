import { readChildName } from "@/lib/child";
import { praiseLine, wrongLine } from "@/lib/phrases";

let generation = 0;
let current: HTMLAudioElement | null = null;

const FALLBACK_MS = 4000;

function clipUrl(lang: "en" | "vi", text: string) {
  return `/api/speech?lang=${lang}&q=${encodeURIComponent(text)}`;
}

function startClip(lang: "en" | "vi", text: string) {
  const token = ++generation;
  current?.pause();
  const audio = new Audio(clipUrl(lang, text));
  current = audio;
  return { token, audio };
}

function play(lang: "en" | "vi", text: string) {
  if (typeof window === "undefined") return;
  const { audio } = startClip(lang, text);
  void audio.play().catch(() => {
    // The pictures still work if this clip cannot play.
  });
}

function whenPraiseEnds(audio: HTMLAudioElement, token: number) {
  return new Promise<void>((resolve) => {
    let settled = false;
    const started = Date.now();
    let timer = window.setTimeout(finish, FALLBACK_MS);

    function finish() {
      if (settled) return;
      const stillPlaying =
        token === generation && !audio.ended && !audio.paused && !audio.error && audio.currentTime > 0;
      if (stillPlaying && Date.now() - started < 8000) {
        const remain =
          Number.isFinite(audio.duration) && audio.duration > audio.currentTime
            ? (audio.duration - audio.currentTime) * 1000 + 400
            : 1200;
        arm(Date.now() - started + remain);
        return;
      }
      settled = true;
      window.clearTimeout(timer);
      resolve();
    }

    function arm(ms: number) {
      window.clearTimeout(timer);
      timer = window.setTimeout(finish, Math.max(0, ms - (Date.now() - started)));
    }

    audio.addEventListener("ended", () => {
      if (token !== generation) {
        finish();
        return;
      }
      finish();
    });
    audio.addEventListener("error", () => {
      arm(FALLBACK_MS);
    });
    audio.addEventListener("loadedmetadata", () => {
      if (audio.error || settled) return;
      if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
      const ms = Math.ceil(audio.duration * 1000) + 500;
      if (ms > FALLBACK_MS) arm(ms);
    });
    void audio.play().catch(() => {
      arm(FALLBACK_MS);
    });
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

export function speakVietnamese(phrase: string) {
  play("vi", phrase);
}

export function playPraise() {
  const name = readChildName();
  if (!name || typeof window === "undefined") return Promise.resolve();
  const { token, audio } = startClip("vi", praiseLine(name));
  return whenPraiseEnds(audio, token);
}

export function playWrong() {
  const name = readChildName();
  if (!name) return;
  play("vi", wrongLine(name));
}
