"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const TooltipDemo = () => (
  <TooltipProvider delay={200}>
    <div className="flex flex-wrap gap-3">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger render={<Button variant="tertiary" />}>
            {side}
          </TooltipTrigger>
          <TooltipContent side={side}>Save your changes</TooltipContent>
        </Tooltip>
      ))}
      <Tooltip>
        <TooltipTrigger delay={500} render={<Button variant="ghost" />}>
          500ms delay
        </TooltipTrigger>
        <TooltipContent>Delayed hint</TooltipContent>
      </Tooltip>
      <Tooltip disabled>
        <TooltipTrigger render={<Button variant="ghost" />}>
          Tooltip disabled
        </TooltipTrigger>
        <TooltipContent>Hidden</TooltipContent>
      </Tooltip>
    </div>
  </TooltipProvider>
);
