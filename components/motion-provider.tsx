"use client";
import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

import { spring } from "@/lib/motion";

export const MotionProvider = ({ children }: { children: ReactNode }) => (
  <MotionConfig reducedMotion="user" transition={spring.moderate}>
    {children}
  </MotionConfig>
);
