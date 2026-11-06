"use client";

import { useState, type ReactNode } from "react";
import { EnglishArt, ReviewArt, ThinkingArt } from "@/components/door-art";
import { Flashcards } from "@/components/flashcards";
import { Review } from "@/components/review";
import { Thinking } from "@/components/thinking";
import { Button } from "@/components/ui/button";
import { shell } from "@/lib/look";
import { cn } from "@/lib/utils";

export function Hub() {
  const [door, setDoor] = useState<"home" | "english" | "thinking" | "review">("home");

  if (door === "english") return <Flashcards onExit={() => setDoor("home")} />;
  if (door === "thinking") return <Thinking onExit={() => setDoor("home")} />;
  if (door === "review") return <Review onExit={() => setDoor("home")} />;

  return (
    <div className={cn(shell, "h-full overflow-hidden")}>
      <div className="mx-auto flex h-full w-full min-w-0 max-w-6xl items-stretch px-3 py-3 md:items-center md:px-6 md:py-6">
        <div className="grid h-full w-full min-w-0 grid-cols-1 grid-rows-3 gap-2 md:h-auto md:grid-cols-3 md:grid-rows-1 md:gap-4">
          <Door title="Học tiếng Anh" hint="Nghe và chạm" art={<EnglishArt />} onClick={() => setDoor("english")} />
          <Door title="Phát triển tư duy" hint="Nhìn và tìm" art={<ThinkingArt />} onClick={() => setDoor("thinking")} />
          <Door title="Ôn bài" hint="Xem từng từ" art={<ReviewArt />} onClick={() => setDoor("review")} />
        </div>
      </div>
    </div>
  );
}

function Door({
  title,
  hint,
  art,
  onClick,
}: {
  title: string;
  hint: string;
  art: ReactNode;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className="h-full min-h-0 w-full min-w-0 max-w-full shrink flex-col justify-center gap-1 overflow-hidden rounded-[1.8rem] border-4 border-[#ffe4cf] bg-white px-3 py-2 text-[#5c3317] whitespace-normal shadow-[0_8px_0_rgba(92,51,23,0.08)] hover:bg-white active:translate-y-1 active:shadow-[0_4px_0_rgba(92,51,23,0.08)] sm:gap-2 sm:rounded-[2.2rem] sm:px-5 sm:py-4 md:h-auto"
    >
      <span className="relative min-h-0 w-full min-w-0 flex-1 overflow-hidden md:aspect-[4/3] md:flex-none">{art}</span>
      <span className="max-w-full text-center text-2xl leading-tight font-extrabold text-balance sm:text-4xl lg:text-5xl">{title}</span>
      <span className="text-base font-bold text-[#8a6248] sm:text-xl">{hint}</span>
    </Button>
  );
}
