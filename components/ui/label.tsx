"use client";

import { useRender } from "@base-ui/react/use-render";

import { useSize } from "@/lib/size-context";
import type { SizeVariant } from "@/lib/size-context";
import { cn } from "@/lib/utils";

export type LabelProps = useRender.ComponentProps<"label"> & {
  density?: SizeVariant;
};

export const Label = ({ className, density, render, ...props }: LabelProps) => {
  const sizes = useSize(density);
  return useRender({
    defaultTagName: "label",
    props: {
      ...props,
      className: cn(
        "flex items-center gap-2 font-medium leading-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-data-[disabled]:cursor-not-allowed peer-data-[disabled]:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        sizes.text,
        className
      ),
      "data-slot": "label",
    },
    render,
  });
};
