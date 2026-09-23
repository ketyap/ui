"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";

export const KeyboardShortcutDemo = () => {
  const [enabled, setEnabled] = useState(true);
  const [allowInputs, setAllowInputs] = useState(false);
  const [open, setOpen] = useState(false);
  useKeyboardShortcut("mod+shift+k", () => setOpen(true), {
    enableOnFormTags: allowInputs,
    enabled,
  });
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm">
        Press ⌘⇧K on Mac or Ctrl+Shift+K elsewhere. The site keeps ⌘K for its
        documentation search.
      </p>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(event) => setEnabled(event.target.checked)}
        />
        Enabled
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={allowInputs}
          onChange={(event) => setAllowInputs(event.target.checked)}
        />
        Allow in editable fields
      </label>
      <Input
        aria-label="Shortcut test field"
        placeholder="Try the shortcut while typing here"
      />
      <Button onClick={() => setOpen(true)}>Open shortcut dialog</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Shortcut received</DialogTitle>
            <DialogDescription>
              Base UI still owns focus trapping, Escape, and focus restoration.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
