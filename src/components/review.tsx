"use client";

import { useEffect, useState } from "react";
import { Volume2 } from "lucide-react";
import { Flashcards } from "@/components/flashcards";
import { Picture } from "@/components/picture";
import { TopicMark } from "@/components/topic-mark";
import { Button } from "@/components/ui/button";
import { speakEnglish, stopSpeech } from "@/lib/speech";
import { backClass, chunky, shell, softTile } from "@/lib/look";
import { categories, categoryById, type Category } from "@/lib/words";
import { cn } from "@/lib/utils";

export function Review({ onExit }: { onExit: () => void }) {
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [quizzing, setQuizzing] = useState(false);
  const category = categoryId ? categoryById(categoryId) : null;

  useEffect(() => {
    return () => stopSpeech();
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
      if (!category || done || quizzing || typingTarget(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
      speakEnglish(category.words[index].en);
    }

    function onKeyUp(event: KeyboardEvent) {
      if (event.code !== "Space" || !category || done || quizzing || typingTarget(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
    }

    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("keyup", onKeyUp, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("keyup", onKeyUp, true);
    };
  }, [category, done, index, quizzing]);

  if (quizzing && category) {
    return <Flashcards quizCategoryId={category.id} onExit={() => setQuizzing(false)} />;
  }

  function openTopic(id: string) {
    const next = categoryById(id);
    setCategoryId(id);
    setIndex(0);
    setDone(false);
    speakEnglish(next.words[0].en);
  }

  function leaveTopic() {
    stopSpeech();
    setCategoryId(null);
    setDone(false);
    setIndex(0);
  }

  return (
    <div className={cn(shell, category ? "h-full overflow-hidden" : "min-h-full")}>
      <div
        className={cn(
          "mx-auto flex w-full min-w-0 max-w-3xl flex-col overflow-x-clip px-4 sm:px-6 md:max-w-6xl",
          category ? "h-full pt-2 pb-3" : "min-h-full py-4 sm:py-6",
        )}
      >
        {category ? (
          <TopicReview
            category={category}
            index={index}
            done={done}
            onBack={leaveTopic}
            onPrev={() => {
              if (done) {
                setDone(false);
                speakEnglish(category.words[index].en);
                return;
              }
              if (index === 0) return;
              const next = index - 1;
              setIndex(next);
              speakEnglish(category.words[next].en);
            }}
            onNext={() => {
              if (index >= category.words.length - 1) {
                stopSpeech();
                setDone(true);
                return;
              }
              const next = index + 1;
              setIndex(next);
              speakEnglish(category.words[next].en);
            }}
            onHear={() => speakEnglish(category.words[index].en)}
            onQuiz={() => {
              stopSpeech();
              setQuizzing(true);
            }}
          />
        ) : (
          <TopicList onExit={onExit} onOpen={openTopic} />
        )}
      </div>
    </div>
  );
}

function TopicList({ onExit, onOpen }: { onExit: () => void; onOpen: (id: string) => void }) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="pt-1">
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
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-6 py-6">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">Ôn bài</h1>
          <p className="mx-auto mt-3 max-w-md text-base font-bold text-[#8a6248] sm:text-lg">
            Chọn chủ đề
          </p>
        </div>
        <div className="grid w-full min-w-0 grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              type="button"
              variant="outline"
              onClick={() => onOpen(category.id)}
              className={cn(
                "h-auto min-h-24 w-full min-w-0 shrink flex-col gap-1 whitespace-normal px-2 text-center text-lg leading-tight text-balance hover:bg-white sm:min-h-28 sm:text-xl",
                softTile,
              )}
            >
              <TopicMark id={category.id} />
              {category.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TopicReview({
  category,
  index,
  done,
  onBack,
  onPrev,
  onNext,
  onHear,
  onQuiz,
}: {
  category: Category;
  index: number;
  done: boolean;
  onBack: () => void;
  onPrev: () => void;
  onNext: () => void;
  onHear: () => void;
  onQuiz: () => void;
}) {
  const word = category.words[index];
  const total = category.words.length;
  const place = `${done ? total : index + 1}/${total}`;

  return (
    <div className="flex h-full min-h-0 flex-col gap-2 sm:gap-4">
      <header className="grid shrink-0 min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className={backClass}
        >
          Quay lại
        </Button>
        <p className="truncate text-center text-xl font-extrabold sm:text-2xl">{category.label}</p>
        <p className="text-xl font-extrabold text-[#8a6248]" aria-label={`Thẻ ${place}`}>
          {place}
        </p>
      </header>

      {done ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <p className="text-5xl font-extrabold tracking-tight sm:text-6xl">Ôn xong rồi</p>
          <p className="text-2xl font-bold text-[#8a6248]">{category.label}</p>
          <Button
            type="button"
            onClick={onQuiz}
            className={cn("h-24 w-full max-w-lg text-4xl", chunky)}
          >
            Chơi ôn
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onPrev}
            className={cn(backClass, "w-full max-w-lg text-2xl")}
          >
            Trước
          </Button>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col items-center gap-2 md:flex-row md:items-stretch md:gap-8">
          <div className="@container grid min-h-0 w-full flex-1 place-items-center">
            <div className="relative aspect-square size-[min(100cqw,100cqh)] overflow-hidden rounded-[1.6rem] border-4 border-[#ffe4cf] bg-white shadow-[0_6px_0_rgba(92,51,23,0.08)]">
              <Picture word={word} />
            </div>
          </div>
          <div className="flex w-full shrink-0 flex-col items-center gap-2 md:w-80 md:justify-center">
            <div className="text-center">
              <h1 className="text-5xl leading-none font-extrabold tracking-tight text-balance text-[#5c3317] md:text-6xl">{word.en}</h1>
              <p className="mt-1 text-2xl leading-tight font-bold text-[#8a6248]">{word.vi}</p>
            </div>
            <Button type="button" onClick={onHear} className={cn("h-12 w-full px-2 text-base md:h-16 md:text-lg", chunky)}>
              <Volume2 className="size-5" />
              Nghe lại
            </Button>
            <div className="grid w-full min-w-0 grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={index === 0}
                onClick={onPrev}
                className={cn(softTile, "h-12 w-full min-w-0 shrink rounded-full text-xl hover:bg-white md:h-16 md:text-2xl")}
              >
                Trước
              </Button>
              <Button type="button" onClick={onNext} className={cn("h-12 w-full min-w-0 shrink text-xl md:h-16 md:text-2xl", chunky)}>
                Tiếp
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
