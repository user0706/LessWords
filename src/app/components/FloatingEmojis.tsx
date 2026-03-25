interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
  y: number;
}

interface FloatingEmojisProps {
  emojis: FloatingEmoji[];
}

export function FloatingEmojis({ emojis }: FloatingEmojisProps) {
  return (
    <>
      {emojis.map((e) => (
        <span
          key={e.id}
          className="floating-emoji"
          style={{ left: `${e.x}%`, top: `${e.y}%` }}
          aria-hidden
        >
          {e.emoji}
        </span>
      ))}
    </>
  );
}

export type { FloatingEmoji };
