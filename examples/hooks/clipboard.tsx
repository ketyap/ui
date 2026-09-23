"use client";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useClipboard } from "@/hooks/use-clipboard";
import { Icon } from "@/lib/icon-context";

export const ClipboardDemo = () => {
  const [value, setValue] = useState("pnpm add motion");
  const { copy, copied, error } = useClipboard();
  const id = useId();
  const feedback = copied
    ? "Copied to your clipboard. Feedback resets after 2 seconds."
    : "Edit the text, then copy it.";
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={id} className="flex flex-col gap-2 text-sm">
        Text to copy
        <Input
          id={id}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </label>
      <Button
        onClick={() => {
          void copy(value);
        }}
      >
        <Icon name={copied ? "check" : "copy"} />
        {copied ? "Copied" : "Copy text"}
      </Button>
      <p role="status" className="text-muted-foreground text-sm">
        {error ? error.message : feedback}
      </p>
    </div>
  );
};
