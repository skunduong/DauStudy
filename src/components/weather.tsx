/** Cartoon weather scenes drawn in a 100×100 box. Each one has its own sky so the cards differ at a glance. */

const sky: Record<string, string> = {
  sunny: "#8fd3ff",
  cloudy: "#b4c6d8",
  rainy: "#93a8bd",
  snowy: "#d6e6f5",
  windy: "#bfe8ff",
  stormy: "#3f4d66",
  rainbow: "#a6dcff",
  foggy: "#d5dbe1",
};

export function isWeather(id: string) {
  return id in sky;
}

function Cloud({ x, y, s = 1, fill = "#ffffff" }: { x: number; y: number; s?: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
      <circle cx="0" cy="0" r="12" />
      <circle cx="15" cy="-9" r="15" />
      <circle cx="31" cy="-2" r="12" />
      <rect x="-12" y="-2" width="55" height="14" rx="7" />
    </g>
  );
}

function Face({ x, y, s = 1, color = "#5a3a00" }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="-5" cy="-2" r="2" fill={color} />
      <circle cx="5" cy="-2" r="2" fill={color} />
      <path d="M-5 3 Q0 8 5 3" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </g>
  );
}

function Drop({ x, y }: { x: number; y: number }) {
  return <path d={`M${x} ${y} q-3.5 6 0 8.5 q3.5 -2.5 0 -8.5Z`} fill="#2f7fe0" />;
}

function Flake({ x, y, r = 4.5 }: { x: number; y: number; r?: number }) {
  const arms = [0, 60, 120].map((deg) => {
    const rad = (deg * Math.PI) / 180;
    const dx = Math.cos(rad) * r;
    const dy = Math.sin(rad) * r;
    return <line key={deg} x1={x - dx} y1={y - dy} x2={x + dx} y2={y + dy} />;
  });
  return (
    <g stroke="#4f8fd6" strokeWidth="1.6" strokeLinecap="round">
      {arms}
    </g>
  );
}

function Scene({ id }: { id: string }) {
  switch (id) {
    case "sunny":
      return (
        <>
          <g stroke="#ffb300" strokeWidth="5" strokeLinecap="round">
            {Array.from({ length: 12 }, (_, index) => {
              const rad = (index * 30 * Math.PI) / 180;
              return (
                <line
                  key={index}
                  x1={50 + Math.cos(rad) * 31}
                  y1={50 + Math.sin(rad) * 31}
                  x2={50 + Math.cos(rad) * 43}
                  y2={50 + Math.sin(rad) * 43}
                />
              );
            })}
          </g>
          <circle cx="50" cy="50" r="25" fill="#ffd60a" />
          <Face x={50} y={51} s={1.5} />
        </>
      );
    case "cloudy":
      return (
        <>
          <Cloud x={8} y={40} s={0.9} fill="#eef3f8" />
          <Cloud x={34} y={66} s={1.15} />
          <Face x={52} y={66} s={1.1} color="#5c6b7a" />
        </>
      );
    case "rainy":
      return (
        <>
          <Cloud x={20} y={34} s={1.15} fill="#e6ebf0" />
          <Face x={38} y={34} s={1.1} color="#5c6b7a" />
          <Drop x={22} y={58} />
          <Drop x={38} y={64} />
          <Drop x={54} y={58} />
          <Drop x={70} y={64} />
          <Drop x={30} y={78} />
          <Drop x={46} y={84} />
          <Drop x={62} y={78} />
        </>
      );
    case "snowy":
      return (
        <>
          <path d="M0 86 Q25 78 50 85 T100 83 V100 H0Z" fill="#ffffff" />
          <Cloud x={20} y={30} s={1.1} fill="#ffffff" />
          <Face x={37} y={30} s={1.05} color="#5c6b7a" />
          <Flake x={22} y={56} />
          <Flake x={45} y={62} />
          <Flake x={68} y={55} />
          <Flake x={32} y={74} r={3.8} />
          <Flake x={58} y={75} r={3.8} />
          <Flake x={80} y={70} r={3.4} />
        </>
      );
    case "windy":
      return (
        <>
          <rect x="70" y="58" width="6" height="34" rx="2" fill="#8a5a2b" />
          <ellipse cx="80" cy="50" rx="17" ry="13" fill="#2fae5f" transform="rotate(18 80 50)" />
          <g stroke="#ffffff" strokeWidth="4.5" fill="none" strokeLinecap="round">
            <path d="M6 32 H44 q10 0 10 -8 q0 -7 -7 -7 q-6 0 -6 6" />
            <path d="M6 50 H56" />
            <path d="M6 68 H38 q9 0 9 8 q0 7 -7 7 q-6 0 -6 -6" />
          </g>
          <ellipse cx="62" cy="38" rx="4" ry="2.4" fill="#52c46f" transform="rotate(-30 62 38)" />
          <ellipse cx="54" cy="78" rx="4" ry="2.4" fill="#f2a33a" transform="rotate(25 54 78)" />
        </>
      );
    case "stormy":
      return (
        <>
          <Cloud x={20} y={32} s={1.15} fill="#7d8799" />
          <polygon points="52,44 38,70 49,70 42,94 66,62 54,62 62,44" fill="#ffd60a" />
          <Drop x={22} y={60} />
          <Drop x={30} y={78} />
          <Drop x={74} y={58} />
          <Drop x={80} y={76} />
        </>
      );
    case "rainbow":
      return (
        <>
          <g fill="none" strokeWidth="6">
            {["#e10600", "#ff8a00", "#ffd60a", "#2fae5f", "#2f7fe0", "#7a2ea8"].map((color, index) => (
              <path key={color} d={`M${12 + index * 6} 80 A${38 - index * 6} ${38 - index * 6} 0 0 1 ${88 - index * 6} 80`} stroke={color} />
            ))}
          </g>
          <Cloud x={6} y={80} s={0.55} />
          <Cloud x={76} y={80} s={0.55} />
        </>
      );
    case "foggy":
      return (
        <>
          <circle cx="68" cy="34" r="14" fill="#f4e7b0" />
          <path d="M14 82 L24 52 L34 82Z" fill="#9db3a3" />
          <path d="M28 82 L40 44 L52 82Z" fill="#8aa594" />
          <rect x="0" y="80" width="100" height="20" fill="#c3cbd2" />
          <g stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity="0.92">
            <line x1="8" y1="46" x2="62" y2="46" />
            <line x1="30" y1="58" x2="92" y2="58" />
            <line x1="6" y1="70" x2="70" y2="70" />
            <line x1="40" y1="82" x2="94" y2="82" />
          </g>
        </>
      );
    default:
      return null;
  }
}

export function WeatherPicture({ id }: { id: string }) {
  return (
    <span aria-hidden="true" className="absolute inset-0" style={{ backgroundColor: sky[id] }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
        <Scene id={id} />
      </svg>
    </span>
  );
}
