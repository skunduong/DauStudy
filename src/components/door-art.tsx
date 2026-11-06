type ArtProps = { className?: string };

function Scene({ src }: { src: string }) {
  return (
    <img
      src={src}
      alt=""
      draggable={false}
      className="pointer-events-none absolute inset-0 size-full object-cover object-center"
    />
  );
}

export function EnglishArt(_props: ArtProps) {
  return <Scene src="/doors/door-listen.jpg" />;
}

export function ThinkingArt(_props: ArtProps) {
  return <Scene src="/doors/door-puzzle.jpg" />;
}

export function ReviewArt(_props: ArtProps) {
  return <Scene src="/doors/door-cards.jpg" />;
}
