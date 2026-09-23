"use client";
import { useState } from "react";

import { RadioGroup, RadioItem } from "@/components/ui/radio-group";

export const RadioGroupDemo = () => {
  const [value, setValue] = useState("weekly");
  return (
    <div className="grid max-w-md gap-5">
      <RadioGroup
        aria-label="Delivery schedule"
        value={value}
        onValueChange={(next) => setValue(String(next))}
      >
        <RadioItem
          value="daily"
          label="Daily"
          description="A short update every morning"
        />
        <RadioItem value="weekly" label="Weekly" />
        <RadioItem value="monthly" label="Monthly" />
        <RadioItem value="unavailable" label="Unavailable" disabled />
      </RadioGroup>
      <p className="text-xs text-muted-foreground">Selected: {value}</p>
    </div>
  );
};
