"use client";

import { ScrollArea as ScrollPrimitive } from "@base-ui/react/scroll-area";
import { Select as Primitive } from "@base-ui/react/select";
import type { ComponentProps } from "react";

import { Elevated } from "@/components/ui/elevated";
import { FluidHoverArea } from "@/components/ui/fluid-hover-area";
import { ScrollBar } from "@/components/ui/scroll-area";
import { Icon } from "@/lib/icon-context";
import type { IconComponent } from "@/lib/icon-context";
import { useShape } from "@/lib/shape-context";
import type { ShapeVariant } from "@/lib/shape-context";
import { useSize } from "@/lib/size-context";
import type { SizeVariant } from "@/lib/size-context";
import { useSurface } from "@/lib/surface-context";
import { cn } from "@/lib/utils";

export const Select = Primitive.Root;
export const SelectValue = Primitive.Value;
export const SelectGroup = Primitive.Group;
export const SelectLabel = ({
  className,
  ...props
}: ComponentProps<typeof Primitive.GroupLabel>) => (
  <Primitive.GroupLabel
    className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)}
    {...props}
  />
);
export const SelectTrigger = ({
  className,
  children,
  density,
  shape,
  variant = "bordered",
  icon: LeadingIcon,
  ...props
}: ComponentProps<typeof Primitive.Trigger> & {
  density?: SizeVariant;
  shape?: ShapeVariant;
  variant?: "bordered" | "borderless";
  icon?: IconComponent;
}) => {
  const size = useSize(density);
  const radius = useShape(shape);
  return (
    <Primitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "flex w-full items-center justify-between border outline-none transition-colors duration-(--motion-fast) focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 data-[placeholder]:text-muted-foreground",
        variant === "bordered"
          ? "border-input"
          : "border-transparent hover:bg-foreground/5",
        size.iconClass,
        size.control,
        size.text,
        size.px,
        size.gap,
        radius,
        className
      )}
      {...props}
    >
      {LeadingIcon && <LeadingIcon aria-hidden="true" />}
      <span className="min-w-0 flex-1 truncate text-left">{children}</span>
      <Primitive.Icon>
        <Icon name="chevron-down" />
      </Primitive.Icon>
    </Primitive.Trigger>
  );
};
export const SelectContent = ({
  className,
  children,
  ...props
}: ComponentProps<typeof Primitive.Popup>) => {
  const level = useSurface();
  const shape = useShape();
  return (
    <Primitive.Portal>
      <Primitive.Positioner
        sideOffset={6}
        style={{ zIndex: 50 + level }}
        alignItemWithTrigger={false}
      >
        <Elevated
          offset={2}
          render={
            <Primitive.Popup
              data-slot="select-content"
              className={cn(
                "min-w-(--anchor-width) overflow-hidden border border-border/60 shadow-md origin-(--transform-origin) transition-[opacity,transform] duration-(--motion-moderate) data-[ending-style]:duration-(--motion-exit-moderate) data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[ending-style]:scale-95 motion-reduce:transition-none",
                shape,
                className
              )}
              {...props}
            >
              <ScrollPrimitive.Root className="relative overflow-hidden">
                <Primitive.List
                  render={<ScrollPrimitive.Viewport />}
                  className="max-h-[min(300px,var(--available-height))] overscroll-contain outline-none"
                >
                  <FluidHoverArea itemSelector="[role=option]" className="p-1">
                    {children}
                  </FluidHoverArea>
                </Primitive.List>
                <ScrollBar />
              </ScrollPrimitive.Root>
            </Primitive.Popup>
          }
        />
      </Primitive.Positioner>
    </Primitive.Portal>
  );
};
export const SelectItem = ({
  className,
  children,
  icon: ItemIcon,
  ...props
}: ComponentProps<typeof Primitive.Item> & { icon?: IconComponent }) => {
  const size = useSize();
  const shape = useShape();
  return (
    <Primitive.Item
      className={cn(
        "relative flex cursor-default items-center outline-none select-none data-[disabled]:opacity-50 focus-visible:bg-accent focus-visible:ring-1 focus-visible:ring-ring",
        size.control,
        size.text,
        size.gap,
        size.iconClass,
        size.variant === "compact" ? "px-1.5" : "px-2",
        shape,
        className
      )}
      {...props}
    >
      {ItemIcon && <ItemIcon aria-hidden="true" />}
      <Primitive.ItemText className="min-w-0 flex-1 truncate">
        {children}
      </Primitive.ItemText>
      <Primitive.ItemIndicator>
        <Icon name="check" width={size.icon} height={size.icon} />
      </Primitive.ItemIndicator>
    </Primitive.Item>
  );
};
