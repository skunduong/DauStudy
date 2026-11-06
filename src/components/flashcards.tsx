"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Picture } from "@/components/picture";
import { LevelSteps } from "@/components/level-steps";
import { TopicMark } from "@/components/topic-mark";
import { makeRound, type Round } from "@/lib/game";
import {
  answerWeight,
  openWords,
  readProgressRaw,
  recordRound,
  serverProgressRaw,
  subscribeProgress,
  topicProgress,
} from "@/lib/progress";
import { playPraise, playWrong, speakEnglish, stopSpeech } from "@/lib/speech";
import { backClass, cardFace, chunky, shell, softTile, softTileOn } from "@/lib/look";
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

/** A board made only of the words the child has opened in this topic. */
function roundFor(category: Category, roundId: number, avoidId?: string) {
  const progress = topicProgress(readProgressRaw(), category);
  return makeRound(openWords(category, progress), roundId, {
    avoidId,
    weight: (word) => answerWeight(progress, word),
  });
}

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
    <div className="flex w-full min-w-0 max-w-full flex-col items-center" aria-label={count === 0 ? "Chưa có sao" : `${count} sao`}>
      <div className="flex items-center gap-0.5">
        {roomy
          ? Array.from({ length: 5 }, (_, index) => <StarIcon key={index} filled={index < shown} className="size-5 sm:size-8" />)
          : <StarIcon filled={count > 0} className="size-7" />}
      </div>
      <span className={cn("max-w-full text-center font-extrabold text-balance text-amber-800", roomy ? "text-xs leading-tight sm:text-lg" : "text-base")}>
        {count === 0 ? (roomy ? "Cùng lấy sao nào" : "") : `${count} sao`}
      </span>
    </div>
  );
}

