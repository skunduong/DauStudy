"use client";

import { useEffect, useRef, useState } from "react";
import { Picture } from "@/components/picture";
import { Button } from "@/components/ui/button";
import { shuffle } from "@/lib/game";
import { thinkingLines } from "@/lib/phrases";
import { playPraise, playWrong, speakVietnamese, stopSpeech } from "@/lib/speech";
import { backClass, cardFace, shell, softTile } from "@/lib/look";
import {
  makeColorSortRound,
  makeCountRound,
  makeMemoryBoard,
  makeOddRound,
  makePatternRound,
  makePuzzleRound,
  makeShadowRound,
  makeSizeRound,
  type ColorSortRound,
  type CountRound,
  type MemoryCard,
  type OddRound,
  type PatternRound,
  type PuzzleRound,
  type ShadowRound,
  type SizeRound,
} from "@/lib/thinking";
import { colorSwatches, type Word } from "@/lib/words";
import { cn } from "@/lib/utils";

type GameId = "pairs" | "odd" | "next" | "shadow" | "count" | "colors" | "puzzle" | "size" | "feelings";

export function Thinking({ onExit }: { onExit: () => void }) {
  const [game, setGame] = useState<GameId | null>(null);

  useEffect(() => {
    return () => stopSpeech();
  }, []);

  return (
    <div className={cn(shell, "min-h-full")}>
      <div className="mx-auto flex min-h-full w-full min-w-0 max-w-3xl flex-col overflow-x-clip px-4 py-4 sm:px-6 md:max-w-6xl md:py-6">
        {game === null ? <GameMenu onExit={onExit} onPick={setGame} /> : null}
        {game === "pairs" ? <PairsGame onBack={() => setGame(null)} /> : null}
        {game === "odd" ? <OddGame onBack={() => setGame(null)} /> : null}
        {game === "next" ? <NextGame onBack={() => setGame(null)} /> : null}
        {game === "shadow" ? <ShadowGame onBack={() => setGame(null)} /> : null}
        {game === "count" ? <CountGame onBack={() => setGame(null)} /> : null}
        {game === "colors" ? <ColorGame onBack={() => setGame(null)} /> : null}
        {game === "puzzle" ? <PuzzleGame onBack={() => setGame(null)} /> : null}
        {game === "size" ? <SizeGame onBack={() => setGame(null)} /> : null}
        {game === "feelings" ? <FeelingsGame onBack={() => setGame(null)} /> : null}
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
      className={backClass}
    >
      Quay lại
    </Button>
  );
}

function SpokenPrompt({ text }: { text: string }) {
  useEffect(() => {
    speakVietnamese(text);
  }, [text]);
  return <p className="text-center text-lg font-bold text-[#8a6248]">{text}</p>;
}

