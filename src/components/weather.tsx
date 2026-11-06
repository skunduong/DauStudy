import { useId } from "react";

/**
 * Cartoon weather scenes drawn in a 100×100 box, in a soft "clay" style:
 * gradient skies, chunky shapes with a highlight and a soft drop shadow, and friendly faces.
 */

const skies: Record<string, [string, string]> = {
  sunny: ["#5ec2ff", "#c6ecff"],
  cloudy: ["#93abc4", "#d5e1ec"],
  rainy: ["#7189a3", "#b3c3d3"],
  snowy: ["#a9caec", "#eef6fd"],
  windy: ["#7fd0ff", "#d9f3ff"],
  stormy: ["#232f47", "#55627c"],
  rainbow: ["#74c6ff", "#dcf2ff"],
  foggy: ["#b9c3cd", "#eaeef2"],
  hot: ["#ff8a3d", "#ffe29a"],
  cold: ["#8fd0ff", "#eefaff"],
  night: ["#0f1c4d", "#34478c"],
  sunset: ["#7b5cd6", "#ffb370"],
  puddle: ["#8cc8ff", "#e6f4ff"],
  tornado: ["#7d889c", "#cfd6e0"],
};

export function isWeather(id: string) {
  return id in skies;
}

type Ids = ReturnType<typeof makeIds>;

function makeIds(prefix: string) {
  const p = prefix.replace(/[^a-zA-Z0-9_-]/g, "");
  return {
    sky: `${p}-sky`,
    sun: `${p}-sun`,
    ray: `${p}-ray`,
    cloud: `${p}-cloud`,
    grey: `${p}-grey`,
    dark: `${p}-dark`,
    drop: `${p}-drop`,
    bolt: `${p}-bolt`,
    leaf: `${p}-leaf`,
    snow: `${p}-snow`,
    moon: `${p}-moon`,
    moonCut: `${p}-moon-cut`,
    sea: `${p}-sea`,
    water: `${p}-water`,
    funnel: `${p}-funnel`,
    skin: `${p}-skin`,
    shadow: `${p}-shadow`,
    blur: `${p}-blur`,
  };
}

function Defs({ ids, sky }: { ids: Ids; sky: [string, string] }) {
  return (
    <defs>
      <linearGradient id={ids.sky} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={sky[0]} />
        <stop offset="1" stopColor={sky[1]} />
      </linearGradient>
      <radialGradient id={ids.sun} cx="0.4" cy="0.35" r="0.7">
        <stop offset="0" stopColor="#fff6a8" />
        <stop offset="0.55" stopColor="#ffd21f" />
        <stop offset="1" stopColor="#ff9f0a" />
      </radialGradient>
      <linearGradient id={ids.ray} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffc93c" />
        <stop offset="1" stopColor="#ff9500" />
      </linearGradient>
      {/* Cloud gradients run in the cloud's own coordinates (top -25, bottom 13). */}
      <linearGradient id={ids.cloud} gradientUnits="userSpaceOnUse" x1="0" y1="-25" x2="0" y2="13">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#d9e6f4" />
      </linearGradient>
      <linearGradient id={ids.grey} gradientUnits="userSpaceOnUse" x1="0" y1="-25" x2="0" y2="13">
        <stop offset="0" stopColor="#f1f5f9" />
        <stop offset="1" stopColor="#a9b8c9" />
      </linearGradient>
      <linearGradient id={ids.dark} gradientUnits="userSpaceOnUse" x1="0" y1="-25" x2="0" y2="13">
        <stop offset="0" stopColor="#a3adbf" />
        <stop offset="1" stopColor="#5d6880" />
      </linearGradient>
      <linearGradient id={ids.drop} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8fd0ff" />
        <stop offset="1" stopColor="#1f6fe0" />
      </linearGradient>
      <linearGradient id={ids.bolt} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff27a" />
        <stop offset="1" stopColor="#ffae00" />
      </linearGradient>
      <linearGradient id={ids.leaf} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7fe08f" />
        <stop offset="1" stopColor="#21a356" />
      </linearGradient>
      <linearGradient id={ids.snow} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#dbe9f7" />
      </linearGradient>
      <radialGradient id={ids.moon} cx="0.35" cy="0.35" r="0.75">
        <stop offset="0" stopColor="#fffbe0" />
        <stop offset="0.55" stopColor="#ffe36b" />
        <stop offset="1" stopColor="#f2b82e" />
      </radialGradient>
      <mask id={ids.moonCut} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
        <circle cx="52" cy="46" r="27" fill="#ffffff" />
        <circle cx="66" cy="36" r="23" fill="#000000" />
      </mask>
      <linearGradient id={ids.sea} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7a5fd0" />
        <stop offset="1" stopColor="#2f2770" />
      </linearGradient>
      <linearGradient id={ids.water} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#a6dcff" />
        <stop offset="1" stopColor="#2f86e0" />
      </linearGradient>
      <linearGradient id={ids.funnel} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#f4f6f9" />
        <stop offset="0.55" stopColor="#bcc6d3" />
        <stop offset="1" stopColor="#8a97aa" />
      </linearGradient>
      <radialGradient id={ids.skin} cx="0.4" cy="0.35" r="0.7">
        <stop offset="0" stopColor="#ffe6cf" />
        <stop offset="1" stopColor="#f3b98a" />
      </radialGradient>
      <filter id={ids.shadow} x="-30%" y="-30%" width="160%" height="170%">
        <feDropShadow dx="0" dy="2.2" stdDeviation="1.8" floodColor="#0b2545" floodOpacity="0.22" />
      </filter>
      <filter id={ids.blur} x="-20%" y="-100%" width="140%" height="300%">
        <feGaussianBlur stdDeviation="1.6" />
      </filter>
    </defs>
  );
}

