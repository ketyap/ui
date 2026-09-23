"use client";
import { MotionDemo } from "@/examples/foundations/motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export const ReducedMotionDemo = () => {
  const reduced = useReducedMotion();
  return (
    <div className="flex flex-col gap-5">
      <p role="status" className="text-sm">
        System preference: {reduced ? "Reduce motion" : "No preference"}
      </p>
      <MotionDemo />
    </div>
  );
};
