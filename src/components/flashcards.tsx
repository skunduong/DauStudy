"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Picture } from "@/components/picture";
import { makeRound, type Round } from "@/lib/game";
import { playPraise, playWrong, speakEnglish, stopSpeech } from "@/lib/speech";
import { categories, categoryById, type Category } from "@/lib/words";
import { cn } from "@/lib/utils";

const STAR_KEY = "hoc-tieng-anh-stars";
const STAR_EVENT = "hoc-tieng-anh-stars-changed";

function readStars() {
  try {
    const saved = Number(window.localStorage.getItem(STAR_KEY) ?? "0");
    if (!Number.isFinite(saved) || saved < 0) return 0;
    return Math.floor(saved);
  } catch {
    return 0;
  }
}

function serverStars() {
  return 0;
}

function subscribeStars(onStoreChange: () => void) {
  window.addEventListener(STAR_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(STAR_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function addStar() {
  const next = readStars() + 1;
  window.localStorage.setItem(STAR_KEY, String(next));
  window.dispatchEvent(new Event(STAR_EVENT));
}

const chipTone: Record<string, string> = {
  animals: "border-amber-300 bg-amber-200 text-amber-950",
  fruits: "border-rose-300 bg-rose-200 text-rose-950",
  colors: "border-violet-300 bg-violet-200 text-violet-950",
  shapes: "border-indigo-300 bg-indigo-200 text-indigo-950",
  objects: "border-sky-300 bg-sky-200 text-sky-950",
  actions: "border-emerald-300 bg-emerald-200 text-emerald-950",
  body: "border-teal-300 bg-teal-200 text-teal-950",
};

function StarIcon({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-8", className)} aria-hidden="true">
      <path
        d="M12 2.4 14.8 8.7 21.6 9.4 16.5 14l1.5 6.6L12 17.4 6 20.6 7.5 14 2.4 9.4 9.2 8.7Z"
        fill={filled ? "#f5b942" : "transparent"}
        stroke={filled ? "#e09a16" : "#e4c48a"}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarMeter({ count, roomy = false }: { count: number; roomy?: boolean }) {
  const shown = Math.min(count, 5);
  return (
    <div className="flex items-center gap-1" aria-label={count === 0 ? "Chưa có sao" : `${count} sao`}>
      {roomy
        ? Array.from({ length: 5 }, (_, index) => <StarIcon key={index} filled={index < shown} />)
        : <StarIcon filled={count > 0} className="size-7" />}
      <span className={cn("font-extrabold text-amber-800", roomy ? "ml-1 text-lg" : "text-base")}>
        {count === 0 ? (roomy ? "Cùng lấy sao nào" : "") : `${count} sao`}
      </span>
    </div>
  );
}

export function Flashcards({ onExit }: { onExit: () => void }) {
  const [categoryId, setCategoryId] = useState(categories[0].id);
  const [phase, setPhase] = useState<"home" | "play" | "success">("home");
  const [round, setRound] = useState<Round | null>(null);
  const [shake, setShake] = useState<{ id: string; nonce: number } | null>(null);
  const stars = useSyncExternalStore(subscribeStars, readStars, serverStars);
  const roundToken = useRef(0);
  const advanceTimer = useRef<number | null>(null);
  const shakeTimer = useRef<number | null>(null);
  const answering = useRef(false);

  useEffect(() => {
    return () => {
      roundToken.current += 1;
      if (advanceTimer.current !== null) window.clearTimeout(advanceTimer.current);
      if (shakeTimer.current !== null) window.clearTimeout(shakeTimer.current);
      stopSpeech();
    };
  }, []);

  useEffect(() => {
    function typingTarget(target: EventTarget | null) {
      return (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      );
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.code !== "Space" || event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
      if (phase === "home" || !round || typingTarget(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
      speakEnglish(round.answer.en);
    }

    function onKeyUp(event: KeyboardEvent) {
      if (event.code !== "Space" || phase === "home" || !round || typingTarget(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
    }

    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("keyup", onKeyUp, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("keyup", onKeyUp, true);
    };
  }, [phase, round]);

  function clearAdvance() {
    if (advanceTimer.current !== null) {
      window.clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  }

  function startRound(category: Category, avoidId?: string) {
    clearAdvance();
    const nextId = roundToken.current + 1;
    roundToken.current = nextId;
    const next = makeRound(category.words, nextId, avoidId);
    answering.current = false;
    setRound(next);
    setPhase("play");
    setShake(null);
    speakEnglish(next.answer.en);
  }

  function goHome() {
    roundToken.current += 1;
    clearAdvance();
    setPhase("home");
    setShake(null);
    stopSpeech();
  }

  function onPick(choiceId: string) {
    if (phase !== "play" || !round || answering.current) return;
    if (choiceId === round.answer.id) {
      answering.current = true;
      const token = roundToken.current;
      const category = categoryById(categoryId);
      setPhase("success");
      addStar();
      playPraise();
      clearAdvance();
      advanceTimer.current = window.setTimeout(() => {
        if (roundToken.current !== token) return;
        startRound(category, choiceId);
      }, 1600);
      return;
    }
    setShake({ id: choiceId, nonce: Date.now() });
    playWrong();
    if (shakeTimer.current !== null) window.clearTimeout(shakeTimer.current);
    shakeTimer.current = window.setTimeout(() => setShake(null), 520);
  }

  return (
    <div className="min-h-dvh bg-[radial-gradient(circle_at_8%_0%,#ffe7a3_0,transparent_32%),radial-gradient(circle_at_100%_8%,#ffc2d1_0,transparent_28%),radial-gradient(circle_at_80%_100%,#c7ecff_0,transparent_34%),#fff6ea] text-foreground">
      <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-4 py-4 sm:px-6 sm:py-6">
        {phase === "home" || !round ? (
          <HomeScreen
            categoryId={categoryId}
            stars={stars}
            onSelect={setCategoryId}
            onPlay={() => startRound(categoryById(categoryId))}
            onExit={onExit}
          />
        ) : (
          <PlayScreen
            category={categoryById(categoryId)}
            round={round}
            phase={phase}
            shake={shake}
            stars={stars}
            onHome={goHome}
            onHear={() => speakEnglish(round.answer.en)}
            onPick={onPick}
          />
        )}
      </div>
    </div>
  );
}

function HomeScreen({
  categoryId,
  stars,
  onSelect,
  onPlay,
  onExit,
}: {
  categoryId: string;
  stars: number;
  onSelect: (id: string) => void;
  onPlay: () => void;
  onExit: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center gap-3 pt-1">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            stopSpeech();
            onExit();
          }}
          className="h-14 rounded-full border-4 border-white bg-white/90 px-5 text-xl font-extrabold"
        >
          Quay lại
        </Button>
        <div className="flex flex-1 justify-center">
          <StarMeter count={stars} roomy />
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-8 py-6">
        <div className="text-center">
          <div className="mb-4 flex flex-wrap items-end justify-center gap-2 sm:gap-3" aria-hidden="true">
            {categories.map((category) => (
              <span key={category.id} className="relative block size-11 overflow-hidden rounded-full sm:size-14">
                <Picture word={category.words[0]} />
              </span>
            ))}
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-balance sm:text-6xl">Học tiếng Anh</h1>
          <p className="mx-auto mt-3 max-w-md text-lg font-bold leading-snug text-muted-foreground sm:text-xl">
            Bé nghe từ tiếng Anh, rồi chạm vào bức tranh đúng.
          </p>
        </div>
        <div className="w-full max-w-lg">
          <p className="mb-3 text-center text-base font-extrabold">Chọn chủ đề</p>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => {
              const selected = category.id === categoryId;
              return (
                <Button
                  key={category.id}
                  type="button"
                  variant="outline"
                  aria-pressed={selected}
                  onClick={() => onSelect(category.id)}
                  className={cn(
                    "h-28 flex-col gap-1 rounded-[1.6rem] border-4 text-xl font-extrabold shadow-[0_6px_0_rgba(80,50,20,0.08)]",
                    selected
                      ? chipTone[category.id]
                      : "border-white bg-white/90 text-foreground hover:bg-white",
                  )}
                >
                  <span className="relative block size-12 overflow-hidden rounded-full">
                    <Picture word={category.words[0]} />
                  </span>
                  {category.label}
                </Button>
              );
            })}
          </div>
        </div>
        <Button
          type="button"
          onClick={onPlay}
          className="h-20 w-full max-w-lg rounded-full text-3xl font-extrabold shadow-[0_8px_0_#c2412d] active:translate-y-1 active:shadow-[0_4px_0_#c2412d]"
        >
          Chơi thôi
        </Button>
      </div>
    </div>
  );
}

function PlayScreen({
  category,
  round,
  phase,
  shake,
  stars,
  onHome,
  onHear,
  onPick,
}: {
  category: Category;
  round: Round;
  phase: "play" | "success";
  shake: { id: string; nonce: number } | null;
  stars: number;
  onHome: () => void;
  onHear: () => void;
  onPick: (id: string) => void;
}) {
  return (
    <div className="flex flex-1 flex-col gap-3" data-round-top>
      <header className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onHome}
          className="h-12 rounded-full border-4 border-white bg-white/90 px-4 text-base font-extrabold"
        >
          Về nhà
        </Button>
        <p className="truncate text-center text-lg font-extrabold sm:text-xl">{category.label}</p>
        <StarMeter count={stars} />
      </header>

      <section className="rounded-[2rem] border-4 border-white bg-white/90 px-4 py-4 text-center shadow-[0_8px_0_rgba(80,50,20,0.08)] sm:px-6 sm:py-5">
        <h1 className="text-5xl font-extrabold tracking-tight text-balance sm:text-7xl">{round.answer.en}</h1>
        <p className="mt-1 text-2xl font-extrabold text-rose-500 sm:text-3xl">{round.answer.vi}</p>
        <Button
          type="button"
          onClick={onHear}
          className="mt-3 h-14 rounded-full px-6 text-xl font-extrabold sm:h-16 sm:px-8 sm:text-2xl"
        >
          <Volume2 className="size-7 sm:size-8" />
          Nghe lại
        </Button>
      </section>

      <div className="flex h-16 items-center justify-center" aria-live="polite">
        {phase === "success" ? (
          <p className="animate-pop-in inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-2xl font-extrabold text-white shadow-[0_6px_0_#047857] sm:text-3xl">
            <StarIcon filled className="size-7" />
            Đúng rồi!
            <StarIcon filled className="size-7" />
          </p>
        ) : null}
      </div>

      <div className="grid flex-1 grid-cols-3 content-start gap-3 sm:gap-4">
        {round.choices.map((choice, index) => {
          const shaking = shake?.id === choice.id;
          const correct = phase === "success" && choice.id === round.answer.id;
          const position = index + 1;
          return (
            <Button
              key={`${round.id}-${choice.id}-${shaking ? shake.nonce : "still"}`}
              type="button"
              variant="outline"
              disabled={phase !== "play"}
              aria-label={`${position}. ${choice.en}, ${choice.vi}`}
              onClick={() => onPick(choice.id)}
              className={cn(
                "relative aspect-square h-auto w-full min-w-0 overflow-hidden rounded-[1.6rem] border-4 border-white bg-white p-0 shadow-[0_7px_0_rgba(80,50,20,0.14)]",
                "hover:bg-white active:translate-y-1 active:shadow-[0_3px_0_rgba(80,50,20,0.14)] disabled:opacity-100",
                correct && "scale-105 border-emerald-400 ring-4 ring-emerald-400",
                shaking && "animate-card-shake",
              )}
            >
              <span className="absolute inset-0">
                <Picture word={choice} />
              </span>
              <span
                aria-hidden="true"
                className="absolute top-1.5 left-1.5 z-10 flex size-6 items-center justify-center rounded-full bg-white/90 text-xs font-extrabold text-amber-950 shadow-sm ring-2 ring-amber-100 sm:size-7 sm:text-sm"
              >
                {position}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
