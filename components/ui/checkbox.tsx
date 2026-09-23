"use client";

import { Checkbox as Primitive } from "@base-ui/react/checkbox";
import { motion } from "motion/react";
import { useId } from "react";
import type { ComponentProps, ReactNode } from "react";

import { RenderSpan } from "@/components/ui/render-element";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { motionTransition, spring } from "@/lib/motion";
import { useShape } from "@/lib/shape-context";
import { useSize } from "@/lib/size-context";
import type { SizeVariant } from "@/lib/size-context";
import { cn } from "@/lib/utils";

export type CheckboxProps = Omit<
  ComponentProps<typeof Primitive.Root>,
  "className"
> & {
  className?: string;
  size?: SizeVariant;
};

export const Checkbox = ({ size, className, ...props }: CheckboxProps) => {
  const sizes = useSize(size);
  const reduced = useReducedMotion();
  return (
    <Primitive.Root
      data-slot="checkbox"
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer items-center justify-center rounded border border-input outline-none transition-colors duration-(--motion-fast) focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 motion-reduce:transition-none",
        sizes.variant === "compact" ? "size-3.5" : "size-4",
        className
      )}
      {...props}
    >
      <Primitive.Indicator
        keepMounted
        aria-hidden="true"
        className="pointer-events-none relative flex size-full items-center justify-center"
        render={(indicatorProps, state) => (
          <span {...indicatorProps}>
            <svg
              width={sizes.icon}
              height={sizes.icon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <motion.path
                d="M4 12 9 17 20 6"
                initial={false}
                animate={{
                  opacity: state.checked && !state.indeterminate ? 1 : 0,
                  pathLength: state.checked && !state.indeterminate ? 1 : 0,
                }}
                transition={motionTransition(spring.slow, reduced)}
              />
            </svg>
            <motion.span
              className="absolute h-0.5 w-2 rounded-full bg-current"
              initial={false}
              animate={{
                opacity: state.indeterminate ? 1 : 0,
                scaleX: state.indeterminate ? 1 : 0,
              }}
              transition={motionTransition(spring.moderate, reduced)}
            />
          </span>
        )}
      />
    </Primitive.Root>
  );
};

export const CheckboxItem = ({
  label,
  description,
  className,
  size: density,
  render,
  ...props
}: ComponentProps<typeof Checkbox> & {
  label: ReactNode;
  description?: ReactNode;
}) => {
  const id = useId();
  const size = useSize(density);
  const shape = useShape();
  return (
    <Checkbox
      size={density}
      data-slot="checkbox-item"
      aria-labelledby={`${id}-label`}
      aria-describedby={description ? `${id}-description` : undefined}
      className={cn(
        "relative flex w-full cursor-pointer items-center justify-start border-0 text-left outline-none transition-colors duration-(--motion-fast) data-[checked]:bg-foreground/5 data-[indeterminate]:bg-foreground/5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 [&[data-checked]:has(+input+[data-checked])]:rounded-b-none [&[data-checked]+input+[data-checked]]:rounded-t-none",
        size.px,
        size.gap,
        size.text,
        shape,
        description ? "h-auto py-2" : size.control,
        className
      )}
      render={(checkboxProps, state) => (
        <RenderSpan
          {...checkboxProps}
          render={
            typeof render === "function"
              ? (elementProps) => render(elementProps, state)
              : render
          }
        >
          <span
            aria-hidden="true"
            className={cn(
              "flex shrink-0 items-center justify-center rounded border border-input",
              size.variant === "compact" ? "size-3.5" : "size-4"
            )}
          >
            {checkboxProps.children}
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
        </RenderSpan>
      )}
      {...props}
    />
  );
};
