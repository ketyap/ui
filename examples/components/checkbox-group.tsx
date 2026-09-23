"use client";
import { useState } from "react";

import { CheckboxGroup, CheckboxItem } from "@/components/ui/checkbox-group";

export const CheckboxGroupDemo = () => {
  const [value, setValue] = useState(["fiction", "science"]);
  return (
    <div className="grid max-w-md gap-5">
      <CheckboxGroup
        aria-label="Reading interests"
        value={value}
        onValueChange={setValue}
      >
        <CheckboxItem value="fiction" label="Fiction" />
        <CheckboxItem value="science" label="Science" />
        <CheckboxItem
          value="history"
          label="History"
          description="Explore the past"
        />
        <CheckboxItem value="poetry" label="Poetry" disabled />
      </CheckboxGroup>
      <p className="text-xs text-muted-foreground">
        Selected: {value.join(", ") || "none"}
      </p>
    </div>
  );
};
