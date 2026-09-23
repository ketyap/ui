"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { useEffect, useRef } from "react";

import { FluidHoverHighlight } from "@/components/ui/fluid-hover-highlight";
import { useFluidHover } from "@/hooks/use-fluid-hover";
import { cn } from "@/lib/utils";

// Only the moving background is shared. Primitives keep ownership of focus,
// selection and keyboard navigation.
export const FluidHoverArea = ({
  itemSelector,
  axis = "y",
  children,
  className,
  render,
  ref,
  ...props
}: useRender.ComponentProps<"div"> & {
  itemSelector: string;
  axis?: "x" | "y" | "xy";
}) => {
  const container = useRef<HTMLDivElement>(null);
  const hover = useFluidHover(container, { axis, gapClick: false });
  const { registerItem } = hover;
  useEffect(() => {
    const element = container.current;
    if (!element) {
      return;
    }
    let items: HTMLElement[] = [];
    const syncItems = () => {
      const next = [...element.querySelectorAll<HTMLElement>(itemSelector)];
      for (
        let index = 0;
        index < Math.max(items.length, next.length);
        index += 1
      ) {
        registerItem(index, next[index] ?? null);
      }
      items = next;
    };
    syncItems();
    const observer = new MutationObserver(syncItems);
    observer.observe(element, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      for (const [index] of items.entries()) {
        registerItem(index, null);
      }
    };
  }, [children, itemSelector, registerItem]);
  return useRender({
    props: mergeProps(
      {
        ...hover.handlers,
        children: (
          <>
            <FluidHoverHighlight hover={hover} />
            {children}
          </>
        ),
        className: cn("relative isolate", className),
        onKeyDownCapture: () => hover.setActiveIndex(null),
      },
      props
    ),
    ref: [container, ref ?? null],
    render,
  });
};
