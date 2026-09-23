"use client";

import { Button as Primitive } from "@base-ui/react/button";
import { AnimatePresence, motion } from "motion/react";
import type { ComponentProps } from "react";

import { useClipboard } from "@/hooks/use-clipboard";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Icon } from "@/lib/icon-context";
import { motionTransition, spring } from "@/lib/motion";
import { useShape } from "@/lib/shape-context";
import { useSize } from "@/lib/size-context";
import type { SizeVariant } from "@/lib/size-context";
import { cn } from "@/lib/utils";

export interface InputCopyProps extends Omit<
  ComponentProps<"div">,
  "onCopy" | "children"
> {
  value: string;
  label?: string;
  disabled?: boolean;
  size?: SizeVariant;
  variant?: "icon" | "button";
  align?: "left" | "right";
  onCopy?: () => void;
}
export const InputCopy = ({
  value,
  label,
  disabled,
  size,
  variant = "icon",
  align = "right",
  onCopy,
  className,
  ...props
}: InputCopyProps) => {
  const { copy, copied, error } = useClipboard();
  const sizes = useSize(size);
  const shape = useShape();
  const reduced = useReducedMotion();
  const copyStatus = copied ? "Copied" : "Copy";
  const status = error ? "Copy failed" : copyStatus;
  const copyIcon = copied ? "check" : "copy";
  const successAnnouncement = copied ? "Copied to clipboard" : "";
  return (
    <div className={cn("flex min-w-0 flex-col gap-1", className)} {...props}>
      {label && (
        <span className={cn("text-muted-foreground", sizes.text)}>{label}</span>
      )}
      <Primitive
        disabled={disabled}
        aria-label={`${status}${label ? ` ${label}` : " to clipboard"}`}
        onClick={async () => {
          if (await copy(value)) {
            onCopy?.();
          }
        }}
        className={cn(
          "group flex w-full min-w-0 items-center text-left outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
          sizes.control,
          sizes.text,
          sizes.px,
          sizes.gap,
          shape,
          align === "left" && "flex-row-reverse"
        )}
      >
        <span className="min-w-0 flex-1 truncate font-mono">
          <span className="group-hover:bg-[#6b97ff]/20">{value}</span>
        </span>
        <span
          className={cn(
            "flex shrink-0 items-center gap-1.5",
            sizes.iconClass,
            error && "text-destructive"
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={status}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={motionTransition(spring.fast, reduced)}
              className="flex"
            >
              <Icon name={error ? "close" : copyIcon} />
            </motion.span>
          </AnimatePresence>
          {variant === "button" && <span className="min-w-12">{status}</span>}
        </span>
      </Primitive>
      <span role="status" className="sr-only">
        {error ? "Unable to copy. Try again." : successAnnouncement}
      </span>
    </div>
  );
};
