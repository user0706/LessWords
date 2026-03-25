import { useEffect } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "./icons";

interface CardPreviewModalProps {
  previewUrl: string;
  onClose: () => void;
}

export function CardPreviewModal({ previewUrl, onClose }: CardPreviewModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-overlay-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative animate-modal-in max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 p-2 rounded-full glass text-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <CloseIcon size={18} />
        </button>
        <img
          src={previewUrl}
          alt="Social card preview"
          className="w-full rounded-2xl shadow-2xl"
        />
      </div>
    </div>,
    document.body
  );
}
