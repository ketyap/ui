"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";

export type ShapeVariant = "rounded" | "pill";
const ShapeContext = createContext<ShapeVariant>("rounded");
export const shapeMap = {
  pill: "rounded-[20px]",
  rounded: "rounded-lg",
} as const;
export const ShapeProvider = ({
  shape,
  children,
}: {
  shape: ShapeVariant;
  children: ReactNode;
}) => <ShapeContext.Provider value={shape}>{children}</ShapeContext.Provider>;
export const useShape = (override?: ShapeVariant) => {
  const inherited = useContext(ShapeContext);
  return shapeMap[override ?? inherited];
};
