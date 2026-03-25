"use client";

import { useState, useCallback } from "react";

interface TranslationState {
  result: string;
  loading: boolean;
  error: string;
  rateLimited: boolean;
  retryAfter: number | null;
}

export function useTranslation() {
  const [state, setState] = useState<TranslationState>({
    result: "",
    loading: false,
    error: "",
    rateLimited: false,
    retryAfter: null,
  });

  const translate = useCallback(async (text: string): Promise<boolean> => {
    if (!text.trim()) return false;

    setState((prev) => ({
      ...prev,
      loading: true,
      error: "",
      result: "",
      rateLimited: false,
      retryAfter: null,
    }));

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "rate_limit") {
          setState((prev) => ({
            ...prev,
            loading: false,
            rateLimited: true,
            retryAfter: data.retryAfter ?? 60,
          }));
          return false;
        }
        setState((prev) => ({
          ...prev,
          loading: false,
          error: data.message || data.error || "Something went wrong.",
        }));
        return false;
      }

      setState({
        result: data.output,
        loading: false,
        error: "",
        rateLimited: false,
        retryAfter: null,
      });
      return true;
    } catch {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Can't reach the server.",
      }));
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      result: "",
      loading: false,
      error: "",
      rateLimited: false,
      retryAfter: null,
    });
  }, []);

  return { ...state, translate, reset };
}
