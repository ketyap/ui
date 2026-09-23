"use client";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";

export const AutoResizeTextareaDemo = () => {
  const [value, setValue] = useState("");
  const [sent, setSent] = useState("");
  const id = useId();
  const { ref } = useAutoResizeTextarea({
    maxHeight: 180,
    minHeight: 64,
    value,
  });
  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(value);
        setValue("");
      }}
    >
      <label className="text-sm" htmlFor={id}>
        Message
      </label>
      <textarea
        id={id}
        ref={ref}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Write a message. Add a few lines…"
        className="min-h-16 w-full resize-none rounded-lg border border-input bg-transparent p-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm"
      />
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={!value.trim()}>
          Send message
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            setValue(
              "A short project update.\n\nThe foundations are ready.\nThe hooks are reusable.\nThe previews are interactive.\n\nTry adding more lines to reach the maximum height."
            )
          }
        >
          Load draft
        </Button>
      </div>
      <p role="status" className="text-muted-foreground text-sm">
        {sent
          ? "Message sent."
          : "Grows from 64px to 180px, then scrolls natively."}
      </p>
    </form>
  );
};
