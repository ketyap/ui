"use client";

import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { SizeProvider } from "@/lib/size-context";

export const RadioGroupCompactDemo = () => (
  <SizeProvider size="compact">
    <RadioGroup aria-label="Compact schedule" defaultValue="daily">
      <RadioItem value="daily" label="Daily" />
      <RadioItem value="weekly" label="Weekly" />
    </RadioGroup>
  </SizeProvider>
);
