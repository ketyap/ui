"use client";

import type { useRender } from "@base-ui/react/use-render";
import type { ComponentProps } from "react";

import { RenderDiv } from "@/components/ui/render-element";
import {
  clampSurface,
  surfaceStyle,
  SurfaceProvider,
  useSurface,
} from "@/lib/surface-context";
import { cn } from "@/lib/utils";

export const Elevated = ({
  offset = 1,
  render,
  className,
  style,
  ...props
}: ComponentProps<"div"> & {
  offset?: number;
  render?: useRender.RenderProp;
}) => {
  const level = clampSurface(useSurface() + offset);
  const Component = RenderDiv;
  return (
    <SurfaceProvider value={level}>
      <Component
        render={render}
        data-surface={level}
        className={cn(
          "text-foreground ring-1 ring-border/50 shadow-sm",
          className
        )}
        style={{ ...surfaceStyle(level), ...style }}
        {...props}
      />
    </SurfaceProvider>
  );
};
