"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SetStateAction } from "react";

export interface ControllableStateOptions<T> {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}

export const useControllableState = <T>({
  value,
  defaultValue,
  onChange,
}: ControllableStateOptions<T>) => {
  const [internal, setInternal] = useState(defaultValue);
  const resolved = value === undefined ? internal : value;
  const current = useRef(resolved);
  const change = useRef(onChange);
  useEffect(() => {
    current.current = resolved;
    change.current = onChange;
  }, [resolved, onChange]);
  const controlled = value !== undefined;
  const setValue = useCallback(
    (action: SetStateAction<T>) => {
      const next =
        typeof action === "function"
          ? (action as (previous: T) => T)(current.current)
          : action;
      if (Object.is(current.current, next)) {
        return;
      }
      if (!controlled) {
        current.current = next;
        setInternal(next);
      }
      change.current?.(next);
    },
    [controlled]
  );
  return [resolved, setValue] as const;
};