const url = (id: string) => `url(#${id})`;

function Cloud({
  ids,
  x,
  y,
  s = 1,
  tone = "cloud",
}: {
  ids: Ids;
  x: number;
  y: number;
  s?: number;
  tone?: "cloud" | "grey" | "dark";
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} filter={url(ids.shadow)}>
      <g fill={url(ids[tone])}>
        <circle cx="0" cy="0" r="12" />
        <circle cx="15" cy="-9" r="15.5" />
        <circle cx="31" cy="-1" r="12" />
        <rect x="-12" y="-1" width="55" height="14" rx="7" />
      </g>
      <ellipse cx="9" cy="-15" rx="6" ry="3.2" fill="#ffffff" opacity={tone === "dark" ? 0.25 : 0.75} transform="rotate(-22 9 -15)" />
    </g>
  );
}

type Mood = "happy" | "worried" | "blow" | "sleepy" | "hot" | "cold";

function Face({ x, y, s = 1, mood = "happy", ink = "#3d2a12" }: { x: number; y: number; s?: number; mood?: Mood; ink?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="-7.5" cy="3" rx="2.8" ry="1.7" fill="#ff7a93" opacity={mood === "hot" ? 0.85 : 0.55} />
      <ellipse cx="7.5" cy="3" rx="2.8" ry="1.7" fill="#ff7a93" opacity={mood === "hot" ? 0.85 : 0.55} />
      {mood === "sleepy" ? (
        <g stroke={ink} strokeWidth="1.4" fill="none" strokeLinecap="round">
          <path d="M-6.5 -2 q1.8 1.6 3.6 0" />
          <path d="M2.9 -2 q1.8 1.6 3.6 0" />
        </g>
      ) : mood === "hot" ? (
        <g stroke={ink} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M-6.6 -3.8 L-3.4 -2 L-6.6 -0.2" />
          <path d="M6.6 -3.8 L3.4 -2 L6.6 -0.2" />
        </g>
      ) : (
        <g>
          <ellipse cx="-4.6" cy="-2" rx="1.7" ry="2.2" fill={ink} />
          <ellipse cx="4.6" cy="-2" rx="1.7" ry="2.2" fill={ink} />
          <circle cx="-4.1" cy="-2.8" r="0.65" fill="#ffffff" />
          <circle cx="5.1" cy="-2.8" r="0.65" fill="#ffffff" />
        </g>
      )}
      {(mood === "worried" || mood === "cold") && (
        <g stroke={ink} strokeWidth="1.2" strokeLinecap="round">
          <line x1="-6.6" y1="-5.4" x2="-3" y2="-6.8" />
          <line x1="6.6" y1="-5.4" x2="3" y2="-6.8" />
        </g>
      )}
      {mood === "blow" ? (
        <ellipse cx="0" cy="3.6" rx="1.9" ry="2.2" fill={ink} />
      ) : mood === "worried" ? (
        <ellipse cx="0" cy="3.8" rx="1.6" ry="1.3" fill={ink} />
      ) : mood === "hot" ? (
        <g>
          <path d="M-3 2 Q0 1.2 3 2 Q3 6.6 0 6.6 Q-3 6.6 -3 2Z" fill={ink} />
          <ellipse cx="0" cy="5.4" rx="1.7" ry="1.1" fill="#ff7a93" />
        </g>
      ) : mood === "cold" ? (
        <g>
          <rect x="-4.2" y="1.8" width="8.4" height="3.8" rx="1.2" fill="#ffffff" stroke={ink} strokeWidth="0.8" />
          <path d="M-4.2 3.7 l1.4 -1 l1.4 1 l1.4 -1 l1.4 1 l1.4 -1 l1.4 1" fill="none" stroke={ink} strokeWidth="0.6" strokeLinejoin="round" />
        </g>
      ) : (
        <path d="M-3.4 2.2 Q0 6.4 3.4 2.2Z" fill={ink} />
      )}
    </g>
  );
}

