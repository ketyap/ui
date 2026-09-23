"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useControllableState } from "@/hooks/use-controllable-state";

const Counter = ({
  value,
  onChange,
}: {
  value?: number;
  onChange?: (value: number) => void;
}) => {
  const [count, setCount] = useControllableState({
    defaultValue: 0,
    onChange,
    value,
  });
  return (
    <Button
      variant="outline"
      onClick={() => setCount((previous) => previous + 1)}
    >
      Count: {count}
    </Button>
  );
};
export const ControllableStateDemo = () => {
  const [value, setValue] = useState(0);
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium">Uncontrolled</h3>
        <Counter />
      </section>
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium">Controlled</h3>
        <Counter value={value} onChange={setValue} />
        <Button variant="ghost" onClick={() => setValue(0)}>
          Reset from parent
        </Button>
      </section>
    </div>
  );
};
