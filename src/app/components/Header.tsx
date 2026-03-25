import { SunIcon, MoonIcon } from "./icons";
import type { Theme } from "../types";

interface HeaderProps {
  theme: Theme;
  mounted: boolean;
  onToggleTheme: () => void;
}

export function Header({ theme, mounted, onToggleTheme }: HeaderProps) {
  return (
    <header className="flex items-start justify-between">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Less<span className="text-accent">Words</span>
        </h1>
        <p className="text-muted text-sm sm:text-base flex items-center gap-1.5">
          <span>What they said vs. what they meant</span>
          <span className="inline-block animate-pulse-subtle">👀</span>
        </p>
      </div>
      <button
        onClick={onToggleTheme}
        aria-label="Toggle theme"
        className="mt-1 p-2.5 rounded-xl glass hover:bg-surface-hover text-foreground transition-all active:scale-[0.92] cursor-pointer"
        style={{ visibility: mounted ? "visible" : "hidden" }}
      >
        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      </button>
    </header>
  );
}
