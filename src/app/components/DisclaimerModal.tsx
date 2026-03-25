import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "./icons";

interface DisclaimerModalProps {
  onClose: () => void;
}

export function DisclaimerModal({ onClose }: DisclaimerModalProps) {
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

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
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Disclaimer"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />

      {/* Panel */}
      <div className="relative w-full max-w-lg animate-modal-in glass rounded-2xl p-5 sm:p-6 flex flex-col gap-3 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Disclaimer</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-surface-hover text-muted hover:text-foreground transition-all cursor-pointer"
            aria-label="Close disclaimer"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="text-xs text-muted leading-relaxed flex flex-col gap-2">
          <p>
            This application is provided strictly for <strong className="text-foreground">entertainment purposes only</strong>. All translations are AI-generated, fictional, and should not be taken literally or as factual interpretations of anyone&apos;s words or intentions.
          </p>
          <p>
            This project does not intend to mock, ridicule, offend, or target any individual, gender, group, or relationship dynamic. The content is meant as lighthearted, universally relatable humor &mdash; not as commentary, advice, or judgment.
          </p>
          <p>
            The creators of this application accept <strong className="text-foreground">no responsibility or liability</strong> for any claims, damages, accusations, or disputes arising from the use, misuse, or interpretation of this tool or its outputs. By using this application, you acknowledge that all results are satirical and agree to use them at your own discretion.
          </p>

        </div>
      </div>
    </div>,
    document.body
  );
}
