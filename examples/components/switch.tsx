"use client";
import { useState } from "react";

import { Switch } from "@/components/ui/switch";
import { SizeProvider } from "@/lib/size-context";

export const SwitchDemo = () => {
  const [checked, setChecked] = useState(true);
  return (
    <div className="flex flex-col gap-5">
      <Switch
        label="Notifications"
        checked={checked}
        onCheckedChange={setChecked}
      />
      <Switch label="Automatic updates" defaultChecked />
      <SizeProvider size="compact">
        <Switch label="Compact" />
      </SizeProvider>
      <Switch label="Unavailable" disabled />
      <p className="text-xs text-muted-foreground">
        Notifications {checked ? "on" : "off"}
      </p>
    </div>
  );
};
