"use client";
import { Slider } from "@/components/ui/slider";

export const SliderDemo = () => (
  <div className="flex max-w-sm flex-col gap-6">
    <Slider label="Volume" defaultValue={40} />
    <Slider label="Scrubber" variant="scrubber" defaultValue={60} step={10} />

    <Slider label="Disabled" defaultValue={30} disabled />
  </div>
);
