"use client";

import { useState } from "react";
import { Flashcards } from "@/components/flashcards";
import { Picture } from "@/components/picture";
import { Thinking } from "@/components/thinking";
import { Button } from "@/components/ui/button";
import { categoryById } from "@/lib/words";
import { cn } from "@/lib/utils";

const shell =
  "min-h-dvh bg-[radial-gradient(circle_at_8%_0%,#ffe7a3_0,transparent_32%),radial-gradient(circle_at_100%_8%,#ffc2d1_0,transparent_28%),radial-gradient(circle_at_80%_100%,#c7ecff_0,transparent_34%),#fff6ea] text-foreground";

export function Hub() {
  const [door, setDoor] = useState<"home" | "english" | "thinking">("home");

  if (door === "english") return <Flashcards onExit={() => setDoor("home")} />;
  if (door === "thinking") return <Thinking onExit={() => setDoor("home")} />;

  const english = [
    categoryById("animals").words[0],
    categoryById("fruits").words[0],
    categoryById("colors").words[0],
  ];
  const thinking = [
    categoryById("shapes").words[0],
    categoryById("shapes").words[3],
    categoryById("shapes").words[4],
  ];

  return (
    <div className={shell}>
      <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 py-4 sm:px-6 sm:py-6">
        <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
          <Door
            title="Học tiếng Anh"
            hint="Nghe và chạm"
            tone="bg-rose-500 text-white shadow-[0_10px_0_#be123c]"
            words={english}
            onClick={() => setDoor("english")}
          />
          <Door
            title="Phát triển tư duy"
            hint="Nhìn và tìm"
            tone="bg-sky-500 text-white shadow-[0_10px_0_#0369a1]"
            words={thinking}
            onClick={() => setDoor("thinking")}
          />
        </div>
      </div>
    </div>
  );
}

function Door({
  title,
  hint,
  tone,
  words,
  onClick,
}: {
  title: string;
  hint: string;
  tone: string;
  words: { id: string; en: string; vi: string }[];
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      className={cn(
        "h-auto min-h-[46dvh] flex-col gap-5 rounded-[2.2rem] px-6 py-8 whitespace-normal active:translate-y-1",
        tone,
      )}
    >
      <span className="flex items-center justify-center gap-3">
        {words.map((word) => (
          <span key={word.id} className="relative block size-16 overflow-hidden rounded-full bg-white sm:size-20">
            <Picture word={word} />
          </span>
        ))}
      </span>
      <span className="text-center text-4xl leading-tight font-extrabold text-balance sm:text-5xl">{title}</span>
      <span className="text-2xl font-extrabold text-white/90 sm:text-3xl">{hint}</span>
    </Button>
  );
}
