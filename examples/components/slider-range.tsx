"use client";
import { Slider } from "@/components/ui/slider";

export const SliderRangeDemo = () => (
  <Slider
    label="Price"
    size="compact"
    defaultValue={[20, 70]}
    step={5}
    marks={[
      { label: "0", value: 0 },
      { label: "50", value: 50 },
      { label: "100", value: 100 },
    ]}
  />
);