export function Flashcards({
  onExit,
  quizCategoryId,
}: {
  onExit: () => void;
  quizCategoryId?: string;
}) {
  const [categoryId, setCategoryId] = useState(quizCategoryId ?? categories[0].id);
  const [phase, setPhase] = useState<"home" | "play" | "success">(quizCategoryId ? "play" : "home");
  const [round, setRound] = useState<Round | null>(() =>
    quizCategoryId ? roundFor(categoryById(quizCategoryId), 1) : null,
  );
  const [shake, setShake] = useState<{ id: string; nonce: number } | null>(null);
  /** Set when the last right answer moved the child up a level, for the "Lên cấp" moment. */
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const stars = useSyncExternalStore(subscribeStars, readStars, serverStars);
  const progressRaw = useSyncExternalStore(subscribeProgress, readProgressRaw, serverProgressRaw);
  const roundToken = useRef(quizCategoryId ? 1 : 0);
  const advanceTimer = useRef<number | null>(null);
  const shakeTimer = useRef<number | null>(null);
  const answering = useRef(false);
  const openingSpoken = useRef(false);
  /** Whether the child tapped a wrong picture in this round. */
  const missed = useRef(false);

  useEffect(() => {
    return () => {
      roundToken.current += 1;
      if (advanceTimer.current !== null) window.clearTimeout(advanceTimer.current);
      if (shakeTimer.current !== null) window.clearTimeout(shakeTimer.current);
      stopSpeech();
    };
  }, []);

  useEffect(() => {
    if (!quizCategoryId || !round || openingSpoken.current) return;
    openingSpoken.current = true;
    speakEnglish(round.answer.en);
  }, [quizCategoryId, round]);

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
    const next = roundFor(category, nextId, avoidId);
    answering.current = false;
    missed.current = false;
    setLevelUp(null);
    setRound(next);
    setPhase("play");
    setShake(null);
    speakEnglish(next.answer.en);
  }

  function goHome() {
    roundToken.current += 1;
    clearAdvance();
    setShake(null);
    stopSpeech();
    if (quizCategoryId) {
      onExit();
      return;
    }
    setPhase("home");
  }

  function onPick(choiceId: string) {
    if (phase !== "play" || !round || answering.current) return;
    if (choiceId === round.answer.id) {
      answering.current = true;
      const token = roundToken.current;
      const category = categoryById(categoryId);
      const result = recordRound(category, choiceId, !missed.current);
      setLevelUp(result.levelUp);
      setPhase("success");
      addStar();
      clearAdvance();
      void playPraise().then(() => {
        if (roundToken.current !== token) return;
        startRound(category, choiceId);
      });
      return;
    }
    missed.current = true;
    setShake({ id: choiceId, nonce: Date.now() });
    playWrong();
    if (shakeTimer.current !== null) window.clearTimeout(shakeTimer.current);
    shakeTimer.current = window.setTimeout(() => setShake(null), 520);
  }

  return (
    <div className={cn(shell, "min-h-full")}>
      <div className="mx-auto flex min-h-full w-full min-w-0 max-w-3xl flex-col overflow-x-clip px-4 py-4 sm:px-6 md:max-w-6xl md:py-6">
        {phase === "home" || !round ? (
          <HomeScreen
            categoryId={categoryId}
            stars={stars}
            progressRaw={progressRaw}
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
            levelUp={levelUp}
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
  progressRaw,
  onSelect,
  onPlay,
  onExit,
}: {
  categoryId: string;
  stars: number;
  progressRaw: string;
  onSelect: (id: string) => void;
  onPlay: () => void;
  onExit: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex min-w-0 items-center gap-2 pt-1">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            stopSpeech();
            onExit();
          }}
          className={backClass}
        >
          Quay lại
        </Button>
        <div className="flex min-w-0 flex-1 justify-center">
          <StarMeter count={stars} roomy />
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-2 sm:gap-6 sm:py-6">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-balance sm:text-6xl">Học tiếng Anh</h1>
          <p className="mx-auto mt-1 max-w-md text-base font-bold leading-snug text-[#8a6248] sm:mt-3 sm:text-lg">
            Bé nghe từ tiếng Anh, rồi chạm vào bức tranh đúng.
          </p>
        </div>
        <div className="w-full">
          <p className="mb-3 text-center text-lg font-extrabold">Chọn chủ đề</p>
          <div className="grid w-full min-w-0 grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
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
                    "h-auto min-h-20 w-full min-w-0 shrink flex-col gap-1 whitespace-normal px-2 text-center text-lg leading-tight text-balance hover:bg-white sm:min-h-28 sm:text-xl",
                    softTile,
                    selected && softTileOn,
                  )}
                >
                  <TopicMark id={category.id} />
                  {category.label}
                  <LevelSteps category={category} progressRaw={progressRaw} />
                </Button>
              );
            })}
          </div>
        </div>
        <Button
          type="button"
          onClick={onPlay}
          className={cn("h-16 w-full max-w-lg text-3xl sm:h-20", chunky)}
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
  levelUp,
  stars,
  onHome,
  onHear,
  onPick,
}: {
  category: Category;
  round: Round;
  phase: "play" | "success";
  shake: { id: string; nonce: number } | null;
  levelUp: number | null;
  stars: number;
  onHome: () => void;
  onHear: () => void;
  onPick: (id: string) => void;
}) {
  return (
    <div className="flex flex-1 flex-col gap-3" data-round-top>
      <header className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onHome}
          className={backClass}
        >
          Quay lại
        </Button>
        <p className="truncate text-center text-lg font-extrabold sm:text-xl">{category.label}</p>
        <StarMeter count={stars} />
      </header>

      <section className="rounded-[2rem] border-4 border-[#ffe4cf] bg-white px-4 py-5 text-center shadow-[0_8px_0_rgba(92,51,23,0.08)] sm:px-6 sm:py-6">
        <h1 className="text-5xl font-extrabold tracking-tight text-balance text-[#5c3317] sm:text-7xl">{round.answer.en}</h1>
        <p className="mt-1 text-2xl font-extrabold text-[#c45a3c] sm:text-3xl">{round.answer.vi}</p>
        <div className="mt-3 flex justify-center">
          <Button
            type="button"
            onClick={onHear}
            className="h-14 rounded-full px-6 text-base font-extrabold sm:h-16 sm:px-8 sm:text-xl"
          >
            <Volume2 className="size-5 sm:size-7" />
            Nghe lại
          </Button>
        </div>
      </section>

      <div className="flex h-16 items-center justify-center" aria-live="polite">
        {phase === "success" && levelUp ? (
          <p className="animate-pop-in inline-flex items-center gap-2 rounded-full bg-[#ef6b4a] px-5 py-2 text-2xl font-extrabold text-white shadow-[0_6px_0_#d4533a] sm:text-3xl">
            <StarIcon filled className="size-7" />
            Lên cấp {levelUp}!
            <StarIcon filled className="size-7" />
          </p>
        ) : phase === "success" ? (
          <p className="animate-pop-in inline-flex items-center gap-2 rounded-full bg-[#2f9e6b] px-5 py-2 text-2xl font-extrabold text-white shadow-[0_6px_0_#217a52] sm:text-3xl">
            <StarIcon filled className="size-7" />
            Đúng rồi!
            <StarIcon filled className="size-7" />
          </p>
        ) : null}
      </div>

      <div className="grid w-full min-w-0 flex-1 grid-cols-3 content-start gap-2 sm:gap-4">
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
                cardFace,
                "hover:bg-white",
                correct && "scale-105 border-[#2f9e6b] ring-4 ring-[#8ed4b0]",
                shaking && "animate-card-shake",
              )}
            >
              <span className="absolute inset-0">
                <Picture word={choice} />
              </span>
              <span
                aria-hidden="true"
                className="absolute top-1.5 left-1.5 z-10 flex size-6 items-center justify-center rounded-full bg-white/95 text-xs font-extrabold text-[#5c3317] shadow-sm ring-2 ring-[#ffe4cf] sm:size-7 sm:text-sm"
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
