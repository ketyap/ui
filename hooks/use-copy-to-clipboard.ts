"use client";

import { useClipboard } from "@/hooks/use-clipboard";

export const useCopyToClipboard = ({
  timeout = 2000,
  onCopy,
}: {
  timeout?: number;
  onCopy?: () => void;
} = {}) => {
  const { copy, copied: isCopied, error } = useClipboard({ timeout });

  const copyToClipboard = async (value: string) => {
    const success = await copy(value);
    if (success) {
      onCopy?.();
    }
    return success;
  };

  return { copyToClipboard, error, isCopied };
};
