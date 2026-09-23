"use client";
import { Check } from "lucide-react";

import type { BadgeColor } from "@/components/ui/badge";
import { Badge, badgeColors } from "@/components/ui/badge";
import { SizeProvider } from "@/lib/size-context";

export const BadgeDemo = () => (
  <div className="flex flex-col gap-5">
    {(["solid", "dot"] as const).map((variant) => (
      <div key={variant} className="flex flex-wrap gap-2">
        {(Object.keys(badgeColors) as BadgeColor[]).map((color) => (
          <Badge key={color} variant={variant} color={color}>
            {color}
          </Badge>
        ))}
      </div>
    ))}
    <SizeProvider size="compact">
      <div className="flex gap-2">
        <Badge color="green" icon={Check}>
          Complete
        </Badge>
        <Badge color="amber" variant="dot">
          Pending
        </Badge>
      </div>
    </SizeProvider>
  </div>
);
