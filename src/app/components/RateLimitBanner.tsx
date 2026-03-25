interface RateLimitBannerProps {
  retryAfter: number | null;
}

export function RateLimitBanner({ retryAfter }: RateLimitBannerProps) {
  return (
    <div className="animate-fade-in glass rounded-2xl p-6 flex flex-col items-center gap-4">
      <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center text-2xl">
        ⏳
      </div>
      <div className="text-center flex flex-col gap-1.5">
        <p className="text-foreground font-semibold">Too many translations, too fast</p>
        <p className="text-muted text-sm leading-relaxed max-w-[280px]">
          The API needs a breather. Try again{retryAfter ? ` in ~${retryAfter}s` : " shortly"}.
        </p>
      </div>
    </div>
  );
}
