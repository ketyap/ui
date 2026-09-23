"use client";
import { motion } from "motion/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useMeasure } from "@/hooks/use-measure";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { motionPresets, motionTransition } from "@/lib/motion";

export const MeasureDemo = () => {
  const [expanded, setExpanded] = useState(false);
  const { ref, width, height } = useMeasure();
  const reduced = useReducedMotion();
  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="outline"
        aria-expanded={expanded}
        onClick={() => setExpanded(!expanded)}
      >
        Toggle content
      </Button>
      <motion.div
        animate={{ height: height || "auto" }}
        transition={motionTransition(motionPresets.layout, reduced)}
        className="overflow-hidden rounded-lg border"
      >
        <div ref={ref} className="flex flex-col gap-4 p-5">
          <p className="text-sm">
            This container follows its measured content.
          </p>
          {expanded && (
            <p className="text-muted-foreground text-sm">
              Resize the window or toggle this paragraph. ResizeObserver
              measures the inner content, and the outer container uses the
              shared layout spring to follow its height.
            </p>
          )}
        </div>
      </motion.div>
      <output className="text-muted-foreground font-mono text-xs">
        {width} × {height}px
      </output>
    </div>
  );
};
