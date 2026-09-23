"use client";

import { CheckboxGroup, CheckboxItem } from "@/components/ui/checkbox-group";
import { SizeProvider } from "@/lib/size-context";

export const CheckboxGroupCompactDemo = () => (
  <div className="grid max-w-md gap-5">
    <SizeProvider size="compact">
      <CheckboxGroup aria-label="Compact interests" defaultValue={["fiction"]}>
        <CheckboxItem value="fiction" label="Fiction" />
        <CheckboxItem value="history" label="History" />
      </CheckboxGroup>
    </SizeProvider>
    <CheckboxGroup
      aria-label="Disabled interests"
      defaultValue={["locked"]}
      disabled
    >
      <CheckboxItem value="locked" label="Disabled group" />
    </CheckboxGroup>
  </div>
);
