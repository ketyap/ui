"use client";
import type { ComponentProps } from "react";

const AspectRatio = ({
  ratio = 1,
  style,
  ...props
}: ComponentProps<"div"> & { ratio?: number }) => (
  <div
    data-slot="aspect-ratio"
    style={{
      aspectRatio: ratio,
      position: "relative",
      width: "100%",
      ...style,
    }}
    {...props}
  />
);
export { AspectRatio };
