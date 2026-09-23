"use client";
import { useState } from "react";

import { ColorPicker } from "@/components/ui/color-picker";

export const ColorPickerDemo = () => {
  const [value, setValue] = useState("#6B97FF");
  return (
    <div className="flex flex-wrap items-start gap-6">
      <div className="flex flex-col gap-3">
        <ColorPicker value={value} onValueChange={setValue} />
        <output className="text-xs tabular-nums text-muted-foreground">
          {value}
        </output>
      </div>
      <ColorPicker size="compact" defaultValue="#A855F7" />
    </div>
  );
};
