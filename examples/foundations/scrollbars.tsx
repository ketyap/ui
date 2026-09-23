"use client";
import { useState } from "react";

import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ScrollbarsDemo = () => {
  const [native, setNative] = useState(false);
  const [fade, setFade] = useState(true);
  const [visibility, setVisibility] = useState<"auto" | "always" | "hidden">(
    "auto"
  );
  return (
    <div className="flex min-w-0 flex-col gap-5">
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={native}
            onChange={(event) => setNative(event.target.checked)}
          />
          Native
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={fade}
            onChange={(event) => setFade(event.target.checked)}
          />
          Scroll fade
        </label>
        <NativeSelect
          aria-label="Scrollbar visibility"
          value={visibility}
          onChange={(event) =>
            setVisibility(event.target.value as typeof visibility)
          }
        >
          <NativeSelectOption value="auto">Auto visibility</NativeSelectOption>
          <NativeSelectOption value="always">Always visible</NativeSelectOption>
          <NativeSelectOption value="hidden">Hidden</NativeSelectOption>
        </NativeSelect>
      </div>
      <h3 className="text-sm font-medium">Horizontal</h3>
      <ScrollArea
        orientation="horizontal"
        native={native}
        fade={fade}
        visibility={visibility}
        label="Horizontal projects"
        className="h-24 w-full rounded-lg border"
      >
        <div className="flex w-max gap-3 p-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="flex h-14 w-28 shrink-0 items-center justify-center rounded-md bg-muted text-sm"
            >
              Item {index + 1}
            </div>
          ))}
        </div>
      </ScrollArea>
      <h3 className="text-sm font-medium">Vertical</h3>
      <ScrollArea
        native={native}
        fade={fade}
        visibility={visibility}
        label="Vertical activity"
        className="h-32 rounded-lg border"
      >
        <div className="flex flex-col gap-1 p-3">
          {Array.from({ length: 10 }, (_, index) => (
            <div key={index} className="rounded-md px-3 py-2 text-sm">
              Item {index + 1}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
