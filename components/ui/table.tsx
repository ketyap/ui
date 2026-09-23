"use client";

import type { ComponentProps } from "react";

import { FluidHoverArea } from "@/components/ui/fluid-hover-area";
import { SizeProvider, useSize } from "@/lib/size-context";
import type { SizeVariant } from "@/lib/size-context";
import { cn } from "@/lib/utils";

export const Table = ({
  size,
  className,
  ...props
}: ComponentProps<"table"> & { size?: SizeVariant }) => {
  const sizes = useSize(size);
  return (
    <SizeProvider size={sizes.variant}>
      <FluidHoverArea
        itemSelector="tbody [data-interactive]"
        className="overflow-x-auto"
      >
        <table
          className={cn(
            "relative w-full border-collapse",
            sizes.text,
            className
          )}
          {...props}
        />
      </FluidHoverArea>
    </SizeProvider>
  );
};
export const TableHeader = (props: ComponentProps<"thead">) => (
  <thead {...props} />
);
export const TableBody = (props: ComponentProps<"tbody">) => (
  <tbody {...props} />
);
export const TableRow = ({
  selected,
  interactive,
  className,
  ...props
}: ComponentProps<"tr"> & { selected?: boolean; interactive?: boolean }) => (
  <tr
    data-selected={selected || undefined}
    data-interactive={interactive || undefined}
    className={cn(
      "border-b border-border/60 transition-colors duration-(--motion-fast) data-[selected]:bg-foreground/5 data-[fluid-hover-active]:border-transparent focus-within:bg-foreground/5",
      className
    )}
    {...props}
  />
);
export const TableHead = ({ className, ...props }: ComponentProps<"th">) => {
  const size = useSize();
  return (
    <th
      className={cn("text-left font-medium", size.control, size.px, className)}
      {...props}
    />
  );
};
export const TableCell = ({ className, ...props }: ComponentProps<"td">) => {
  const size = useSize();
  return (
    <td className={cn(size.control, size.px, "py-1", className)} {...props} />
  );
};
export const TableCaption = ({
  className,
  ...props
}: ComponentProps<"caption">) => (
  <caption
    className={cn(
      "caption-bottom py-3 text-left text-xs text-muted-foreground",
      className
    )}
    {...props}
  />
);
