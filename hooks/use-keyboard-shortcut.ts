"use client";

import { useEffect, useEffectEvent } from "react";

export interface KeyboardShortcutOptions {
  enabled?: boolean;
  preventDefault?: boolean;
  enableOnFormTags?: boolean;
}
export const useKeyboardShortcut = (
  shortcut: string,
  callback: (event: KeyboardEvent) => void,
  {
    enabled = true,
    preventDefault = true,
    enableOnFormTags = false,
  }: KeyboardShortcutOptions = {}
) => {
  const invoke = useEffectEvent(callback);
  useEffect(() => {
    if (!enabled) {
      return;
    }
    const parts = shortcut.toLowerCase().split("+");
    const key = parts.pop();
    const mac = /Mac|iPhone|iPad/u.test(navigator.platform);
    const modifier = (name: string) => parts.includes(name);
    const listener = (event: KeyboardEvent) => {
      if (event.isComposing || event.repeat || event.defaultPrevented) {
        return;
      }
      if (
        !enableOnFormTags &&
        event
          .composedPath()
          .some(
            (target) =>
              target instanceof HTMLElement &&
              (target.matches("input,textarea,select") ||
                target.isContentEditable)
          )
      ) {
        return;
      }
      if (
        event.key.toLowerCase() !== key ||
        event.metaKey !== (modifier("meta") || (modifier("mod") && mac)) ||
        event.ctrlKey !==
          (modifier("ctrl") ||
            modifier("control") ||
            (modifier("mod") && !mac)) ||
        event.altKey !== modifier("alt") ||
        event.shiftKey !== modifier("shift")
      ) {
        return;
      }
      if (preventDefault) {
        event.preventDefault();
      }
      invoke(event);
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [shortcut, enabled, preventDefault, enableOnFormTags]);
};
