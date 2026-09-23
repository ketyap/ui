"use client";

import { CheckboxGroup as Group } from "@base-ui/react/checkbox-group";
import type { ComponentProps } from "react";

import { FluidHoverArea } from "@/components/ui/fluid-hover-area";
import { useShape } from "@/lib/shape-context";
import { cn } from "@/lib/utils";

export const CheckboxGroup = ({
  className,
  ...props
}: ComponentProps<typeof Group>) => {
  const shape = useShape();
  return (
    <Group
      render={<FluidHoverArea itemSelector="[data-slot=checkbox-item]" />}
      className={cn("p-1 border border-border/60", shape, className)}
      {...props}
    />
  );
};

export { CheckboxItem } from "@/components/ui/checkbox";
