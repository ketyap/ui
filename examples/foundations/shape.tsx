"use client";
import { useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Controls } from "@/examples/foundations/controls";
import { ShapeProvider } from "@/lib/shape-context";
import type { ShapeVariant } from "@/lib/shape-context";

export const ShapeDemo = () => {
  const [shape, setShape] = useState<ShapeVariant>("rounded");
  return (
    <ShapeProvider shape={shape}>
      <div className="mx-auto flex max-w-xs flex-col gap-4">
        <Tabs
          value={shape}
          onValueChange={(value) => setShape(value as ShapeVariant)}
        >
          <TabsList aria-label="Shape">
            <TabsTrigger value="rounded">Rounded</TabsTrigger>
            <TabsTrigger value="pill">Pill</TabsTrigger>
          </TabsList>
        </Tabs>
        <Controls />
      </div>
    </ShapeProvider>
  );
};
