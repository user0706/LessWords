"use client";

import { useState, useCallback, useRef } from "react";
import { useTheme } from "./hooks/useTheme";
import { useTranslation } from "./hooks/useTranslation";
import {
  BackgroundMesh,
  FloatingEmojis,
  Header,
  TextInput,
  RateLimitBanner,
  ErrorBanner,
  ResultSection,
  DecodeButton,
  DisclaimerModal,
  Footer,
} from "./components";
import type { FloatingEmoji } from "./components/FloatingEmojis";

const EMOJIS = ["😤", "💅", "🙄", "💀", "🤡", "😭", "🔥", "💔", "🫠", "👀"];

export default function Home() {
  const [text, setText] = useState("");
  const [submittedText, setSubmittedText] = useState("");
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);

  const resultRef = useRef<HTMLDivElement>(null);
  const { theme, toggle: toggleTheme, mounted } = useTheme();
  const { result, loading, error, rateLimited, retryAfter, translate } = useTranslation();

  const spawnEmojis = useCallback(() => {
    const batch = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      x: Math.random() * 80 + 10,
      y: Math.random() * 30 + 50,
    }));
    setFloatingEmojis((prev) => [...prev, ...batch]);
    setTimeout(() => {
      setFloatingEmojis((prev) =>
        prev.filter((e) => !batch.find((n) => n.id === e.id))
      );
    }, 6000);
  }, []);

  const handleTranslate = useCallback(async () => {
    const success = await translate(text);
    if (!success) return;
    setSubmittedText(text);
    spawnEmojis();
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  }, [text, translate, spawnEmojis]);

  const isDisabled = loading || !text.trim();

  return (
    <div className="relative flex flex-col h-full overflow-y-auto">
      <BackgroundMesh />
      <FloatingEmojis emojis={floatingEmojis} />

      {/* Scrollable content */}
      <div className="relative z-10 flex-1 px-4 pt-6 pb-28 sm:pt-12 sm:pb-12 sm:px-6">
        <div className="w-full max-w-lg mx-auto flex flex-col gap-6 sm:gap-8">
          <Header theme={theme} mounted={mounted} onToggleTheme={toggleTheme} />
          <TextInput value={text} onChange={setText} />

          {rateLimited && <RateLimitBanner retryAfter={retryAfter} />}
          {error && !rateLimited && <ErrorBanner message={error} />}
          {result && (
            <ResultSection
              ref={resultRef}
              originalText={submittedText}
              result={result}
              theme={theme}
            />
          )}
        </div>
      </div>

      {/* Sticky bottom button — mobile only */}
      <div
        className="fixed bottom-0 left-0 right-0 p-4 z-20 sm:hidden"
        style={{ paddingBottom: "calc(1rem + var(--safe-bottom, 0px))" }}
      >
        <div className="absolute inset-0 bg-background/60 backdrop-blur-xl" />
        <DecodeButton
          loading={loading}
          disabled={isDisabled}
          onClick={handleTranslate}
          className="relative py-4"
        />
      </div>

      {/* Desktop button — inline, hidden on mobile */}
      <div className="hidden sm:block relative z-10 px-4 sm:px-6 pb-6">
        <div className="w-full max-w-lg mx-auto">
          <DecodeButton
            loading={loading}
            disabled={isDisabled}
            onClick={handleTranslate}
            className="py-3.5"
          />
        </div>
      </div>

      {showDisclaimer && (
        <DisclaimerModal onClose={() => setShowDisclaimer(false)} />
      )}

      <Footer
        disclaimerOpen={showDisclaimer}
        onToggleDisclaimer={() => setShowDisclaimer((prev) => !prev)}
      />
    </div>
  );
}
