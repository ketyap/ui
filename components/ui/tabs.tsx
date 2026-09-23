"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { motion } from "motion/react";
import { createContext, useContext, useId, useRef, useEffect } from "react";

import { FluidHoverHighlight } from "@/components/ui/fluid-hover-highlight";
import { useControllableState } from "@/hooks/use-controllable-state";
import type { FeedbackType } from "@/hooks/use-feedback";
import { useFeedback } from "@/hooks/use-feedback";
import { useFluidHover } from "@/hooks/use-fluid-hover";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { motionPresets, motionTransition } from "@/lib/motion";
import { useShape } from "@/lib/shape-context";
import { useSize } from "@/lib/size-context";
import { cn } from "@/lib/utils";

const TabsState = createContext<{
  id: string;
  value: string;
  orientation: "horizontal" | "vertical";
  variant: "default" | "subtle";
}>({ id: "", orientation: "horizontal", value: "", variant: "default" });

const Tabs = ({
  className,
  value,
  defaultValue = "",
  onValueChange,
  orientation = "horizontal",
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root> & {
  variant?: "default" | "subtle";
}) => {
  const [selected, setSelected] = useControllableState({
    defaultValue,
    value,
  });
  const id = useId();
  return (
    <TabsState.Provider value={{ id, orientation, value: selected, variant }}>
      <TabsPrimitive.Root
        data-slot="tabs"
        value={selected}
        orientation={orientation}
        onValueChange={(next, details) => {
          onValueChange?.(next, details);
          if (!details.isCanceled) {
            setSelected(next);
          }
        }}
        className={cn("flex flex-col gap-2", className)}
        {...props}
      />
    </TabsState.Provider>
  );
};

const TabsList = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) => {
  const ref = useRef<HTMLDivElement>(null);
  const { orientation, variant } = useContext(TabsState);
  const hover = useFluidHover(ref, {
    axis: orientation === "vertical" ? "y" : "x",
    gapClick: false,
  });
  const { registerItem } = hover;
  const size = useSize();
  const padding = size.variant === "compact" ? "p-0.5" : "p-1";
  const shape = useShape();
  useEffect(() => {
    const container = ref.current;
    if (!container) {
      return;
    }
    let elements: HTMLElement[] = [];
    const syncItems = () => {
      const next = [...container.querySelectorAll<HTMLElement>('[role="tab"]')];
      for (
        let index = 0;
        index < Math.max(elements.length, next.length);
        index += 1
      ) {
        registerItem(index, next[index] ?? null);
      }
      elements = next;
    };
    syncItems();
    const observer = new MutationObserver(syncItems);
    observer.observe(container, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      for (const [index] of elements.entries()) {
        registerItem(index, null);
      }
    };
  }, [children, registerItem]);
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      ref={ref}
      {...hover.handlers}
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        "relative isolate",
        size.control,
        variant === "subtle" ? "bg-transparent p-0" : padding,
        orientation === "vertical" && "h-auto flex-col",
        shape,
        className
      )}
      {...props}
    >
      <FluidHoverHighlight hover={hover} />
      {children}
    </TabsPrimitive.List>
  );
};

const TabsTrigger = ({
  className,
  onClick,
  sound,
  haptic,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Tab> & {
  sound?: FeedbackType;
  haptic?: boolean;
}) => {
  const play = useFeedback({ haptic, sound });
  const state = useContext(TabsState);
  const reduced = useReducedMotion();
  const shape = useShape();
  const size = useSize();

  const handleClick: NonNullable<
    React.ComponentProps<typeof TabsPrimitive.Tab>["onClick"]
  > = (e) => {
    play();
    onClick?.(e);
  };

  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      onClick={handleClick}
      className={cn(
        "data-[active]:bg-background dark:data-[active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[active]:border-input dark:data-[active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "relative isolate data-[active]:bg-transparent dark:data-[active]:bg-transparent data-[active]:shadow-none",
        shape,
        "px-3 font-normal data-[active]:font-medium",
        size.text,
        className
      )}
      {...props}
    >
      {state.value === props.value && (
        <motion.span
          aria-hidden="true"
          layoutId={state.id}
          transition={motionTransition(motionPresets.activeIndicator, reduced)}
          className={cn(
            "absolute inset-0 -z-10",
            state.variant === "subtle"
              ? "bg-foreground/10"
              : "bg-background shadow-sm",
            shape
          )}
        />
      )}
      {children}
    </TabsPrimitive.Tab>
  );
};

const TabsContent = ({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Panel>) => (
  <TabsPrimitive.Panel
    data-slot="tabs-content"
    className={cn("flex-1 outline-none", className)}
    {...props}
  />
);

export { Tabs, TabsContent, TabsList, TabsTrigger };
