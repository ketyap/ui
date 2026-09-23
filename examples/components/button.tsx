"use client";
import { Button } from "@/components/ui/button";

export const ButtonDemo = () => (
  <div className="flex flex-wrap gap-2">
    {(
      ["primary", "secondary", "tertiary", "ghost", "destructive"] as const
    ).map((variant) => (
      <Button key={variant} variant={variant}>
        {variant}
      </Button>
    ))}
  </div>
);
