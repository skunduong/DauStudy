import { Picture } from "@/components/picture";
import { colorSwatches, categoryById } from "@/lib/words";

const photoId: Record<string, string> = {
  animals: "cat",
  fruits: "apple",
  objects: "ball",
  actions: "jump",
  body: "hand",
  jobs: "doctor",
  vehicles: "bus",
  weather: "rainbow",
};

const colorIds = ["red", "blue", "yellow", "green"] as const;
const shapeIds = ["triangle", "square", "star"] as const;

export function TopicMark({ id }: { id: string }) {
  if (id === "colors") {
    return (
      <span className="flex items-end justify-center gap-1" aria-hidden="true">
        {colorIds.map((color, index) => (
          <span
            key={color}
            className="block size-5 rounded-md ring-2 ring-white sm:size-6"
            style={{
              backgroundColor: colorSwatches[color],
              transform: `rotate(${[-10, -3, 4, 12][index]}deg)`,
            }}
          />
        ))}
      </span>
    );
  }

  if (id === "shapes") {
    const shapes = categoryById("shapes").words;
    return (
      <span className="flex items-center justify-center gap-0.5" aria-hidden="true">
        {shapeIds.map((shapeId) => {
          const word = shapes.find((item) => item.id === shapeId);
          if (!word) return null;
          return (
            <span key={shapeId} className="relative block size-8 overflow-hidden rounded-md sm:size-9">
              <Picture word={word} />
            </span>
          );
        })}
      </span>
    );
  }

  const word = categoryById(id).words.find((item) => item.id === photoId[id]) ?? categoryById(id).words[0];
  return (
    <span className="relative block size-14 overflow-hidden rounded-2xl bg-white" aria-hidden="true">
      <Picture word={word} />
    </span>
  );
}
