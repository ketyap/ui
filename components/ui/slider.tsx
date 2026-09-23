"use client";

import { Slider as Primitive } from "@base-ui/react/slider";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useMeasure } from "@/hooks/use-measure";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { spring } from "@/lib/motion";
import { useShape } from "@/lib/shape-context";
import { useSize } from "@/lib/size-context";
import type { SizeVariant } from "@/lib/size-context";
import { cn } from "@/lib/utils";

export interface SliderProps extends Primitive.Root.Props<
  number | readonly number[]
> {
  label?: string;
  size?: SizeVariant;
  variant?: "comfortable" | "scrubber";
  marks?: readonly (number | { value: number; label?: ReactNode })[];
  tooltip?: boolean;
}

const emptyMarks: NonNullable<SliderProps["marks"]> = [];

export const Slider = ({
  label = "Value",
  size,
  variant = "comfortable",
  marks = emptyMarks,
  tooltip = true,
  className,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  ...props
}: SliderProps) => {
  const sizes = useSize(size);
  const shape = useShape();
  const reduced = useReducedMotion();
  const control = useMeasure();
  const labelMeasure = useMeasure<HTMLSpanElement>();
  const valueMeasure = useMeasure<HTMLOutputElement>();
  const compact = sizes.variant === "compact";
  const target = useRef(0);
  const stretch = useMotionValue(0);
  const x = useTransform(stretch, (distance) => distance / 2);
  const scaleX = useTransform(stretch, (distance) =>
    control.width ? 1 + Math.abs(distance) / control.width : 1
  );

  useEffect(() => {
    if (disabled || reduced) {
      target.current = 0;
      stretch.jump(0);
    }
  }, [disabled, reduced, stretch]);

  useEffect(() => () => stretch.stop(), [stretch]);

  const animateStretch = (distance: number) => {
    if (target.current === distance) {
      return;
    }
    target.current = distance;
    animate(stretch, distance, spring.moderate);
  };

  const releaseStretch = () => animateStretch(0);

  const fraction = (value: number) =>
    max > min ? Math.max(0, Math.min(1, (value - min) / (max - min))) : 0;
  const intervals = step > 0 ? (max - min) / step : 0;
  const ticks = marks.length
    ? marks.map((mark) => (typeof mark === "number" ? mark : mark.value))
    : Array.from(
        { length: intervals > 0 ? Math.min(9, Math.ceil(intervals) - 1) : 0 },
        (_, index) =>
          intervals <= 10
            ? min + (index + 1) * step
            : min + ((index + 1) * (max - min)) / 10
      );

  return (
    <Primitive.Root
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      defaultValue={min}
      thumbAlignment="edge"
      data-slot="slider"
      className={cn("w-full min-w-24 data-[disabled]:opacity-50", className)}
      {...props}
    >
      <Primitive.Control
        ref={control.ref}
        className={cn(
          "group/slider relative flex w-full touch-none items-center select-none outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background data-[disabled]:pointer-events-none",
          sizes.control,
          shape
        )}
        onPointerMove={(event) => {
          // Observe Base UI's captured drag only; value and focus stay with the primitive.
          if (
            reduced ||
            disabled ||
            props.orientation === "vertical" ||
            !event.currentTarget.hasPointerCapture(event.pointerId)
          ) {
            return;
          }
          const bounds = event.currentTarget.getBoundingClientRect();
          const overflow =
            event.clientX -
            Math.max(bounds.left, Math.min(event.clientX, bounds.right));
          animateStretch(8 * Math.tanh(overflow / 80));
        }}
        onLostPointerCapture={releaseStretch}
        onPointerUp={releaseStretch}
        onPointerCancel={releaseStretch}
      >
        <motion.div
          data-slot="slider-surface"
          className="absolute inset-0 flex items-center"
          style={{ scaleX: reduced ? 1 : scaleX, x: reduced ? 0 : x }}
        >
          <Primitive.Track
            className={cn(
              "relative w-full overflow-hidden bg-foreground/5",
              compact ? "h-[18px] rounded-full" : ["h-full", shape]
            )}
          >
            <Primitive.Indicator className="absolute h-full bg-foreground/10 transition-colors duration-(--motion-fast) group-hover/slider:bg-foreground/15 group-focus-within/slider:bg-foreground/15 group-data-[dragging]/slider:bg-foreground/15 motion-reduce:transition-none" />
            <div
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-0 transition-opacity duration-(--motion-fast) motion-reduce:transition-none",
                !marks.length &&
                  "opacity-0 group-hover/slider:opacity-100 group-focus-within/slider:opacity-100 group-data-[dragging]/slider:opacity-100"
              )}
            >
              {ticks.map((value) => (
                <span
                  key={value}
                  className={cn(
                    "absolute top-1/2 w-px -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/20",
                    compact ? "h-1" : "h-2"
                  )}
                  style={{ left: `${fraction(value) * 100}%` }}
                />
              ))}
            </div>
            {!compact && (
              <div
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute inset-0 flex items-center justify-between gap-4",
                  sizes.px,
                  sizes.text
                )}
              >
                <span ref={labelMeasure.ref} className="truncate font-medium">
                  {label}
                </span>
                <Primitive.Value
                  ref={valueMeasure.ref}
                  className="shrink-0 text-muted-foreground tabular-nums transition-colors duration-(--motion-fast) group-hover/slider:text-foreground group-focus-within/slider:text-foreground motion-reduce:transition-none"
                />
              </div>
            )}
          </Primitive.Track>
          <Primitive.Value render={<div />}>
            {(formatted, values) =>
              values.map((value, index) => {
                const position = fraction(value) * control.width;
                const overlapsText =
                  !compact &&
                  control.width > 0 &&
                  (position < labelMeasure.width + 24 ||
                    position > control.width - valueMeasure.width - 24);
                return (
                  <Tooltip key={index} disabled={!tooltip}>
                    <TooltipTrigger
                      render={
                        <Primitive.Thumb
                          index={index}
                          getAriaLabel={() =>
                            values.length > 1
                              ? `${label} ${index === 0 ? "minimum" : "maximum"}`
                              : label
                          }
                        />
                      }
                      className={cn(
                        "group/thumb flex items-center justify-center rounded-full outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                        compact ? "size-4" : "h-full w-3"
                      )}
                      style={
                        {
                          "--slider-handle-opacity": overlapsText ? 0.15 : 1,
                        } as CSSProperties
                      }
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "pointer-events-none block rounded-full transition-[transform,opacity] duration-(--motion-fast) motion-reduce:transition-none",
                          compact
                            ? "size-4 border border-border bg-background shadow-sm group-hover/thumb:scale-110 group-data-[dragging]/thumb:scale-110 motion-reduce:transform-none"
                            : "w-1 bg-foreground/60 opacity-0 group-hover/slider:opacity-(--slider-handle-opacity) group-focus-within/slider:opacity-(--slider-handle-opacity) group-data-[dragging]/slider:opacity-(--slider-handle-opacity)",
                          !compact && (variant === "scrubber" ? "h-6" : "h-5")
                        )}
                      />
                    </TooltipTrigger>
                    <TooltipContent>{formatted[index]}</TooltipContent>
                  </Tooltip>
                );
              })
            }
          </Primitive.Value>
        </motion.div>
      </Primitive.Control>
      {marks.some((mark) => typeof mark !== "number" && mark.label) && (
        <div className="relative mt-1 h-5 text-xs text-muted-foreground">
          {marks.map((mark) =>
            typeof mark !== "number" && mark.label ? (
              <span
                key={mark.value}
                className="absolute -translate-x-1/2"
                style={{ left: `${fraction(mark.value) * 100}%` }}
              >
                {mark.label}
              </span>
            ) : null
          )}
        </div>
      )}
    </Primitive.Root>
  );
};
