"use client";
import { AnimatePresence, motion } from "motion/react";
import type { Transition } from "motion/react";

import type { UseFluidHoverReturn } from "@/hooks/use-fluid-hover";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { motionPresets, motionTransition, spring } from "@/lib/motion";
import { useShape } from "@/lib/shape-context";
import { cn } from "@/lib/utils";

export const FluidHoverHighlight = ({
  hover,
  hidden = false,
  className,
  transition = spring.fast,
}: {
  hover: UseFluidHoverReturn;
  hidden?: boolean;
  className?: string;
  transition?: Transition | false;
}) => {
  const reduced = useReducedMotion();
  const shape = useShape();
  const rect =
    !hidden && hover.isMeasured && hover.activeIndex !== null
      ? hover.itemRects[hover.activeIndex]
      : null;
  const target = rect
    ? { height: rect.height, width: rect.width, x: rect.left, y: rect.top }
    : {};
  return (
    <AnimatePresence>
      {rect && (
        <motion.div
          key={hover.sessionRef.current}
          aria-hidden="true"
          data-slot="fluid-hover-highlight"
          className={cn(
            "pointer-events-none absolute top-0 left-0 bg-(--fluid-hover)",
            shape,
            className
          )}
          initial={{ ...target, opacity: 0 }}
          animate={{ ...target, opacity: 1 }}
          exit={{ opacity: 0, transition: spring.fast.exit }}
          transition={{
            ...motionTransition(
              transition === false ? motionPresets.snap : transition,
              reduced
            ),
            opacity: motionPresets.fade,
          }}
        />
      )}
    </AnimatePresence>
  );
};
