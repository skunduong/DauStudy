import { currentLevel, topicProgress, topLevel } from "@/lib/progress";
import type { Category } from "@/lib/words";
import { cn } from "@/lib/utils";

/**
 * A little staircase for parents: one step per level, the steps already climbed in orange, then how
 * many of the topic's words are open.
 */
export function LevelSteps({ category, progressRaw }: { category: Category; progressRaw: string }) {
  const progress = topicProgress(progressRaw, category);
  const level = currentLevel(category, progress);
  const top = topLevel(category);
  const total = category.words.length;
  return (
    <span
      className="flex items-center gap-1.5 text-sm leading-none font-bold text-[#8a6248]"
      aria-label={`Cấp ${level}, đã mở ${progress.open} trên ${total} từ`}
    >
      <span className="flex items-end gap-0.5" aria-hidden="true">
        {Array.from({ length: top }, (_, step) => (
          <span
            key={step}
            className={cn("block w-2 rounded-[3px]", step < level ? "bg-[#ef6b4a]" : "bg-[#ffe4cf]")}
            style={{ height: 6 + step * 4 }}
          />
        ))}
      </span>
      <span aria-hidden="true">
        {progress.open}/{total}
      </span>
    </span>
  );
}
