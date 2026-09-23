"use client";

import { useCallback, useEffect, useState } from "react";

export const useScrollEdges = <T extends HTMLElement = HTMLDivElement>({
  orientation = "vertical",
  threshold = 1,
}: { orientation?: "horizontal" | "vertical"; threshold?: number } = {}) => {
  const [element, setElement] = useState<T | null>(null);
  const [edges, setEdges] = useState({
    atEnd: true,
    atStart: true,
    canScroll: false,
  });
  const update = useCallback(() => {
    if (!element) {
      return;
    }
    const horizontal = orientation === "horizontal";
    const position = horizontal
      ? Math.abs(element.scrollLeft)
      : element.scrollTop;
    const maximum = horizontal
      ? element.scrollWidth - element.clientWidth
      : element.scrollHeight - element.clientHeight;
    const next = {
      atEnd: position >= maximum - threshold,
      atStart: position <= threshold,
      canScroll: maximum > threshold,
    };
    setEdges((previous) =>
      previous.atStart === next.atStart &&
      previous.atEnd === next.atEnd &&
      previous.canScroll === next.canScroll
        ? previous
        : next
    );
  }, [element, orientation, threshold]);
  useEffect(() => {
    if (!element) {
      return;
    }
    const resize = new ResizeObserver(update);
    const observe = () => {
      resize.disconnect();
      resize.observe(element);
      for (const child of element.children) {
        resize.observe(child);
      }
      update();
    };
    const mutation = new MutationObserver(observe);
    mutation.observe(element, {
      characterData: true,
      childList: true,
      subtree: true,
    });
    observe();
    element.addEventListener("scroll", update, { passive: true });
    return () => {
      resize.disconnect();
      mutation.disconnect();
      element.removeEventListener("scroll", update);
    };
  }, [element, update]);
  return { ref: setElement, ...edges, update };
};
