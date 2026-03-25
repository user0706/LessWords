import type { ButtonHTMLAttributes, ReactNode } from "react";

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function GlassButton({ children, className = "", ...props }: GlassButtonProps) {
  return (
    <button
      className={`group py-3 rounded-2xl glass text-sm font-medium text-muted hover:text-foreground hover:bg-surface-hover active:scale-[0.96] transition-all cursor-pointer flex items-center justify-center gap-1.5 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