function Cheer({ show }: { show: boolean }) {
  return (
    <div className="flex h-16 items-center justify-center" aria-live="polite">
      {show ? (
        <p className="animate-pop-in rounded-full bg-[#2f9e6b] px-5 py-2 text-3xl font-extrabold text-white shadow-[0_6px_0_#217a52]">
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
      <h1 className="text-center text-3xl font-extrabold tracking-tight text-balance sm:text-5xl">Phát triển tư duy</h1>
      <div className="grid w-full min-w-0 flex-1 grid-cols-2 gap-3 md:grid-cols-3">
        <MenuDoor title="Tìm cặp" hint="Lật hai thẻ giống nhau" onClick={() => onPick("pairs")} />
        <MenuDoor title="Tìm hình khác" hint="Chạm hình không giống" onClick={() => onPick("odd")} />
        <MenuDoor title="Làm tiếp" hint="Chạm hình tiếp theo" onClick={() => onPick("next")} />
        <MenuDoor title="Ghép bóng" hint="Chạm bóng giống hình" onClick={() => onPick("shadow")} />
        <MenuDoor title="Đếm" hint="Đếm rồi chạm số" onClick={() => onPick("count")} />
        <MenuDoor title="Phân loại" hint="Chạm đúng màu" onClick={() => onPick("colors")} />
        <MenuDoor title="Ghép hình" hint="Ghép 4 mảnh" onClick={() => onPick("puzzle")} />
        <MenuDoor title="To và nhỏ" hint="Chạm hình to" onClick={() => onPick("size")} />
        <MenuDoor title="Cảm xúc" hint="Chạm mặt đúng" onClick={() => onPick("feelings")} />
      </div>
    </div>
  );
}

function MenuDoor({
  title,
  hint,
  onClick,
}: {
  title: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className={cn(
        "h-auto min-h-24 w-full min-w-0 max-w-full shrink flex-col gap-1 whitespace-normal px-2 py-3 text-balance hover:bg-white sm:min-h-28 sm:px-3",
        softTile,
      )}
    >
      <span className="text-center text-2xl leading-tight font-extrabold sm:text-3xl">{title}</span>
      <span className="text-center text-base leading-tight font-bold text-[#8a6248] sm:text-lg">{hint}</span>
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
  const life = useRef(0);

  useEffect(() => {
    return () => {
      life.current += 1;
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
      const movingOn = done.length === 3;
      if (movingOn) setCheer(true);
      lock.current = true;
      const stamp = life.current;
      void playPraise().then(() => {
        if (stamp !== life.current) return;
        if (movingOn) {
          setBoard(makeMemoryBoard());
          setMatched([]);
          setUp([]);
          setCheer(false);
        }
        lock.current = false;
      });
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
      <header className="flex min-w-0 items-center gap-2">
        <BackButton onClick={onBack} />
        <h1 className="min-w-0 flex-1 text-center text-2xl font-extrabold text-balance sm:text-4xl">Tìm cặp</h1>
      </header>
      <SpokenPrompt text={thinkingLines.pairs} />
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
                open ? "bg-white" : "bg-[#f0b45a] hover:bg-[#f0b45a]",
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
  const life = useRef(0);

  useEffect(() => {
    return () => {
      life.current += 1;
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  function tap(card: OddRound["cards"][number]) {
    if (lock.current) return;
    if (card.odd) {
      lock.current = true;
      setCheer(true);
      const stamp = life.current;
      void playPraise().then(() => {
        if (stamp !== life.current) return;
        roundId.current += 1;
        setRound(makeOddRound(roundId.current));
        setCheer(false);
        setShake(null);
        lock.current = false;
      });
      return;
    }
    setShake(card.key);
    playWrong();
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setShake(null), 520);
  }

  return (
    <div className="flex flex-1 flex-col gap-3">
      <header className="flex min-w-0 items-center gap-2">
        <BackButton onClick={onBack} />
        <h1 className="min-w-0 flex-1 text-center text-2xl font-extrabold text-balance sm:text-4xl">Tìm hình khác</h1>
      </header>
      <SpokenPrompt text={thinkingLines.odd} />
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
  const life = useRef(0);

  useEffect(() => {
    return () => {
      life.current += 1;
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  function tap(word: Word) {
    if (lock.current) return;
    if (word.id === round.answerId) {
      lock.current = true;
      setCheer(true);
      const stamp = life.current;
      void playPraise().then(() => {
        if (stamp !== life.current) return;
        roundId.current += 1;
        setRound(makePatternRound(roundId.current));
        setCheer(false);
        setShake(null);
        lock.current = false;
      });
      return;
    }
    setShake(word.id);
    playWrong();
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setShake(null), 520);
  }

  return (
    <div className="flex flex-1 flex-col gap-3">
      <header className="flex min-w-0 items-center gap-2">
        <BackButton onClick={onBack} />
        <h1 className="min-w-0 flex-1 text-center text-2xl font-extrabold text-balance sm:text-4xl">Làm tiếp</h1>
      </header>
      <SpokenPrompt text={thinkingLines.next} />
      <div className="grid w-full min-w-0 grid-cols-5 gap-2 sm:gap-3">
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

const SHADOW = "#2c2640";

function useRoundFeedback() {
  const [cheer, setCheer] = useState(false);
  const [shake, setShake] = useState<string | null>(null);
  const lock = useRef(false);
  const timer = useRef<number | null>(null);
  const life = useRef(0);

  useEffect(() => {
    return () => {
      life.current += 1;
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  function clearTimer() {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }

  function succeed(next: () => void) {
    if (lock.current) return;
    lock.current = true;
    setCheer(true);
    clearTimer();
    const stamp = life.current;
    void playPraise().then(() => {
      if (stamp !== life.current) return;
      next();
      setCheer(false);
      setShake(null);
      lock.current = false;
    });
  }

  function miss(id: string) {
    if (lock.current) return;
    setShake(id);
    playWrong();
    clearTimer();
    timer.current = window.setTimeout(() => setShake(null), 520);
  }

  return { cheer, shake, succeed, miss };
}

function ShadowGame({ onBack }: { onBack: () => void }) {
  const [round, setRound] = useState<ShadowRound>(() => makeShadowRound(1));
  const roundId = useRef(1);
  const { cheer, shake, succeed, miss } = useRoundFeedback();

  function tap(word: Word) {
    if (word.id === round.target.id) {
      succeed(() => {
        roundId.current += 1;
        setRound(makeShadowRound(roundId.current));
      });
      return;
    }
    miss(word.id);
  }

  return (
    <div className="flex flex-1 flex-col gap-3">
      <header className="flex min-w-0 items-center gap-2">
        <BackButton onClick={onBack} />
        <h1 className="min-w-0 flex-1 text-center text-2xl font-extrabold text-balance sm:text-4xl">Ghép bóng</h1>
      </header>
      <SpokenPrompt text={thinkingLines.shadow} />
      <div className="mx-auto w-full max-w-52 sm:max-w-64">
        <span className="relative block aspect-square overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-[0_7px_0_rgba(80,50,20,0.14)]">
          <Picture word={round.target} />
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
            aria-label={`Bóng ${word.vi}`}
            className={cn(
              "relative aspect-square h-auto overflow-hidden rounded-[1.6rem] border-4 border-white bg-[#efeaf8] p-0 shadow-[0_7px_0_rgba(80,50,20,0.14)] disabled:opacity-100",
              cheer && word.id === round.target.id && "border-emerald-400 ring-4 ring-emerald-400",
              shake === word.id && "animate-card-shake",
            )}
          >
            <Picture word={word} fill={SHADOW} />
          </Button>
        ))}
      </div>
    </div>
  );
}

function CountGame({ onBack }: { onBack: () => void }) {
  const [round, setRound] = useState<CountRound>(() => makeCountRound(0));
  const roundId = useRef(0);
  const { cheer, shake, succeed, miss } = useRoundFeedback();

  function tap(number: number) {
    if (number === round.count) {
      succeed(() => {
        roundId.current += 1;
        setRound(makeCountRound(roundId.current, round.word.id));
      });
      return;
    }
    miss(String(number));
  }

  return (
    <div className="flex flex-1 flex-col gap-3">
      <header className="flex min-w-0 items-center gap-2">
        <BackButton onClick={onBack} />
        <h1 className="min-w-0 flex-1 text-center text-2xl font-extrabold text-balance sm:text-4xl">Đếm</h1>
      </header>
      <SpokenPrompt text={thinkingLines.count} />
      <div className="flex flex-1 flex-wrap items-center justify-center gap-3">
        {Array.from({ length: round.count }, (_, index) => (
          <span
            key={`${round.id}-${index}`}
            className={cn(
              "relative overflow-hidden rounded-[1.4rem] border-4 border-white bg-white shadow-[0_6px_0_rgba(80,50,20,0.12)]",
              round.count <= 2 ? "size-36 sm:size-44" : round.count === 3 ? "size-28 sm:size-36" : "size-24 sm:size-32",
            )}
          >
            <Picture word={round.word} />
          </span>
        ))}
      </div>
      <Cheer show={cheer} />
      <div className="grid w-full min-w-0 grid-cols-5 gap-2 sm:gap-3">
        {[1, 2, 3, 4, 5].map((number) => (
          <Button
            key={number}
            type="button"
            variant="outline"
            disabled={cheer}
            onClick={() => tap(number)}
            aria-label={String(number)}
            className={cn(
              "h-16 w-full min-w-0 shrink rounded-[1.4rem] border-4 border-[#ffe4cf] bg-white text-3xl font-extrabold text-[#5c3317] shadow-[0_6px_0_rgba(92,51,23,0.1)] disabled:opacity-100 sm:h-24 sm:text-5xl",
              cheer && number === round.count && "border-emerald-400 bg-emerald-100 ring-4 ring-emerald-400",
              shake === String(number) && "animate-card-shake",
            )}
          >
            {number}
          </Button>
        ))}
      </div>
    </div>
  );
}

function ColorGame({ onBack }: { onBack: () => void }) {
  const [round, setRound] = useState<ColorSortRound>(() => makeColorSortRound(1));
  const roundId = useRef(1);
  const { cheer, shake, succeed, miss } = useRoundFeedback();

  function tap(word: Word) {
    if (word.id === round.answer.id) {
      succeed(() => {
        roundId.current += 1;
        setRound(makeColorSortRound(roundId.current));
      });
      return;
    }
    miss(word.id);
  }

  return (
    <div className="flex flex-1 flex-col gap-3">
      <header className="flex min-w-0 items-center gap-2">
        <BackButton onClick={onBack} />
        <h1 className="min-w-0 flex-1 text-center text-2xl font-extrabold text-balance sm:text-4xl">Phân loại</h1>
      </header>
      <SpokenPrompt text={thinkingLines.colors} />
      <div className="mx-auto w-full max-w-52 sm:max-w-64">
        <span className="relative block aspect-square overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-[0_7px_0_rgba(80,50,20,0.14)]">
          <Picture word={round.shape} fill={colorSwatches[round.answer.id]} />
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
              "relative aspect-square h-auto overflow-hidden rounded-[1.6rem] border-4 border-amber-100 bg-white p-0 shadow-[0_7px_0_rgba(80,50,20,0.14)] disabled:opacity-100",
              cheer && word.id === round.answer.id && "border-emerald-400 ring-4 ring-emerald-400",
              shake === word.id && "animate-card-shake",
            )}
          >
            <Picture word={word} />
          </Button>
        ))}
      </div>
    </div>
  );
}

const pieceSpot = ["left top", "right top", "left bottom", "right bottom"];

function PuzzleBit({ id, part }: { id: string; part: number }) {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        backgroundImage: `url(/cards/${id}.jpg?v=3)`,
        backgroundSize: "200% 200%",
        backgroundPosition: pieceSpot[part],
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}

function PuzzleGame({ onBack }: { onBack: () => void }) {
  const [round, setRound] = useState<PuzzleRound>(() => makePuzzleRound(1));
  const [filled, setFilled] = useState<number[]>([]);
  const roundId = useRef(1);
  const { cheer, shake, succeed, miss } = useRoundFeedback();
  const next = filled.length;
  const busy = useRef(false);

  function tap(part: number) {
    if (busy.current || cheer) return;
    if (part !== next) {
      miss(String(part));
      return;
    }
    const done = [...filled, part];
    setFilled(done);
    if (done.length === 4) {
      succeed(() => {
        roundId.current += 1;
        setRound(makePuzzleRound(roundId.current, round.word.id));
        setFilled([]);
      });
      return;
    }
    busy.current = true;
    void playPraise().then(() => {
      busy.current = false;
    });
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <header className="flex min-w-0 items-center gap-2">
        <BackButton onClick={onBack} />
        <h1 className="min-w-0 flex-1 text-center text-2xl font-extrabold text-balance sm:text-4xl">Ghép hình</h1>
      </header>
      <SpokenPrompt text={thinkingLines.puzzle} />
      <div className="mx-auto grid w-full max-w-xs grid-cols-2 gap-2 sm:max-w-sm">
        {[0, 1, 2, 3].map((slot) => (
          <span
            key={slot}
            className={cn(
              "relative aspect-square overflow-hidden rounded-[1.4rem] border-4 bg-[#fff7ee]",
              filled.includes(slot) ? "border-[#ffe4cf]" : slot === next ? "border-dashed border-[#ef6b4a]" : "border-dashed border-[#f3d7c4]",
            )}
          >
            {filled.includes(slot) ? <PuzzleBit id={round.word.id} part={slot} /> : null}
          </span>
        ))}
      </div>
      <Cheer show={cheer} />
      <div className="grid grid-cols-2 gap-4">
        {round.tray.filter((part) => !filled.includes(part)).map((part) => (
          <Button
            key={`${round.id}-${part}`}
            type="button"
            variant="outline"
            disabled={cheer}
            onClick={() => tap(part)}
            aria-label={`Mảnh ${part + 1}`}
            className={cn(cardFace, shake === String(part) && "animate-card-shake")}
          >
            <PuzzleBit id={round.word.id} part={part} />
          </Button>
        ))}
      </div>
    </div>
  );
}

function SizeGame({ onBack }: { onBack: () => void }) {
  const [round, setRound] = useState<SizeRound>(() => makeSizeRound(1));
  const roundId = useRef(1);
  const { cheer, shake, succeed, miss } = useRoundFeedback();
  const sides = round.bigFirst ? [true, false] : [false, true];

  function tap(big: boolean) {
    if (big) {
      succeed(() => {
        roundId.current += 1;
        setRound(makeSizeRound(roundId.current));
      });
      return;
    }
    miss("small");
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <header className="flex min-w-0 items-center gap-2">
        <BackButton onClick={onBack} />
        <h1 className="min-w-0 flex-1 text-center text-2xl font-extrabold text-balance sm:text-4xl">To và nhỏ</h1>
      </header>
      <SpokenPrompt text={thinkingLines.size} />
      <Cheer show={cheer} />
      <div className="flex w-full min-w-0 flex-1 items-center justify-center gap-4 sm:gap-10">
        {sides.map((big) => (
          <Button
            key={big ? "big" : "small"}
            type="button"
            variant="outline"
            disabled={cheer}
            onClick={() => tap(big)}
            aria-label={big ? "Hình to" : "Hình nhỏ"}
            className={cn(
              cardFace,
              big ? "aspect-square h-auto w-[42vw] max-w-52 sm:w-64" : "aspect-square h-auto w-[22vw] max-w-24 sm:w-28",
              cheer && big && "border-[#2f9e6b] ring-4 ring-[#8ed4b0]",
              shake === "small" && !big && "animate-card-shake",
            )}
          >
            <Picture word={round.word} />
          </Button>
        ))}
      </div>
    </div>
  );
}

const feelings = [
  { id: "vui", label: "vui" },
  { id: "buon", label: "buồn" },
  { id: "ngac", label: "ngạc nhiên" },
  { id: "so", label: "sợ" },
] as const;

type FeelingId = (typeof feelings)[number]["id"];

function FeelingFace({ id }: { id: FeelingId }) {
  const tone = id === "vui" ? "#f0b45a" : id === "buon" ? "#f3c7b0" : id === "ngac" ? "#f6d7a2" : "#e7d3c4";
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-3 size-[calc(100%-1.5rem)]" aria-hidden="true">
      <circle cx="50" cy="50" r="42" fill={tone} />
      {id === "so" ? (
        <path d="M30 32l12 8M70 32l-12 8" fill="none" stroke="#5c3317" strokeWidth="4" strokeLinecap="round" />
      ) : null}
      <circle cx="36" cy="46" r={id === "ngac" ? 6 : 4} fill="#5c3317" />
      <circle cx="64" cy="46" r={id === "ngac" ? 6 : 4} fill="#5c3317" />
      {id === "vui" ? <path d="M32 62c8 12 28 12 36 0" fill="none" stroke="#5c3317" strokeWidth="4" strokeLinecap="round" /> : null}
      {id === "buon" ? <path d="M32 72c8-10 28-10 36 0" fill="none" stroke="#5c3317" strokeWidth="4" strokeLinecap="round" /> : null}
      {id === "ngac" ? <circle cx="50" cy="68" r="8" fill="#5c3317" /> : null}
      {id === "so" ? <path d="M36 70c6 4 8-4 14 0s8-4 14 0" fill="none" stroke="#5c3317" strokeWidth="4" strokeLinecap="round" /> : null}
      {id === "buon" ? <path d="M70 52c2 8 2 12 0 16" fill="none" stroke="#c45a3c" strokeWidth="3" strokeLinecap="round" /> : null}
    </svg>
  );
}

function FeelingsGame({ onBack }: { onBack: () => void }) {
  const [roundId, setRoundId] = useState(0);
  const [choices, setChoices] = useState(() => shuffle([...feelings]));
  const answer = feelings[roundId % feelings.length];
  const { cheer, shake, succeed, miss } = useRoundFeedback();

  function tap(id: FeelingId) {
    if (id === answer.id) {
      succeed(() => {
        setRoundId((current) => current + 1);
        setChoices(shuffle([...feelings]));
      });
      return;
    }
    miss(id);
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <header className="flex min-w-0 items-center gap-2">
        <BackButton onClick={onBack} />
        <h1 className="min-w-0 flex-1 text-center text-2xl font-extrabold text-balance sm:text-4xl">Cảm xúc</h1>
      </header>
      <SpokenPrompt text={thinkingLines.feelings} />
      <p className="px-1 text-center text-5xl font-extrabold tracking-tight text-balance sm:text-7xl">{answer.label}</p>
      <Cheer show={cheer} />
      <div className="grid flex-1 grid-cols-2 content-start gap-4">
        {choices.map((feeling) => (
          <Button
            key={`${roundId}-${feeling.id}`}
            type="button"
            variant="outline"
            disabled={cheer}
            onClick={() => tap(feeling.id)}
            aria-label={feeling.label}
            className={cn(
              cardFace,
              "h-auto",
              cheer && feeling.id === answer.id && "border-[#2f9e6b] ring-4 ring-[#8ed4b0]",
              shake === feeling.id && "animate-card-shake",
            )}
          >
            <FeelingFace id={feeling.id} />
          </Button>
        ))}
      </div>
    </div>
  );
}
