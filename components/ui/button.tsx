"use client";

import { Button as BaseButton } from "@base-ui/react/button";
import type { useRender } from "@base-ui/react/use-render";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";

import type { FeedbackType } from "@/hooks/use-feedback";
import { useFeedback } from "@/hooks/use-feedback";
import { Icon } from "@/lib/icon-context";
import type { IconComponent } from "@/lib/icon-context";
import { useShape } from "@/lib/shape-context";
import type { ShapeVariant } from "@/lib/shape-context";
import { useSize } from "@/lib/size-context";
import type { SizeVariant } from "@/lib/size-context";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[background-color,box-shadow,transform] duration-(--motion-fast) motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        compact: "h-7 gap-1 px-3 text-xs",
        default: "h-9 gap-1.5 px-4 text-[13px]",
        icon: "size-9",
        "icon-compact": "size-7 p-0",
        "icon-lg": "size-10",
        "icon-sm": "size-8",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
      },
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-foreground/10 text-foreground hover:bg-foreground/15",
        tertiary: "border border-border bg-transparent hover:bg-foreground/5",
      },
    },
  }
);

export interface ButtonProps
  extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  render?: useRender.RenderProp<object>;
  sound?: FeedbackType;
  haptic?: boolean;
  density?: SizeVariant;
  shape?: ShapeVariant;
  loading?: boolean;
  active?: boolean;
  leadingIcon?: IconComponent;
  trailingIcon?: IconComponent;
  nativeButton?: boolean;
}

const resolveDensity = (
  size: ButtonProps["size"],
  density?: SizeVariant
): SizeVariant | undefined => {
  if (size === "compact" || size === "icon-compact") {
    return "compact";
  }
  if (size === "default" || size === "icon") {
    return "default";
  }
  return density;
};

const iconPadding = {
  compact: { leading: "pl-2", trailing: "pr-2" },
  default: { leading: "pl-3", trailing: "pr-3" },
};

const Button = ({
  className,
  variant,
  size,
  render,
  sound,
  haptic,
  onClick,
  density,
  shape,
  loading = false,
  active = false,
  leadingIcon: LeadingIcon,
  trailingIcon: TrailingIcon,
  children,
  disabled,
  nativeButton,
  ...props
}: ButtonProps) => {
  const play = useFeedback({ haptic, sound });
  const sizes = useSize(resolveDensity(size, density));
  const iconOnly = !!size?.startsWith("icon");
  const radius = useShape(shape);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    play();
    onClick?.(e);
  };

  return (
    <BaseButton
      render={render}
      nativeButton={nativeButton ?? !render}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-active={active || undefined}
      data-slot="button"
      data-size={size}
      data-variant={variant}
      className={cn(
        buttonVariants({ size, variant }),
        !size && [
          sizes.control,
          sizes.text,
          sizes.gap,
          sizes.variant === "default" ? "px-4 gap-1.5" : "px-3",
          sizes.iconClass,
        ],
        "relative font-normal data-[active]:brightness-90",
        sizes.iconClass,
        LeadingIcon && !iconOnly && iconPadding[sizes.variant].leading,
        TrailingIcon && !iconOnly && iconPadding[sizes.variant].trailing,
        "[&_svg]:stroke-[1.5] [&_svg]:transition-[stroke-width] hover:[&_svg]:stroke-2",
        radius,
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center gap-[inherit] transition-opacity duration-(--motion-fast)",
          loading && "opacity-0"
        )}
      >
        {!iconOnly && LeadingIcon && <LeadingIcon aria-hidden="true" />}
        {children}
        {!iconOnly && TrailingIcon && <TrailingIcon aria-hidden="true" />}
      </span>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Icon
            name="loading"
            className="animate-spin motion-reduce:animate-none"
          />
        </span>
      )}
    </BaseButton>
  );
};

export { Button, buttonVariants };
