"use client";
import { ScrollArea as Primitive } from "@base-ui/react/scroll-area";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ComponentProps } from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { useScrollEdges } from "@/hooks/use-scroll-edges";
import { cn } from "@/lib/utils";

const ScrollContext = createContext({ native: false, visible: true });
const SCROLL_LINGER_MS = 600;
const overflowClasses = {
  both: "overflow-auto",
  horizontal: "overflow-x-auto overflow-y-hidden",
  vertical: "overflow-y-auto overflow-x-hidden",
};
const scrollMask = (direction: string, atStart: boolean, atEnd: boolean) =>
  `linear-gradient(to ${direction}, ${atStart ? "black" : "transparent"}, black 24px, black calc(100% - 24px), ${atEnd ? "black" : "transparent"})`;
export interface ScrollAreaProps extends ComponentProps<"div"> {
  orientation?: "vertical" | "horizontal" | "both";
  viewportClassName?: string;
  native?: boolean;
  fade?: boolean;
  visibility?: "auto" | "always" | "hidden";
  label?: string;
}
export const ScrollBar = ({
  className,
  orientation = "vertical",
  ...props
}: ComponentProps<typeof Primitive.Scrollbar>) => {
  const state = useContext(ScrollContext);
  if (state.native) {
    return null;
  }
  return (
    <Primitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      data-visible={state.visible || undefined}
      className={cn(
        "group/scrollbar pointer-events-none z-20 flex touch-none select-none opacity-0 transition-opacity duration-(--motion-exit-moderate) delay-(--motion-moderate) data-[visible]:pointer-events-auto data-[visible]:opacity-100 data-[visible]:duration-(--motion-moderate) data-[visible]:delay-0",
        orientation === "vertical" ? "h-full w-2.5" : "h-2.5 w-full flex-col",
        className
      )}
      {...props}
    >
      <Primitive.Thumb
        className={cn(
          "relative rounded-full bg-foreground/8 motion-reduce:transition-none transition-[background-color,width,height] duration-(--motion-moderate) group-hover/scrollbar:bg-foreground/12 active:bg-foreground/16",
          orientation === "vertical"
            ? "mx-auto my-1 -translate-x-0.5 w-1 group-hover/scrollbar:w-1.5"
            : "mx-1 my-auto -translate-y-0.5 h-1 group-hover/scrollbar:h-1.5"
        )}
      />
    </Primitive.Scrollbar>
  );
};
export const ScrollArea = ({
  children,
  className,
  viewportClassName,
  orientation = "vertical",
  native = false,
  fade = true,
  visibility = "auto",
  label = "Scrollable content",
  ...props
}: ScrollAreaProps) => {
  const touch = useMediaQuery("(pointer: coarse)");
  const isNative = native || touch;
  const [hovered, setHovered] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const vertical = useScrollEdges();
  const horizontal = useScrollEdges({ orientation: "horizontal" });
  useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    },
    []
  );
  const handleScroll = () => {
    setScrolling(true);
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => setScrolling(false), SCROLL_LINGER_MS);
  };
  const verticalRef = vertical.ref;
  const horizontalRef = horizontal.ref;
  const viewportRef = useCallback(
    (node: HTMLDivElement | null) => {
      verticalRef(node);
      horizontalRef(node);
    },
    [verticalRef, horizontalRef]
  );
  const masks = [
    orientation !== "horizontal" &&
      scrollMask("bottom", vertical.atStart, vertical.atEnd),
    orientation !== "vertical" &&
      scrollMask("right", horizontal.atStart, horizontal.atEnd),
  ]
    .filter(Boolean)
    .join(", ");
  const viewportProps = {
    "aria-label": label,
    className: cn(
      "size-full rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-ring",
      viewportClassName
    ),
    "data-slot": "scroll-area-viewport",
    onScroll: handleScroll,
    ref: viewportRef,
    role: "region",
    style: fade ? { maskComposite: "intersect", maskImage: masks } : undefined,
    tabIndex: 0,
  };
  const visible =
    visibility === "always" ||
    (visibility === "auto" && (hovered || scrolling));
  return (
    <ScrollContext.Provider value={{ native: isNative, visible }}>
      {isNative ? (
        <div
          data-slot="scroll-area"
          className={cn("relative overflow-hidden", className)}
          {...props}
        >
          <div
            {...viewportProps}
            className={cn(
              viewportProps.className,
              overflowClasses[orientation]
            )}
          >
            {children}
          </div>
        </div>
      ) : (
        <Primitive.Root
          data-slot="scroll-area"
          className={cn("relative overflow-hidden", className)}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          {...props}
        >
          <Primitive.Viewport {...viewportProps}>{children}</Primitive.Viewport>
          {orientation !== "horizontal" && <ScrollBar orientation="vertical" />}
          {orientation !== "vertical" && <ScrollBar orientation="horizontal" />}
          <Primitive.Corner />
        </Primitive.Root>
      )}
    </ScrollContext.Provider>
  );
};
