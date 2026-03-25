const MAX_LENGTH = 2000;

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TextInput({ value, onChange }: TextInputProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-muted uppercase tracking-widest">
        <span className="text-base">💬</span>
        They said...
      </div>
      <div className="relative">
        <textarea
          className="w-full min-h-[80px] sm:min-h-[100px] glass rounded-2xl p-4 text-foreground placeholder:text-muted resize-none focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50 transition-all font-sans text-[16px] leading-relaxed"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`"It's fine, do whatever you want..."`}
          maxLength={MAX_LENGTH}
        />
        <span className="absolute bottom-3 right-3 text-[11px] text-muted tabular-nums">
          {value.length}/{MAX_LENGTH}
        </span>
      </div>
    </div>
  );
}
