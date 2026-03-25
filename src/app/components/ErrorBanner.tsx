interface ErrorBannerProps {
  message: string;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <div className="animate-fade-in glass rounded-2xl p-4 text-sm border-red-500/20 flex items-center gap-3">
      <span className="text-lg">😵</span>
      <span className="text-red-400">{message}</span>
    </div>
  );
}