function Drop({ ids, x, y, s = 1 }: { ids: Ids; x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 -7 C2.6 -3 4.6 -0.4 4.6 2.6 A4.6 4.6 0 0 1 -4.6 2.6 C-4.6 -0.4 -2.6 -3 0 -7Z" fill={url(ids.drop)} />
      <ellipse cx="-1.6" cy="1.6" rx="1" ry="1.7" fill="#ffffff" opacity="0.7" />
    </g>
  );
}

function Flake({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const arm = "M0 0 V-6 M0 -3.6 L-2 -5.4 M0 -3.6 L2 -5.4";
  const arms = [0, 60, 120, 180, 240, 300].map((deg) => <path key={deg} d={arm} transform={`rotate(${deg})`} />);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" strokeLinecap="round">
      <g stroke="#7fb0e6" strokeWidth="2.8">{arms}</g>
      <g stroke="#ffffff" strokeWidth="1.4">{arms}</g>
    </g>
  );
}

function Leaf({ ids, x, y, r, fill }: { ids: Ids; x: number; y: number; r: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <path d="M-5 0 Q0 -4.5 5 0 Q0 4.5 -5 0Z" fill={fill ?? url(ids.leaf)} />
      <path d="M-4 0 H4" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="0.7" strokeLinecap="round" />
    </g>
  );
}

function Thermometer({ x, level, color }: { x: number; level: number; color: string }) {
  // A tube 54 tall from y=22; `level` is how full it is, 0..1.
  const top = 74 - level * 48;
  return (
    <g>
      <rect x={x - 6} y="20" width="12" height="60" rx="6" fill="#ffffff" stroke="#c9d3df" strokeWidth="1.2" />
      <rect x={x - 2.6} y={top} width="5.2" height={80 - top} rx="2.6" fill={color} />
      <circle cx={x} cy="81" r="8.5" fill={color} stroke="#ffffff" strokeWidth="2" />
      <g stroke="#c9d3df" strokeWidth="1" strokeLinecap="round">
        <line x1={x + 6} y1="32" x2={x + 3.4} y2="32" />
        <line x1={x + 6} y1="44" x2={x + 3.4} y2="44" />
        <line x1={x + 6} y1="56" x2={x + 3.4} y2="56" />
      </g>
      <ellipse cx={x - 3} cy="79" rx="2" ry="2.8" fill="#ffffff" opacity="0.6" />
    </g>
  );
}

