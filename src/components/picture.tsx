import Image from "next/image";
import { colorSwatches, type Word } from "@/lib/words";
import { isWeather, WeatherPicture } from "@/components/weather";

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
  arrow: "#37474f",
  cross: "#d81b60",
  crescent: "#f2a900",
  semicircle: "#00a3a3",
  pentagon: "#29a8f0",
  hexagon: "#7cb518",
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
  if (id === "arrow") return <polygon points="5,36 52,36 52,13 95,50 52,87 52,64 5,64" fill={fill} />;
  if (id === "cross") {
    return <polygon points="36,6 64,6 64,36 94,36 94,64 64,64 64,94 36,94 36,64 6,64 6,36 36,36" fill={fill} />;
  }
  if (id === "crescent") return <path d="M47.4 6.1A44 44 0 1 0 89.5 69.3A38 38 0 1 1 47.4 6.1Z" fill={fill} />;
  if (id === "semicircle") return <path d="M5 73A45 45 0 0 1 95 73Z" fill={fill} />;
  if (id === "pentagon") return <polygon points="50.0,5.0 93.7,36.8 77.0,88.2 23.0,88.2 6.3,36.8" fill={fill} />;
  if (id === "hexagon") return <polygon points="50,4 89.8,27 89.8,73 50,96 10.2,73 10.2,27" fill={fill} />;
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

export function Picture({ word }: { word: Pick<Word, "id"> }) {
  const swatch = colorSwatches[word.id];
  if (swatch) {
    return <span aria-hidden="true" className="absolute inset-0" style={{ background: swatch }} />;
  }
  if (isWeather(word.id)) {
    return <WeatherPicture id={word.id} />;
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
