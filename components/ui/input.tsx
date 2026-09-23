"use client";
import { Input as Primitive } from "@base-ui/react/input";

import { useShape } from "@/lib/shape-context";
import type { ShapeVariant } from "@/lib/shape-context";
import { useSize } from "@/lib/size-context";
import type { SizeVariant } from "@/lib/size-context";
import { cn } from "@/lib/utils";

const Input = ({
  className,
  type,
  density,
  shape,
  ...props
}: Omit<React.ComponentProps<typeof Primitive>, "className"> & {
  className?: string;
  density?: SizeVariant;
  shape?: ShapeVariant;
}) => {
  const sizes = useSize(density);
  const radius = useShape(shape);
  return (
    <Primitive
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        sizes.control,
        sizes.px,
        radius,
        sizes.variant === "compact" && "md:text-xs",
        className
      )}
      {...props}
    />
  );
};

export { Input };
