"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent, PointerEvent, RefObject } from "react";

export interface ItemRect {
  top: number;
  left: number;
  width: number;
  height: number;
}
export interface UseFluidHoverOptions {
  axis?: "x" | "y" | "xy";
  isItemDisabled?: (element: HTMLElement) => boolean;
  gapClick?: boolean | { maxDistance?: number };
}
export const useFluidHover = <T extends HTMLElement>(
  containerRef: RefObject<T | null>,
  { axis = "y", isItemDisabled, gapClick = true }: UseFluidHoverOptions = {}
) => {
  const items = useRef(new Map<number, HTMLElement>());
  const observer = useRef<ResizeObserver | null>(null);
  const frame = useRef<number | null>(null);
  const point = useRef<{ x: number; y: number } | null>(null);
  const sessionRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [itemRects, setItemRects] = useState<Record<number, ItemRect>>({});
  const [isMeasured, setIsMeasured] = useState(false);
  const disabled = useCallback(
    (element: HTMLElement) =>
      element.matches(":disabled,[aria-disabled=true],[data-disabled]") ||
      element.getClientRects().length === 0 ||
      !!isItemDisabled?.(element),
    [isItemDisabled]
  );
  const measureItems = useCallback(() => {
    const container = containerRef.current;
    if (!container || !container.offsetWidth || !container.offsetHeight) {
      setIsMeasured(false);
      return;
    }
    const bounds = container.getBoundingClientRect();
    const scaleX = bounds.width / container.offsetWidth || 1;
    const scaleY = bounds.height / container.offsetHeight || 1;
    const next: Record<number, ItemRect> = {};
    let nearest: number | null = null;
    let distance = Infinity;
    for (const [index, element] of items.current) {
      if (disabled(element)) {
        continue;
      }
      const rect = element.getBoundingClientRect();
      next[index] = {
        height: rect.height / scaleY,
        left:
          (rect.left - bounds.left) / scaleX +
          container.scrollLeft -
          container.clientLeft,
        top:
          (rect.top - bounds.top) / scaleY +
          container.scrollTop -
          container.clientTop,
        width: rect.width / scaleX,
      };
      if (!point.current) {
        continue;
      }
      const { x, y } = point.current;
      const insideX = x >= rect.left && x <= rect.right;
      const insideY = y >= rect.top && y <= rect.bottom;
      const contains = (axis === "y" || insideX) && (axis === "x" || insideY);
      const dx = x - (rect.left + rect.width / 2);
      const dy = y - (rect.top + rect.height / 2);
      const distances = {
        x: Math.abs(dx),
        xy: Math.hypot(dx, dy),
        y: Math.abs(dy),
      };
      const candidate = contains ? -1 : distances[axis];
      if (candidate < distance) {
        distance = candidate;
        nearest = index;
      }
    }
    setItemRects((previous) =>
      JSON.stringify(previous) === JSON.stringify(next) ? previous : next
    );
    setIsMeasured(true);
    if (point.current) {
      setActiveIndex(nearest);
    }
  }, [containerRef, axis, disabled]);
  const remeasure = useCallback(() => {
    if (frame.current !== null) {
      return;
    }
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      measureItems();
    });
  }, [measureItems]);
  const registerItem = useCallback(
    (index: number, element: HTMLElement | null) => {
      const previous = items.current.get(index);
      if (previous === element) {
        return;
      }
      if (previous) {
        observer.current?.unobserve(previous);
      }
      if (element) {
        items.current.set(index, element);
        observer.current?.observe(element);
      } else {
        items.current.delete(index);
      }
      remeasure();
    },
    [remeasure]
  );
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    observer.current = new ResizeObserver(remeasure);
    observer.current.observe(container);
    for (const element of items.current.values()) {
      observer.current.observe(element);
    }
    const mutation = new MutationObserver(remeasure);
    mutation.observe(container, {
      characterData: true,
      childList: true,
      subtree: true,
    });
    container.addEventListener("scroll", remeasure, { passive: true });
    remeasure();
    return () => {
      observer.current?.disconnect();
      observer.current = null;
      mutation.disconnect();
      container.removeEventListener("scroll", remeasure);
      if (frame.current !== null) {
        cancelAnimationFrame(frame.current);
        frame.current = null;
      }
    };
  }, [containerRef, remeasure]);
  useEffect(() => {
    const element =
      activeIndex === null ? null : items.current.get(activeIndex);
    if (!element) {
      return;
    }
    element.dataset.fluidHoverActive = "";
    return () => {
      delete element.dataset.fluidHoverActive;
    };
  }, [activeIndex]);
  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType !== "touch") {
      point.current = { x: event.clientX, y: event.clientY };
      remeasure();
    }
  };
  const onPointerLeave = () => {
    point.current = null;
    setActiveIndex(null);
  };
  const onClick = (event: MouseEvent) => {
    if (
      !gapClick ||
      !point.current ||
      event.defaultPrevented ||
      !(event.target instanceof Element)
    ) {
      return;
    }
    for (const element of items.current.values()) {
      if (element.contains(event.target)) {
        return;
      }
    }
    if (
      event.target.closest(
        "button,a,input,textarea,select,[contenteditable],[role=button]"
      )
    ) {
      return;
    }
    const element =
      activeIndex === null ? null : items.current.get(activeIndex);
    if (!element || disabled(element)) {
      return;
    }
    const rect = element.getBoundingClientRect();
    const distance = Math.hypot(
      Math.max(rect.left - event.clientX, 0, event.clientX - rect.right),
      Math.max(rect.top - event.clientY, 0, event.clientY - rect.bottom)
    );
    if (
      typeof gapClick === "object" &&
      distance > (gapClick.maxDistance ?? Infinity)
    ) {
      return;
    }
    const activator = element.matches(
      "button,a,[role=tab],[role=menuitem],[role=option]"
    )
      ? element
      : element.querySelector<HTMLElement>("button,a,[role=button]");
    activator?.click();
  };
  return {
    activeIndex,
    handlers: {
      onClick,
      onPointerCancel: onPointerLeave,
      onPointerEnter: (event: PointerEvent) => {
        if (event.pointerType !== "touch") {
          sessionRef.current += 1;
          onPointerMove(event);
        }
      },
      onPointerLeave,
      onPointerMove,
    },
    isMeasured,
    itemRects,
    measureItems,
    registerItem,
    remeasure,
    sessionRef,
    setActiveIndex,
  };
};
export type UseFluidHoverReturn = ReturnType<typeof useFluidHover>;
