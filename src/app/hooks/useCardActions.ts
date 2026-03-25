"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { generateCard } from "../utils/generateCard";
import type { Theme } from "../types";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function useCardActions(originalText: string, result: string, theme: Theme) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [savedImg, setSavedImg] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // Track current object URL so we can revoke it before creating a new one
  const previewUrlRef = useRef<string | null>(null);

  // Cache the last-generated blob to avoid re-rendering the canvas
  const cachedBlobRef = useRef<Blob | null>(null);
  const cacheKeyRef = useRef("");

  // Invalidate cache when inputs change
  useEffect(() => {
    cachedBlobRef.current = null;
    cacheKeyRef.current = "";
  }, [originalText, result, theme]);

  // Revoke object URL on unmount or when preview closes
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const getCardBlob = useCallback(async (): Promise<Blob> => {
    const key = `${originalText}|${result}|${theme}`;
    if (cachedBlobRef.current && cacheKeyRef.current === key) {
      return cachedBlobRef.current;
    }
    const blob = await generateCard(originalText, result, theme);
    cachedBlobRef.current = blob;
    cacheKeyRef.current = key;
    return blob;
  }, [originalText, result, theme]);

  const handlePreview = useCallback(async () => {
    try {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      const blob = await getCardBlob();
      const url = URL.createObjectURL(blob);
      previewUrlRef.current = url;
      setPreviewUrl(url);
    } catch (err) {
      console.error("Failed to generate card preview:", err);
    }
  }, [getCardBlob]);

  const closePreview = useCallback(() => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = null;
    setPreviewUrl(null);
  }, []);

  const handleSaveImage = useCallback(async () => {
    try {
      const blob = await getCardBlob();

      if (navigator.share) {
        const file = new File([blob], "lesswords.png", { type: "image/png" });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file] });
          return;
        }
      }

      if (navigator.clipboard && typeof ClipboardItem !== "undefined") {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setSavedImg(true);
        setTimeout(() => setSavedImg(false), 2000);
        return;
      }

      downloadBlob(blob, "lesswords.png");
      setSavedImg(true);
      setTimeout(() => setSavedImg(false), 2000);
    } catch (err) {
      console.error("Failed to save/share image:", err);
    }
  }, [getCardBlob]);

  const handleDownloadImage = useCallback(async () => {
    try {
      const blob = await getCardBlob();
      downloadBlob(blob, "lesswords.png");
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    } catch (err) {
      console.error("Failed to download image:", err);
    }
  }, [getCardBlob]);

  const handleShare = useCallback(() => {
    const shareText = `They said: "${originalText}"\n\nThey meant: "${result}"\n\n\u2014 LessWords`;

    if (navigator.share) {
      navigator.share({ text: shareText }).catch((err) => {
        console.error("Native share failed, falling back to clipboard:", err);
        navigator.clipboard.writeText(shareText).catch((clipErr) => {
          console.error("Clipboard fallback also failed:", clipErr);
        });
      });
    } else {
      navigator.clipboard.writeText(shareText).catch((err) => {
        console.error("Failed to copy to clipboard:", err);
      });
    }
  }, [originalText, result]);

  return {
    previewUrl,
    savedImg,
    downloaded,
    handlePreview,
    closePreview,
    handleSaveImage,
    handleDownloadImage,
    handleShare,
  };
}
