"use client";
import { Controls } from "@/examples/foundations/controls";
import { SizeProvider } from "@/lib/size-context";

export const SizesDemo = () => (
  <div className="mx-auto grid max-w-md gap-6 sm:grid-cols-2">
    {(["default", "compact"] as const).map((size) => (
      <SizeProvider key={size} size={size}>
        <section className="flex flex-col gap-5">
          <h3 className="text-sm font-medium capitalize">
            {size} · {size === "default" ? 36 : 28}px
          </h3>
          <Controls />
        </section>
      </SizeProvider>
    ))}
  </div>
);
