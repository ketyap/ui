"use client";

import { Radio } from "@base-ui/react/radio";
import { RadioGroup as Group } from "@base-ui/react/radio-group";
import { LayoutGroup, motion } from "motion/react";
import { useId } from "react";
import type { ComponentProps, ReactNode } from "react";

import { FluidHoverArea } from "@/components/ui/fluid-hover-area";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { motionPresets } from "@/lib/motion";
import { useShape } from "@/lib/shape-context";
import { useSize } from "@/lib/size-context";
import { cn } from "@/lib/utils";

export const RadioGroup = ({
  className,
  ...props
}: ComponentProps<typeof Group>) => {
  const shape = useShape();
  const id = useId();
  return (
    <LayoutGroup id={id}>
      <Group
        render={<FluidHoverArea itemSelector="[data-slot=radio-item]" />}
        className={cn("p-1", shape, className)}
        {...props}
      />
    </LayoutGroup>
  );
};
export const RadioItem = ({
  label,
  description,
  className,
  ...props
}: ComponentProps<typeof Radio.Root> & {
  label: ReactNode;
  description?: ReactNode;
}) => {
  const id = useId();
  const size = useSize();
  const reduced = useReducedMotion();
  const shape = useShape();
  return (
    <Radio.Root
      data-slot="radio-item"
      aria-labelledby={`${id}-label`}
      aria-describedby={description ? `${id}-description` : undefined}
      className={cn(
        "relative flex w-full cursor-pointer items-center text-left outline-none transition-colors duration-(--motion-fast) data-[checked]:bg-foreground/5 focus-visible:ring-2 focus-visible:ring-ring data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        size.px,
        size.gap,
        size.text,
        shape,
        description ? "py-2" : size.control,
        className
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full border border-input",
          size.variant === "compact" ? "size-3.5" : "size-4"
        )}
      >
        <Radio.Indicator
          render={
            <motion.span
              layoutId={reduced ? undefined : "radio-dot"}
              transition={
                reduced ? motionPresets.snap : motionPresets.activeIndicator
              }
            />
          }
          className={cn(
            "relative z-10 rounded-full bg-foreground",
            size.variant === "compact" ? "size-[7px]" : "size-2"
          )}
        />
      </span>
      <span className="flex min-w-0 flex-col">
        <span id={`${id}-label`}>{label}</span>
        {description && (
          <span
            id={`${id}-description`}
            className="text-xs text-muted-foreground"
          >
            {description}
          </span>
        )}
      </span>
    </Radio.Root>
  );
};
