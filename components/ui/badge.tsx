"use client";
import type { useRender } from "@base-ui/react/use-render";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";

import { RenderSpan } from "@/components/ui/render-element";
import type { IconComponent } from "@/lib/icon-context";
import { useShape } from "@/lib/shape-context";
import { useSizeVariant } from "@/lib/size-context";
import { cn } from "@/lib/utils";

export const badgeColors = {
  amber: "#f59e0b",
  blue: "#3b82f6",
  cyan: "#06b6d4",
  emerald: "#10b981",
  fuchsia: "#d946ef",
  gray: "#a3a3a3",
  green: "#22c55e",
  indigo: "#6366f1",
  lime: "#84cc16",
  orange: "#f97316",
  pink: "#ec4899",
  purple: "#a855f7",
  red: "#ef4444",
  rose: "#f43f5e",
  teal: "#14b8a6",
  violet: "#8b5cf6",
  yellow: "#eab308",
} as const;
export type BadgeColor = keyof typeof badgeColors;

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        dot: "border-border text-foreground bg-transparent",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        solid: "border-transparent text-foreground",
      },
    },
  }
);

const Badge = ({
  className,
  variant,
  render,
  size,
  color = "gray",
  icon: BadgeIcon,
  children,
  style,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    render?: useRender.RenderProp;
    size?: "default" | "compact";
    color?: BadgeColor;
    icon?: IconComponent;
  }) => {
  const Comp = RenderSpan;
  const compact = useSizeVariant(size) === "compact";
  const shape = useShape();
  const appearance = variant ?? "solid";
  const tint = badgeColors[color];

  return (
    <Comp
      render={render}
      data-slot="badge"
      data-variant={variant}
      className={cn(
        badgeVariants({ variant: appearance }),
        compact ? "h-5 px-2 text-[11px] gap-1" : "h-6 px-2.5 text-xs gap-1.5",
        shape,
        className
      )}
      style={{
        backgroundColor:
          appearance === "solid"
            ? `color-mix(in srgb, ${tint} 15%, var(--background))`
            : undefined,
        ...style,
      }}
      {...props}
    >
      {appearance === "dot" && (
        <span
          aria-hidden="true"
          className="shrink-0 rounded-full"
          style={{
            backgroundColor: tint,
            height: compact ? 6 : 7,
            width: compact ? 6 : 7,
          }}
        />
      )}
      {BadgeIcon && <BadgeIcon aria-hidden="true" />}
      {children}
    </Comp>
  );
};

export { Badge, badgeVariants };
