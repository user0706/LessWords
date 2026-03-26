interface FooterProps {
  disclaimerOpen: boolean;
  onToggleDisclaimer: () => void;
}

export function Footer({ disclaimerOpen, onToggleDisclaimer }: FooterProps) {
  return (
    <footer className="relative z-10 text-[11px] text-muted px-4 pt-3 pb-[calc(6rem+var(--safe-bottom,0px))] sm:pb-8">
      <div className="w-full max-w-lg mx-auto border-t border-border pt-3 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
        <span className="order-2 sm:order-1 opacity-60">
          {'\u00A9'} 2026 <a href="https://www.markojovovic.dev/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Marko Jovovic</a>. All rights reserved.
        </span>

        <div className="order-1 sm:order-2 flex items-center gap-2.5">
          <button
            onClick={onToggleDisclaimer}
            className="hover:text-foreground transition-colors cursor-pointer"
          >
            Disclaimer
          </button>

          <span className="opacity-30">·</span>

          <span aria-hidden="true" className="p-1 -m-1 opacity-50">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </span>

          <span aria-hidden="true" className="p-1 -m-1 opacity-50">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.72a8.2 8.2 0 0 0 4.76 1.52V6.79a4.84 4.84 0 0 1-1-.1z" />
            </svg>
          </span>
        </div>
      </div>
    </footer>
  );
}