function Twinkle({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <path
      d="M0 -4 Q0.6 -0.6 4 0 Q0.6 0.6 0 4 Q-0.6 0.6 -4 0 Q-0.6 -0.6 0 -4Z"
      transform={`translate(${x} ${y}) scale(${s})`}
      fill="#fff4b0"
    />
  );
}

function Boot({ ids, x, y, flip = false }: { ids: Ids; x: number; y: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <path d="M-6 -26 H6 V-8 C13 -8 17 -4 17 1 V3 H-6Z" fill={url(ids.bolt)} stroke="#e29a00" strokeWidth="1" strokeLinejoin="round" />
      <rect x="-7.4" y="-28.6" width="14.8" height="4.6" rx="2.3" fill="#ffd43b" stroke="#e29a00" strokeWidth="0.8" />
      <rect x="-6.8" y="2" width="24.6" height="3.4" rx="1.7" fill="#c97a00" />
      <ellipse cx="-2.4" cy="-17" rx="1.4" ry="5" fill="#ffffff" opacity="0.6" />
    </g>
  );
}

function Scene({ id, ids }: { id: string; ids: Ids }) {
  switch (id) {
    case "sunny":
      return (
        <g filter={url(ids.shadow)}>
          {Array.from({ length: 10 }, (_, index) => (
            <path
              key={index}
              d="M-5.5 -26 Q0 -43 5.5 -26Z"
              fill={url(ids.ray)}
              stroke={url(ids.ray)}
              strokeWidth="2.4"
              strokeLinejoin="round"
              transform={`translate(50 52) rotate(${index * 36})`}
            />
          ))}
          <circle cx="50" cy="52" r="25" fill={url(ids.sun)} />
          <ellipse cx="40" cy="38" rx="7" ry="4" fill="#ffffff" opacity="0.55" transform="rotate(-30 40 38)" />
          <Face x={50} y={54} s={1.45} />
        </g>
      );
    case "cloudy":
      return (
        <>
          <Cloud ids={ids} x={10} y={38} s={0.85} tone="grey" />
          <Cloud ids={ids} x={33} y={66} s={1.15} />
          <Face x={51} y={65} s={1.05} ink="#3b4a5c" />
        </>
      );
    case "rainy":
      return (
        <>
          <Cloud ids={ids} x={22} y={36} s={1.12} tone="grey" />
          <Face x={39} y={36} s={1.05} mood="sleepy" ink="#3b4a5c" />
          <Drop ids={ids} x={24} y={63} />
          <Drop ids={ids} x={42} y={69} />
          <Drop ids={ids} x={60} y={63} />
          <Drop ids={ids} x={76} y={70} s={0.85} />
          <Drop ids={ids} x={32} y={86} s={0.9} />
          <Drop ids={ids} x={52} y={89} s={0.9} />
          <Drop ids={ids} x={68} y={86} s={0.8} />
        </>
      );
    case "snowy":
      return (
        <>
          <path d="M0 84 Q22 75 48 82 T100 79 V100 H0Z" fill={url(ids.snow)} filter={url(ids.shadow)} />
          <Cloud ids={ids} x={22} y={32} s={1.08} />
          <Face x={38.5} y={32} s={1.02} ink="#3b4a5c" />
          <Flake x={22} y={58} />
          <Flake x={47} y={64} s={1.1} />
          <Flake x={72} y={56} />
          <Flake x={33} y={76} s={0.8} />
          <Flake x={61} y={75} s={0.85} />
          <Flake x={84} y={71} s={0.7} />
        </>
      );
    case "windy":
      return (
        <>
          <g transform="translate(-6 0) rotate(12 78 92)">
            <rect x="75" y="56" width="6" height="38" rx="3" fill="#a0652e" />
            <g filter={url(ids.shadow)}>
              <circle cx="78" cy="48" r="13" fill={url(ids.leaf)} />
              <circle cx="70" cy="56" r="8" fill={url(ids.leaf)} />
              <circle cx="87" cy="55" r="8" fill={url(ids.leaf)} />
              <ellipse cx="73" cy="42" rx="4" ry="2.4" fill="#ffffff" opacity="0.45" transform="rotate(-25 73 42)" />
            </g>
          </g>
          <Cloud ids={ids} x={14} y={30} s={0.72} />
          <Face x={25} y={30} s={0.85} mood="blow" ink="#3b4a5c" />
          <g stroke="#ffffff" strokeWidth="3.6" fill="none" strokeLinecap="round" filter={url(ids.shadow)}>
            <path d="M42 34 H60 q7 0 7 -6 q0 -5 -5 -5 q-4 0 -4 4" />
            <path d="M40 46 H66" />
            <path d="M12 62 H48 q8 0 8 7 q0 6 -6 6 q-5 0 -5 -5" />
            <path d="M18 80 H38" />
          </g>
          <Leaf ids={ids} x={58} y={56} r={-28} />
          <Leaf ids={ids} x={30} y={88} r={18} fill="#ffa63d" />
          <Leaf ids={ids} x={64} y={84} r={40} fill="#ff7b54" />
        </>
      );
    case "stormy":
      return (
        <>
          <Drop ids={ids} x={22} y={66} />
          <Drop ids={ids} x={30} y={86} s={0.9} />
          <Drop ids={ids} x={76} y={64} />
          <Drop ids={ids} x={82} y={84} s={0.9} />
          <path
            d="M53 42 L38 68 H49 L43 93 L68 60 H56 L63 42Z"
            fill={url(ids.bolt)}
            stroke="#ffb000"
            strokeWidth="1.6"
            strokeLinejoin="round"
            filter={url(ids.shadow)}
          />
          <Cloud ids={ids} x={20} y={32} s={1.15} tone="dark" />
          <Face x={37.5} y={32} s={1.08} mood="worried" ink="#1f2638" />
        </>
      );
    case "rainbow":
      return (
        <>
          <g fill="none" strokeWidth="6.2" filter={url(ids.shadow)}>
            {["#ff4d4d", "#ff9f1c", "#ffd93d", "#4cd07d", "#3a8dff", "#9b5de5"].map((color, index) => (
              <path
                key={color}
                d={`M${13 + index * 6} 80 A${37 - index * 6} ${37 - index * 6} 0 0 1 ${87 - index * 6} 80`}
                stroke={color}
              />
            ))}
          </g>
          <path d="M16 80 A34 34 0 0 1 34 50" fill="none" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="1.6" strokeLinecap="round" />
          <Cloud ids={ids} x={8} y={80} s={0.6} />
          <Cloud ids={ids} x={74} y={80} s={0.6} />
        </>
      );
    case "foggy":
      return (
        <>
          <circle cx="68" cy="34" r="14" fill="#fff3c4" opacity="0.9" />
          <path d="M0 80 Q30 66 60 76 T100 72 V100 H0Z" fill="#a9b9b0" />
          <g fill="#8fa89a">
            <path d="M18 80 Q24 50 30 80Z" />
            <path d="M30 80 Q38 40 46 80Z" />
            <path d="M74 76 Q80 54 86 76Z" />
          </g>
          <g stroke="#ffffff" strokeLinecap="round" filter={url(ids.blur)}>
            <line x1="6" y1="44" x2="58" y2="44" strokeWidth="7" opacity="0.85" />
            <line x1="32" y1="57" x2="94" y2="57" strokeWidth="8" opacity="0.9" />
            <line x1="4" y1="70" x2="68" y2="70" strokeWidth="8" opacity="0.9" />
            <line x1="36" y1="84" x2="96" y2="84" strokeWidth="9" opacity="0.95" />
          </g>
        </>
      );
    case "hot":
      return (
        <>
          <path d="M0 84 Q28 76 56 83 T100 80 V100 H0Z" fill="#ffd27f" />
          <g stroke="#ff7a1a" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6">
            <path d="M40 93 q3 -3 6 0 t6 0 t6 0" />
            <path d="M70 94 q3 -3 6 0 t6 0 t6 0" />
          </g>
          <g filter={url(ids.shadow)}>
            <Thermometer x={18} level={0.92} color="#ff3b30" />
          </g>
          <g filter={url(ids.shadow)}>
            {Array.from({ length: 10 }, (_, index) => (
              <path
                key={index}
                d="M-5.5 -26 Q0 -43 5.5 -26Z"
                fill={url(ids.ray)}
                stroke={url(ids.ray)}
                strokeWidth="2.4"
                strokeLinejoin="round"
                transform={`translate(62 46) rotate(${index * 36 + 18}) scale(0.78)`}
              />
            ))}
            <circle cx="62" cy="46" r="20" fill={url(ids.sun)} />
            <ellipse cx="54" cy="35" rx="5.5" ry="3.2" fill="#ffffff" opacity="0.55" transform="rotate(-30 54 35)" />
            <Face x={62} y={48} s={1.2} mood="hot" />
          </g>
          <Drop ids={ids} x={41} y={36} s={0.55} />
          <Drop ids={ids} x={84} y={30} s={0.5} />
        </>
      );
    case "cold":
      return (
        <>
          <path d="M0 86 Q30 80 60 86 T100 84 V100 H0Z" fill="#dcefff" />
          <path
            d="M0 0 H100 V7 H93 L90 17 L87 7 H78 L75 22 L72 7 H62 L60 14 L58 7 H40 L37 19 L34 7 H24 L22 13 L20 7 H11 L8 18 L5 7 H0Z"
            fill={url(ids.snow)}
            filter={url(ids.shadow)}
          />
          <g filter={url(ids.shadow)}>
            <Thermometer x={84} level={0.12} color="#2f86ff" />
          </g>
          <g filter={url(ids.shadow)}>
            <circle cx="42" cy="56" r="21" fill={url(ids.skin)} />
            <path d="M20 54 Q20 29 42 29 Q64 29 64 54Z" fill="#ff5a5f" />
            <rect x="19" y="48" width="46" height="9" rx="4.5" fill="#e0444b" />
            <circle cx="42" cy="28" r="5.5" fill="#ffffff" />
            <rect x="24" y="73" width="38" height="9" rx="4.5" fill="#3a8dff" />
            <rect x="48" y="76" width="8" height="17" rx="3" fill="#2f76e0" />
          </g>
          <Face x={42} y={64} s={1.05} mood="cold" ink="#3b4a5c" />
          <g stroke="#5aa9e6" strokeWidth="1.6" fill="none" strokeLinecap="round">
            <path d="M15 56 q-3 4 0 8" />
            <path d="M10 54 q-3 6 0 12" />
            <path d="M69 56 q3 4 0 8" />
          </g>
        </>
      );
    case "night":
      return (
        <>
          <Twinkle x={14} y={18} s={0.9} />
          <Twinkle x={84} y={14} s={0.7} />
          <Twinkle x={88} y={46} s={1} />
          <Twinkle x={18} y={52} s={0.6} />
          <Twinkle x={70} y={70} s={0.7} />
          <circle cx="30" cy="30" r="1" fill="#fff4b0" />
          <circle cx="76" cy="30" r="0.9" fill="#fff4b0" />
          <circle cx="10" cy="72" r="0.9" fill="#fff4b0" />
          <circle cx="52" cy="46" r="34" fill="#fff6c0" opacity="0.1" />
          <g filter={url(ids.shadow)}>
            <circle cx="52" cy="46" r="27" fill={url(ids.moon)} mask={url(ids.moonCut)} />
          </g>
          <g transform="rotate(-38 40 56)">
            <Face x={40} y={56} s={0.82} mood="sleepy" ink="#7a4b12" />
          </g>
          <g stroke="#dfe7ff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M68 52 h5 l-5 6 h5" />
            <path d="M76 42 h3.6 l-3.6 4.4 h3.6" />
          </g>
          <path d="M0 86 Q25 77 50 84 T100 80 V100 H0Z" fill="#1b2a60" />
        </>
      );
    case "sunset":
      return (
        <>
          <g fill="none" stroke="#4a2f6b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 26 q3 -3 6 0 q3 -3 6 0" />
            <path d="M30 18 q2.2 -2.2 4.4 0 q2.2 -2.2 4.4 0" />
            <path d="M72 24 q2.6 -2.6 5.2 0 q2.6 -2.6 5.2 0" />
          </g>
          <g filter={url(ids.shadow)}>
            <circle cx="50" cy="70" r="24" fill={url(ids.sun)} />
            <ellipse cx="42" cy="56" rx="5.5" ry="3.2" fill="#ffffff" opacity="0.5" transform="rotate(-30 42 56)" />
          </g>
          <Face x={50} y={61} s={1.15} mood="sleepy" />
          <rect x="0" y="70" width="100" height="30" fill={url(ids.sea)} />
          <g stroke="#ffcf6b" strokeLinecap="round">
            <line x1="32" y1="75" x2="68" y2="75" strokeWidth="2.6" />
            <line x1="38" y1="81" x2="62" y2="81" strokeWidth="2.4" opacity="0.85" />
            <line x1="43" y1="87" x2="57" y2="87" strokeWidth="2.2" opacity="0.7" />
            <line x1="47" y1="93" x2="53" y2="93" strokeWidth="2" opacity="0.55" />
          </g>
        </>
      );
    case "puddle":
      return (
        <>
          <Cloud ids={ids} x={14} y={22} s={0.62} tone="grey" />
          <Drop ids={ids} x={18} y={38} s={0.55} />
          <Drop ids={ids} x={30} y={42} s={0.5} />
          <path d="M0 62 Q50 55 100 62 V100 H0Z" fill={url(ids.leaf)} />
          <g filter={url(ids.shadow)}>
            <ellipse cx="52" cy="82" rx="42" ry="12" fill={url(ids.water)} />
          </g>
          <g fill="none" stroke="#ffffff" strokeLinecap="round" opacity="0.7">
            <ellipse cx="52" cy="83" rx="30" ry="7.5" strokeWidth="1.2" />
            <ellipse cx="22" cy="80" rx="7" ry="2" strokeWidth="1" />
            <ellipse cx="84" cy="85" rx="6" ry="1.8" strokeWidth="1" />
          </g>
          <g filter={url(ids.shadow)}>
            <Boot ids={ids} x={44} y={80} flip />
            <Boot ids={ids} x={60} y={81} />
          </g>
          <Drop ids={ids} x={30} y={64} s={0.5} />
          <Drop ids={ids} x={74} y={62} s={0.55} />
          <Drop ids={ids} x={38} y={56} s={0.4} />
          <Drop ids={ids} x={68} y={54} s={0.4} />
        </>
      );
    case "tornado":
      return (
        <>
          <path d="M0 84 Q30 78 60 84 T100 82 V100 H0Z" fill={url(ids.leaf)} />
          <ellipse cx="46" cy="88" rx="16" ry="3.6" fill="#8d7b6a" opacity="0.35" />
          <g filter={url(ids.shadow)}>
            {[
              [50, 16, 70],
              [53, 26, 60],
              [55, 36, 50],
              [54, 46, 40],
              [51, 56, 31],
              [48, 66, 22],
              [46, 76, 13],
            ].map(([cx, y, w]) => (
              <rect key={y} x={cx - w / 2} y={y} width={w} height="11" rx="5.5" fill={url(ids.funnel)} />
            ))}
          </g>
          <g fill="none" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" opacity="0.75">
            <path d="M22 20 q14 4 30 0" />
            <path d="M34 50 q10 3 20 0" />
            <path d="M40 70 q6 2 12 0" />
          </g>
          <Face x={53} y={33} s={1.05} mood="blow" ink="#3b4a5c" />
          <Leaf ids={ids} x={16} y={44} r={-30} />
          <Leaf ids={ids} x={84} y={56} r={35} fill="#ffa63d" />
          <Leaf ids={ids} x={24} y={72} r={60} fill="#ff7b54" />
        </>
      );
    default:
      return null;
  }
}

export function WeatherPicture({ id }: { id: string }) {
  const ids = makeIds(`wx-${id}-${useId()}`);
  const sky = skies[id];
  if (!sky) return null;
  return (
    <span aria-hidden="true" className="absolute inset-0">
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
        <Defs ids={ids} sky={sky} />
        <rect width="100" height="100" fill={url(ids.sky)} />
        <Scene id={id} ids={ids} />
      </svg>
    </span>
  );
}
