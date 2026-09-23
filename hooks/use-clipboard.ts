"use client";
import { useCallback, useEffect, useRef, useState } from "react";

export const useClipboard = ({ timeout = 2000 }: { timeout?: number } = {}) => {
  const [copied, setCopied] = useState(false);
  const [copyError, setError] = useState<Error | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const request = useRef(0);
  useEffect(
    () => () => {
      request.current += 1;
      if (timer.current) {
        clearTimeout(timer.current);
      }
    },
    []
  );
  const copy = useCallback(
    async (text: string) => {
      request.current += 1;
      const id = request.current;
      if (timer.current) {
        clearTimeout(timer.current);
      }
      setCopied(false);
      setError(null);
      try {
        await navigator.clipboard.writeText(text);
        if (id !== request.current) {
          return false;
        }
        setCopied(true);
        if (timeout > 0) {
          timer.current = setTimeout(() => setCopied(false), timeout);
        }
        return true;
      } catch (error) {
        if (id === request.current) {
          setError(
            error instanceof Error
              ? error
              : new Error("Unable to copy to the clipboard.")
          );
        }
        return false;
      }
    },
    [timeout]
  );
  return { copied, copy, error: copyError };
};
