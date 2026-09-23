"use client";

import { Tooltip as Primitive } from "@base-ui/react/tooltip";
import type { ComponentProps } from "react";

import { useShape } from "@/lib/shape-context";
import { useSurface } from "@/lib/surface-context";
import { cn } from "@/lib/utils";

export const TooltipProvider = ({
  delay = 200,
  ...props
}: ComponentProps<typeof Primitive.Provider>) => (
  <Primitive.Provider delay={delay} {...props} />
);
export const Tooltip = Primitive.Root;
export const TooltipTrigger = Primitive.Trigger;

export const TooltipContent = ({
  className,
  children,
  side = "top",
  align = "center",
  sideOffset = 8,
  alignOffset,
  collisionPadding = 8,
  anchor,
  ...props
}: ComponentProps<typeof Primitive.Popup> &
  Pick<
    ComponentProps<typeof Primitive.Positioner>,
    | "side"
    | "align"
    | "sideOffset"
    | "alignOffset"
    | "collisionPadding"
    | "anchor"
  >) => {
  const shape = useShape();
  const surface = useSurface();
  return (
    <Primitive.Portal>
      <Primitive.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        anchor={anchor}
        style={{ zIndex: 50 + surface }}
      >
        <Primitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "w-fit max-w-xs bg-foreground px-2 py-1 text-xs text-background origin-(--transform-origin) transition-[opacity,transform] duration-(--motion-fast) data-[ending-style]:duration-(--motion-exit-fast) data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[ending-style]:scale-95 motion-reduce:transition-none",
            shape,
            className
          )}
          {...props}
        >
          {children}
        </Primitive.Popup>
      </Primitive.Positioner>
    </Primitive.Portal>
  );
};
