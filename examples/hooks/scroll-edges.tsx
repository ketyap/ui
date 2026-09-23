"use client";
/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- Scroll viewports need keyboard focus for native arrow-key scrolling. */
import { useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useScrollEdges } from "@/hooks/use-scroll-edges";
import { cn } from "@/lib/utils";

export const ScrollEdgesDemo = () => {
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">(
    "horizontal"
  );
  const { ref, atStart, atEnd, canScroll } = useScrollEdges({ orientation });
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <Tabs
        value={orientation}
        onValueChange={(value) => setOrientation(value as typeof orientation)}
      >
        <TabsList aria-label="Scroll axis">
          <TabsTrigger value="horizontal">Horizontal</TabsTrigger>
          <TabsTrigger value="vertical">Vertical</TabsTrigger>
        </TabsList>
      </Tabs>
      {/* Keyboard users must be able to focus the scroll viewport. */}
      <div
        ref={ref}
        tabIndex={0}
        role="region"
        aria-label="Scroll edge example"
        className="h-40 overflow-auto rounded-lg border outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div
          className={cn(
            "flex gap-3 p-3",
            orientation === "horizontal" ? "w-max" : "flex-col"
          )}
        >
          {Array.from({ length: 10 }, (_, index) => (
            <div
              key={index}
              className="flex h-24 w-36 shrink-0 items-center justify-center rounded-md bg-muted text-sm"
            >
              Item {index + 1}
            </div>
          ))}
        </div>
      </div>
      <output className="text-muted-foreground font-mono text-xs">
        atStart: {String(atStart)} · atEnd: {String(atEnd)} · canScroll:{" "}
        {String(canScroll)}
      </output>
    </div>
  );
};
