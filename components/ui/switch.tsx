"use client";

import { Switch as Primitive } from "@base-ui/react/switch";
import { motion } from "motion/react";
import { useId } from "react";
import type { ComponentProps, ReactNode } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { motionTransition, spring } from "@/lib/motion";
import { useSize } from "@/lib/size-context";
import type { SizeVariant } from "@/lib/size-context";
import { cn } from "@/lib/utils";

export const Switch = ({
  size,
  label,
  className,
  ...props
}: ComponentProps<typeof Primitive.Root> & {
  size?: SizeVariant;
  label?: ReactNode;
}) => {
  const sizes = useSize(size);
  const reduced = useReducedMotion();
  const id = useId();
  const compact = sizes.variant === "compact";
  const thumb = compact ? 12 : 16;
  const travel = compact ? 12 : 14;
  return (
    <label
      className={cn(
        "inline-flex w-fit items-center gap-2 has-[[data-disabled]]:opacity-50",
        sizes.text
      )}
    >
      <Primitive.Root
        aria-labelledby={label ? id : undefined}
        data-slot="switch"
        className={cn(
          "group relative inline-flex shrink-0 cursor-pointer rounded-full bg-foreground/15 outline-none transition-colors duration-(--motion-fast) data-[checked]:bg-[#6b97ff] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[disabled]:cursor-not-allowed",
          compact ? "h-4 w-7" : "h-5 w-[34px]",
          className
        )}
        {...props}
      >
        <Primitive.Thumb
          render={(thumbProps, state) => (
            <span {...thumbProps} className="absolute top-0.5 left-0.5">
              <motion.span
                className="block rounded-full bg-white shadow-sm"
                initial={false}
                animate={{ x: state.checked ? travel : 0 }}
                transition={motionTransition(spring.moderate, reduced)}
                style={{ height: thumb, width: thumb }}
              />
            </span>
          )}
        />
      </Primitive.Root>
      {label && <span id={id}>{label}</span>}
    </label>
  );
};
