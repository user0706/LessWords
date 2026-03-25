interface DecodeButtonProps {
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
  className?: string;
}

export function DecodeButton({ loading, disabled, onClick, className = "" }: DecodeButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn-decode w-full rounded-2xl font-bold text-base text-white cursor-pointer disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <span className="animate-pulse-subtle">Translating... 🔮</span>
      ) : (
        "Translate 🔮"
      )}
    </button>
  );
}
