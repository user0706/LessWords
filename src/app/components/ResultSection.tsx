"use client";

import { forwardRef } from "react";
import { ArrowDownIcon, ImageIcon, DownloadIcon, ShareIcon } from "./icons";
import { CardPreviewModal } from "./CardPreviewModal";
import { GlassButton } from "./ui/GlassButton";
import { useCardActions } from "../hooks/useCardActions";
import type { Theme } from "../types";

interface ResultSectionProps {
  originalText: string;
  result: string;
  theme: Theme;
}

export const ResultSection = forwardRef<HTMLDivElement, ResultSectionProps>(
  function ResultSection({ originalText, result, theme }, ref) {
    const {
      previewUrl,
      savedImg,
      downloaded,
      handlePreview,
      closePreview,
      handleSaveImage,
      handleDownloadImage,
      handleShare,
    } = useCardActions(originalText, result, theme);

    const compressionRatio =
      originalText.length > 0 && result.length > 0
        ? Math.round((1 - result.length / originalText.length) * 100)
        : null;

    return (
      <div ref={ref} className="animate-slide-up flex flex-col gap-4 -mt-2 sm:-mt-4">
        {/* Arrow connector */}
        <div className="flex justify-center">
          <div className="animate-bounce-down flex flex-col items-center gap-1 text-accent">
            <ArrowDownIcon />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-muted uppercase tracking-widest flex items-center gap-2">
            <span className="text-base">🎯</span>
            What they actually mean
          </h2>
          {compressionRatio !== null && compressionRatio > 0 && (
            <span className="compression-badge text-[11px] font-mono text-accent tabular-nums px-2.5 py-1 rounded-full">
              {compressionRatio}% shorter
            </span>
          )}
        </div>

        <div className="result-card glass rounded-2xl p-5 sm:p-6">
          <p className="text-lg sm:text-xl leading-relaxed font-bold text-foreground">
            &ldquo;{result}&rdquo;
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <GlassButton onClick={handlePreview}>
            <ImageIcon className="opacity-60 group-hover:opacity-100 transition-opacity" />
            Preview card
          </GlassButton>

          <GlassButton onClick={handleSaveImage}>
            {savedImg ? (
              <span className="animate-pop-in text-accent">Copied!</span>
            ) : (
              <>
                <ImageIcon className="opacity-60 group-hover:opacity-100 transition-opacity" />
                Copy image
              </>
            )}
          </GlassButton>

          <GlassButton onClick={handleDownloadImage}>
            {downloaded ? (
              <span className="animate-pop-in text-accent">Downloaded!</span>
            ) : (
              <>
                <DownloadIcon className="opacity-60 group-hover:opacity-100 transition-opacity" />
                Download
              </>
            )}
          </GlassButton>

          <GlassButton onClick={handleShare}>
            <ShareIcon className="opacity-60 group-hover:opacity-100 transition-opacity" />
            Share
          </GlassButton>
        </div>

        {/* Card preview modal */}
        {previewUrl && (
          <CardPreviewModal previewUrl={previewUrl} onClose={closePreview} />
        )}
      </div>
    );
  }
);
