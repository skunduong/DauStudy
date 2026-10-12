"use client";

import { useEffect, useRef, useState } from "react";
import { Picture } from "@/components/picture";
import { Button } from "@/components/ui/button";
import { playPraise, playWrong, stopSpeech } from "@/lib/speech";
import {
  makeMemoryBoard,
  makeOddRound,
  makePatternRound,
  type MemoryCard,
  type OddRound,
  type PatternRound,
} from "@/lib/thinking";
import type { Word } from "@/lib/words";
import { cn } from "@/lib/utils";

const shell =
  "min-h-dvh bg-[radial-gradient(circle_at_8%_0%,#ffe7a3_0,transparent_32%),radial-gradient(circle_at_100%_8%,#ffc2d1_0,transparent_28%),radial-gradient(circle_at_80%_100%,#c7ecff_0,transparent_34%),#fff6ea] text-foreground";

type GameId = "pairs" | "odd" | "next";

export function Thinking({ onExit }: { onExit: () => void }) {
  const [game, setGame] = useState<GameId | null>(null);

  useEffect(() => {
    return () => stopSpeech();
  }, []);

  return (
    <div className={shell}>
      <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-4 py-4 sm:px-6 sm:py-6">
        {game === null ? <GameMenu onExit={onExit} onPick={setGame} /> : null}
        {game === "pairs" ? <PairsGame onBack={() => setGame(null)} /> : null}
        {game === "odd" ? <OddGame onBack={() => setGame(null)} /> : null}
        {game === "next" ? <NextGame onBack={() => setGame(null)} /> : null}
      </div>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => {
        stopSpeech();
        onClick();
      }}
      className="h-14 rounded-full border-4 border-white bg-white/90 px-5 text-xl font-extrabold"
    >
      Quay lại
    </Button>
  );
}

function Cheer({ show }: { show: boolean }) {
  return (
    <div className="flex h-16 items-center justify-center" aria-live="polite">
      {show ? (
        <p className="animate-pop-in rounded-full bg-emerald-500 px-5 py-2 text-3xl font-extrabold text-white shadow-[0_6px_0_#047857]">
          Đúng rồi!
        </p>
      ) : null}
    </div>
  );
}

function GameMenu({ onExit, onPick }: { onExit: () => void; onPick: (id: GameId) => void }) {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <BackButton onClick={onExit} />
      <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl">Phát triển tư duy</h1>
      <div className="flex flex-1 flex-col gap-4">
        <MenuDoor title="Tìm cặp" hint="Lật hai thẻ giống nhau" tone="bg-amber-400 text-amber-950 shadow-[0_8px_0_#d97706]" onClick={() => onPick("pairs")} />
        <MenuDoor title="Tìm hình khác" hint="Chạm hình không giống" tone="bg-fuchsia-400 text-fuchsia-950 shadow-[0_8px_0_#c026d3]" onClick={() => onPick("odd")} />
        <MenuDoor title="Làm tiếp" hint="Chạm hình tiếp theo" tone="bg-lime-400 text-lime-950 shadow-[0_8px_0_#65a30d]" onClick={() => onPick("next")} />
      </div>
    </div>
  );
}

function MenuDoor({
  title,
  hint,
  tone,
  onClick,
}: {
  title: string;
  hint: string;
  tone: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      className={cn("h-auto min-h-32 flex-1 flex-col gap-1 rounded-[2rem] whitespace-normal", tone)}
    >
      <span className="text-4xl font-extrabold">{title}</span>
      <span className="text-2xl font-extrabold opacity-80">{hint}</span>
    </Button>
  );
}

function PieceFace({ word }: { word: Word }) {
  return (
    <span className="absolute inset-0">
      <Picture word={word} />
    </span>
  );
}

