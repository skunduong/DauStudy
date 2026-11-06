"use client";

import { useEffect, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { readChildName, saveChildName } from "@/lib/child";
import { canvas, chunky, shell } from "@/lib/look";
import { setMusicMuted, startMusic } from "@/lib/music";
import { isChildName, normalizeChildName } from "@/lib/phrases";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/** Nothing to subscribe to: these values only differ between the server render and the browser. */
function subscribeNothing() {
  return () => {};
}

export function CourseFrame({ children }: { children: ReactNode }) {
  // False while rendering on the server, true in the browser, without setting state in an effect.
  const ready = useSyncExternalStore(subscribeNothing, () => true, () => false);
  const savedName = useSyncExternalStore(subscribeNothing, readChildName, () => null);
  const [typedName, setTypedName] = useState<string | null>(null);
  const name = typedName ?? savedName;
  const [draft, setDraft] = useState("");

  useEffect(() => {
    setMusicMuted(false);
  }, []);

  useEffect(() => {
    if (!ready || !name) return;
    const onTap = () => {
      startMusic();
      window.removeEventListener("click", onTap);
    };
    window.addEventListener("click", onTap);
    return () => window.removeEventListener("click", onTap);
  }, [ready, name]);

  function begin(event: FormEvent) {
    event.preventDefault();
    const next = normalizeChildName(draft);
    if (!isChildName(next)) return;
    saveChildName(next);
    setTypedName(next);
    startMusic();
  }

  const cleaned = normalizeChildName(draft);
  const canStart = isChildName(cleaned);

  return (
    <div className={cn(shell, canvas, "flex h-dvh flex-col overflow-hidden")}>
      {ready && name ? (
        <p className="pointer-events-none shrink-0 px-3 pt-2 text-right text-sm leading-tight font-bold text-[#8a6248] sm:px-6 sm:pt-3 sm:text-base">
          Chào bé {name}
        </p>
      ) : null}
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      {!ready ? <div className="fixed inset-0 z-40 bg-[#fff7ee]" /> : null}
      {ready && !name ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#5c3317]/35 p-4 sm:items-center">
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="child-name-title"
            onSubmit={begin}
            className="w-full max-w-md rounded-[2rem] border-4 border-[#ffe4cf] bg-white px-6 py-7 shadow-[0_18px_0_rgba(92,51,23,0.12)]"
          >
            <p className="text-center text-sm font-extrabold tracking-wide text-[#c45a3c]">Học cùng Bình Minh</p>
            <h1 id="child-name-title" className="mt-2 text-center text-4xl font-extrabold tracking-tight text-balance text-[#5c3317] sm:text-5xl">
              Bé tên là gì?
            </h1>
            <input
              autoFocus
              value={draft}
              maxLength={24}
              autoComplete="given-name"
              enterKeyHint="done"
              aria-label="Tên của bé"
              onChange={(event) => setDraft(event.target.value.slice(0, 24))}
              className="mt-6 h-20 w-full rounded-full border-4 border-[#ffe4cf] bg-[#fff7ee] px-6 text-center text-3xl font-extrabold text-[#5c3317] outline-none focus:border-[#ef6b4a]"
            />
            {draft.trim() && !canStart ? (
              <p className="mt-3 text-center text-base font-bold text-[#8a6248]">Viết tên bằng chữ thôi</p>
            ) : (
              <p className="mt-3 text-center text-base font-bold text-[#8a6248]">Ba mẹ gõ tên, bé bấm nút</p>
            )}
            <Button type="submit" disabled={!canStart} className={cn("mt-5 h-20 w-full text-3xl", chunky)}>
              Bắt đầu
            </Button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
