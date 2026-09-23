"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { spring, motionTransition } from "@/lib/motion";

export const MotionDemo = () => {
  const [moved, setMoved] = useState(false);
  const [visible, setVisible] = useState(true);
  const reduced = useReducedMotion();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setMoved(!moved)}>Move presets</Button>
        <Button variant="outline" onClick={() => setVisible(!visible)}>
          {visible ? "Exit" : "Enter"}
        </Button>
      </div>
      <div className="grid gap-5">
        {(["fast", "moderate", "slow"] as const).map((tier) => (
          <div key={tier} className="flex flex-col gap-2">
            <span className="text-muted-foreground text-xs capitalize">
              {tier}
            </span>
            <div className="relative h-12 rounded-lg bg-muted p-1">
              <AnimatePresence>
                {visible && (
                  <motion.div
                    className="absolute top-1 flex size-10 items-center justify-center rounded-md bg-primary text-xs text-primary-foreground"
                    initial={{ opacity: 0, scale: reduced ? 1 : 0.95 }}
                    animate={{
                      left: moved ? "calc(100% - 44px)" : "4px",
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{ opacity: 0, transition: spring[tier].exit }}
                    transition={motionTransition(spring[tier], reduced)}
                  >
                    {tier.slice(0, 1).toUpperCase()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
      {reduced && (
        <p className="text-xs text-muted-foreground">
          Reduced motion is enabled.
        </p>
      )}
    </div>
  );
};