function PairsGame({ onBack }: { onBack: () => void }) {
  const [board, setBoard] = useState<MemoryCard[]>(() => makeMemoryBoard());
  const [up, setUp] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [shake, setShake] = useState<string[]>([]);
  const [cheer, setCheer] = useState(false);
  const lock = useRef(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  function tap(card: MemoryCard) {
    if (lock.current || matched.includes(card.word.id) || up.includes(card.key)) return;
    const next = [...up, card.key];
    setUp(next);
    if (next.length < 2) return;
    const first = board.find((item) => item.key === next[0]);
    const second = board.find((item) => item.key === next[1]);
    if (!first || !second) return;
    if (first.word.id === second.word.id) {
      const done = [...matched, first.word.id];
      setMatched(done);
      setUp([]);
      playPraise();
      if (done.length === 3) {
        setCheer(true);
        lock.current = true;
        timer.current = window.setTimeout(() => {
          setBoard(makeMemoryBoard());
          setMatched([]);
          setUp([]);
          setCheer(false);
          lock.current = false;
        }, 1400);
      }
      return;
    }
    lock.current = true;
    setShake([first.key, second.key]);
    playWrong();
    timer.current = window.setTimeout(() => {
      setUp([]);
      setShake([]);
      lock.current = false;
    }, 900);
  }

  return (
    <div className="flex flex-1 flex-col gap-3">
      <header className="flex items-center gap-3">
        <BackButton onClick={onBack} />
        <h1 className="flex-1 text-center text-3xl font-extrabold sm:text-4xl">Tìm cặp</h1>
      </header>
      <p className="text-center text-2xl font-extrabold text-muted-foreground">Lật hai thẻ giống nhau</p>
      <Cheer show={cheer} />
      <div className="grid flex-1 grid-cols-3 content-start gap-3 sm:gap-4">
        {board.map((card) => {
          const open = up.includes(card.key) || matched.includes(card.word.id);
          const shaking = shake.includes(card.key);
          return (
            <Button
              key={card.key}
              type="button"
              variant="outline"
              onClick={() => tap(card)}
              aria-label={open ? card.word.vi : "Thẻ úp"}
              className={cn(
                "relative aspect-square h-auto overflow-hidden rounded-[1.6rem] border-4 border-white p-0 shadow-[0_7px_0_rgba(80,50,20,0.14)]",
                open ? "bg-white" : "bg-amber-400 hover:bg-amber-400",
                matched.includes(card.word.id) && "border-emerald-400 ring-4 ring-emerald-400",
                shaking && "animate-card-shake",
              )}
            >
              {open ? <PieceFace word={card.word} /> : <span className="text-6xl font-extrabold text-white">?</span>}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

function OddGame({ onBack }: { onBack: () => void }) {
  const [round, setRound] = useState<OddRound>(() => makeOddRound(1));
  const [shake, setShake] = useState<string | null>(null);
  const [cheer, setCheer] = useState(false);
  const lock = useRef(false);
  const timer = useRef<number | null>(null);
  const roundId = useRef(1);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  function tap(card: OddRound["cards"][number]) {
    if (lock.current) return;
    if (card.odd) {
      lock.current = true;
      setCheer(true);
      playPraise();
      timer.current = window.setTimeout(() => {
        roundId.current += 1;
        setRound(makeOddRound(roundId.current));
        setCheer(false);
        setShake(null);
        lock.current = false;
      }, 1400);
      return;
    }
    setShake(card.key);
    playWrong();
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setShake(null), 520);
  }

  return (
    <div className="flex flex-1 flex-col gap-3">
      <header className="flex items-center gap-3">
        <BackButton onClick={onBack} />
        <h1 className="flex-1 text-center text-3xl font-extrabold sm:text-4xl">Tìm hình khác</h1>
      </header>
      <p className="text-center text-2xl font-extrabold text-muted-foreground">Chạm hình không giống</p>
      <Cheer show={cheer} />
      <div className="grid flex-1 grid-cols-2 content-start gap-3 sm:gap-4">
        {round.cards.map((card) => (
          <Button
            key={card.key}
            type="button"
            variant="outline"
            disabled={cheer}
            onClick={() => tap(card)}
            aria-label={card.word.vi}
            className={cn(
              "relative aspect-square h-auto overflow-hidden rounded-[1.6rem] border-4 border-white bg-white p-0 shadow-[0_7px_0_rgba(80,50,20,0.14)] disabled:opacity-100",
              cheer && card.odd && "border-emerald-400 ring-4 ring-emerald-400",
              shake === card.key && "animate-card-shake",
            )}
          >
            <PieceFace word={card.word} />
          </Button>
        ))}
      </div>
    </div>
  );
}

function NextGame({ onBack }: { onBack: () => void }) {
  const [round, setRound] = useState<PatternRound>(() => makePatternRound(1));
  const [shake, setShake] = useState<string | null>(null);
  const [cheer, setCheer] = useState(false);
  const lock = useRef(false);
  const timer = useRef<number | null>(null);
  const roundId = useRef(1);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  function tap(word: Word) {
    if (lock.current) return;
    if (word.id === round.answerId) {
      lock.current = true;
      setCheer(true);
      playPraise();
      timer.current = window.setTimeout(() => {
        roundId.current += 1;
        setRound(makePatternRound(roundId.current));
        setCheer(false);
        setShake(null);
        lock.current = false;
      }, 1400);
      return;
    }
    setShake(word.id);
    playWrong();
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setShake(null), 520);
  }

  return (
    <div className="flex flex-1 flex-col gap-3">
      <header className="flex items-center gap-3">
        <BackButton onClick={onBack} />
        <h1 className="flex-1 text-center text-3xl font-extrabold sm:text-4xl">Làm tiếp</h1>
      </header>
      <p className="text-center text-2xl font-extrabold text-muted-foreground">Chạm hình tiếp theo</p>
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {round.sequence.map((word, index) => (
          <span
            key={`${round.id}-${index}`}
            className="relative aspect-square overflow-hidden rounded-2xl border-4 border-white bg-white shadow-[0_5px_0_rgba(80,50,20,0.12)]"
          >
            <Picture word={word} />
          </span>
        ))}
        <span className="flex aspect-square items-center justify-center rounded-2xl border-4 border-dashed border-amber-400 bg-white text-4xl font-extrabold text-amber-500">
          ?
        </span>
      </div>
      <Cheer show={cheer} />
      <div className="grid flex-1 grid-cols-3 content-start gap-3 sm:gap-4">
        {round.choices.map((word) => (
          <Button
            key={`${round.id}-${word.id}`}
            type="button"
            variant="outline"
            disabled={cheer}
            onClick={() => tap(word)}
            aria-label={word.vi}
            className={cn(
              "relative aspect-square h-auto overflow-hidden rounded-[1.6rem] border-4 border-white bg-white p-0 shadow-[0_7px_0_rgba(80,50,20,0.14)] disabled:opacity-100",
              cheer && word.id === round.answerId && "border-emerald-400 ring-4 ring-emerald-400",
              shake === word.id && "animate-card-shake",
            )}
          >
            <PieceFace word={word} />
          </Button>
        ))}
      </div>
    </div>
  );
}
