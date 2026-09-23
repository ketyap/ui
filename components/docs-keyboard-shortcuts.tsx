"use client";

import { useRouter } from "next/navigation";
import { addTransitionType, startTransition } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { useFeedback } from "@/hooks/use-feedback";
import { trackEvent } from "@/lib/events";

const isInteractionKey = (event: KeyboardEvent) =>
  event.defaultPrevented ||
  event
    .composedPath()
    .some(
      (target) =>
        target instanceof HTMLElement &&
        target.matches(
          "[data-docs-preview], [role=dialog], [role=menu], [role=listbox], button, a, input, textarea, select, [contenteditable], [tabindex]"
        )
    );

export const DocsKeyboardShortcuts = ({
  previous,
  next,
}: {
  previous: string | null;
  next: string | null;
}) => {
  const router = useRouter();
  const playClick = useFeedback({ sound: "click" });

  const navigate = (
    href: string | null,
    direction: "previous" | "next",
    keys: string
  ) => {
    if (href) {
      playClick();
      trackEvent({
        name: "keyboard_shortcut_navigate",
        properties: { direction, keys, path: href },
      });
      startTransition(() => {
        addTransitionType(direction === "next" ? "nav-forward" : "nav-back");
        router.push(href);
      });
    }
  };

  useHotkeys(
    "ArrowRight",
    (event) => {
      if (isInteractionKey(event)) {
        return;
      }
      event.preventDefault();
      navigate(next, "next", "ArrowRight");
    },
    { preventDefault: false }
  );

  useHotkeys(
    "ArrowLeft",
    (event) => {
      if (isInteractionKey(event)) {
        return;
      }
      event.preventDefault();
      navigate(previous, "previous", "ArrowLeft");
    },
    { preventDefault: false }
  );

  return null;
};
