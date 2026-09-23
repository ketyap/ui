import type { Transition } from "motion/react";

// Base UI owns presence; CSS consumers use the same timing ladder as Motion.
export const motionClasses = {
  moderate:
    "duration-(--motion-moderate) data-[state=closed]:duration-(--motion-exit-moderate) motion-reduce:animate-none",
  slow: "duration-(--motion-slow) data-[state=closed]:duration-(--motion-exit-slow) motion-reduce:animate-none",
};

// Fluid Functionalism's timing ladder: quick feedback, precise panels, larger moves.
export const spring = {
  fast: { bounce: 0, duration: 0.08, exit: { duration: 0.06 }, type: "spring" },
  moderate: {
    bounce: 0,
    duration: 0.16,
    exit: { duration: 0.12 },
    type: "spring",
  },
  slow: {
    bounce: 0.12,
    duration: 0.24,
    exit: { duration: 0.16 },
    type: "spring",
  },
} as const;

export const motionPresets = {
  activeIndicator: spring.moderate,
  enter: {
    animate: { opacity: 1, scale: 1 },
    initial: { opacity: 0, scale: 0.95 },
    transition: spring.moderate,
  },
  exit: { opacity: 0, scale: 0.95, transition: spring.moderate.exit },
  fade: { duration: spring.fast.duration },
  hover: spring.fast,
  layout: spring.moderate,
  snap: { duration: 0 },
} satisfies Record<string, unknown>;

export const motionTransition = (
  transition: Transition,
  reduced: boolean
): Transition =>
  reduced ? { duration: 0, opacity: motionPresets.fade } : transition;
