"use client";

import { createContext, useContext } from "react";
import type { CSSProperties, ReactNode } from "react";

const SurfaceContext = createContext(1);
export const clampSurface = (level: number) =>
  Number.isFinite(level) ? Math.max(1, Math.min(8, Math.round(level))) : 1;
export const useSurface = () => useContext(SurfaceContext);
export const SurfaceProvider = ({
  value,
  children,
}: {
  value: number;
  children: ReactNode;
}) => (
  <SurfaceContext.Provider value={clampSurface(value)}>
    {children}
  </SurfaceContext.Provider>
);
export const surfaceStyle = (level: number): CSSProperties => ({
  backgroundColor: `var(--surface-${clampSurface(level)})`,
});
