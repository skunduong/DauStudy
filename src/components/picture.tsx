import Image from "next/image";
import { colorSwatches, type Word } from "@/lib/words";

/** One solid color per shape so the cards read as different at a glance. */
const shapeFill: Record<string, string> = {
  circle: "#e10600",
  square: "#0057ff",
  triangle: "#ffc400",
  star: "#ff6a00",
  heart: "#ff4f9a",
  rectangle: "#00a651",
  oval: "#7a2ea8",
  diamond: "#8a4b1f",
};

function ShapeMark({ id }: { id: string }) {
  const fill = shapeFill[id];
  if (!fill) return null;
  if (id === "circle") return <circle cx="50" cy="50" r="44" fill={fill} />;
  if (id === "square") return <rect x="7" y="7" width="86" height="86" rx="2" fill={fill} />;
  if (id === "triangle") return <polygon points="50,5 95,94 5,94" fill={fill} />;
  if (id === "rectangle") return <rect x="4" y="18" width="92" height="64" rx="2" fill={fill} />;
  if (id === "oval") return <ellipse cx="50" cy="50" rx="46" ry="32" fill={fill} />;
  if (id === "diamond") return <polygon points="50,4 96,50 50,96 4,50" fill={fill} />;
  if (id === "star") {
    return (
      <polygon
        points="50.0,4.0 60.9,35.0 93.7,35.8 67.6,55.7 77.0,87.2 50.0,68.5 23.0,87.2 32.4,55.7 6.3,35.8 39.1,35.0"
        fill={fill}
      />
    );
  }
  if (id === "heart") {
    return (
      <path
        d="M50 94C20 72 5 56 5 36 5 18 18 7 33 11 42 14 47 23 50 31 53 23 58 14 67 11 82 7 95 18 95 36 95 56 80 72 50 94Z"
        fill={fill}
      />
    );
  }
  return null;
}

export function Picture({ word }: { word: Word }) {
  const swatch = colorSwatches[word.id];
  if (swatch) {
    return <span aria-hidden="true" className="absolute inset-0" style={{ backgroundColor: swatch }} />;
  }
  if (shapeFill[word.id]) {
    return (
      <span aria-hidden="true" className="absolute inset-0 bg-[#fff8f0]">
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 size-full">
          <ShapeMark id={word.id} />
        </svg>
      </span>
    );
  }
  return (
    <Image
      src={`/cards/${word.id}.jpg?v=2`}
      alt=""
      fill
      sizes="(max-width: 768px) 34vw, 240px"
      className="object-cover"
    />
  );
}
