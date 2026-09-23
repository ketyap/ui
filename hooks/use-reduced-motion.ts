"use client";

import { useMediaQuery } from "@/hooks/use-media-query";

/** False during SSR and the first hydration render; subscribes after mounting. */
export const useReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");
