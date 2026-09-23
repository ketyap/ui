"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";

export type SizeVariant = "default" | "compact";
const SizeContext = createContext<SizeVariant>("default");
export const sizeMap = {
  compact: {
    control: "h-7",
    controlHeight: 28,
    gap: "gap-1",
    icon: 14,
    iconClass: "[&_svg:not([class*='size-'])]:size-3.5",
    px: "px-2.5",
    text: "text-xs",
    variant: "compact",
  },
  default: {
    control: "h-9",
    controlHeight: 36,
    gap: "gap-2",
    icon: 16,
    iconClass: "[&_svg:not([class*='size-'])]:size-4",
    px: "px-3",
    text: "text-[13px]",
    variant: "default",
  },
} as const;
export const SizeProvider = ({
  size,
  children,
}: {
  size: SizeVariant;
  children: ReactNode;
}) => <SizeContext.Provider value={size}>{children}</SizeContext.Provider>;
export const useSizeVariant = (override?: SizeVariant) => {
  const inherited = useContext(SizeContext);
  return override ?? inherited;
};
export const useSize = (override?: SizeVariant) =>
  sizeMap[useSizeVariant(override)];
