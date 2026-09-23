"use client";

import { useCallback, useEffect, useState } from "react";

export const useAutoResizeTextarea = ({
  value,
  minHeight = 44,
  maxHeight = 240,
}: { value?: string; minHeight?: number; maxHeight?: number } = {}) => {
  const [element, setElement] = useState<HTMLTextAreaElement | null>(null);
  const resize = useCallback(() => {
    if (!element) {
      return;
    }
    const min = Math.max(0, minHeight);
    const max = Math.max(min, maxHeight);
    const computed = getComputedStyle(element);
    const border =
      Number.parseFloat(computed.borderTopWidth) +
      Number.parseFloat(computed.borderBottomWidth);
    element.style.height = "0px";
    const required = element.scrollHeight + border;
    element.style.height = `${Math.min(max, Math.max(min, required))}px`;
    element.style.overflowY = required > max ? "auto" : "hidden";
  }, [element, minHeight, maxHeight]);
  useEffect(() => {
    if (!element) {
      return;
    }
    const original = {
      boxSizing: element.style.boxSizing,
      height: element.style.height,
      overflowY: element.style.overflowY,
    };
    element.style.boxSizing = "border-box";
    let width = element.clientWidth;
    const observer = new ResizeObserver(() => {
      if (width !== element.clientWidth) {
        width = element.clientWidth;
        resize();
      }
    });
    observer.observe(element);
    element.addEventListener("input", resize);
    resize();
    return () => {
      observer.disconnect();
      element.removeEventListener("input", resize);
      Object.assign(element.style, original);
    };
  }, [element, resize]);
  useEffect(() => {
    resize();
  }, [value, resize]);
  return { ref: setElement, resize };
};
