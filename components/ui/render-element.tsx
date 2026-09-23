"use client";

import { useRender } from "@base-ui/react/use-render";

export const RenderDiv = ({
  render,
  ...props
}: useRender.ComponentProps<"div">) =>
  useRender({ defaultTagName: "div", props, render });
export const RenderSpan = ({
  render,
  ...props
}: useRender.ComponentProps<"span">) =>
  useRender({ defaultTagName: "span", props, render });
export const RenderAnchor = ({
  render,
  ...props
}: useRender.ComponentProps<"a">) =>
  useRender({ defaultTagName: "a", props, render });
