"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Icon } from "@/lib/icon-context";

export const DemoSelect = () => (
  <Select
    defaultValue="editor"
    items={{ editor: "Editor", owner: "Owner", viewer: "Viewer" }}
  >
    <SelectTrigger aria-label="Role">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem value="viewer">Viewer</SelectItem>
        <SelectItem value="editor">Editor</SelectItem>
        <SelectItem value="owner">Owner</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
);

export const DemoButton = () => {
  const [saved, setSaved] = useState(false);
  return (
    <Button onClick={() => setSaved(!saved)}>
      <Icon name="check" />
      {saved ? "Saved" : "Save"}
    </Button>
  );
};

export const Controls = () => (
  <div className="flex min-w-0 flex-col gap-3">
    <Input aria-label="Name" placeholder="Name" />
    <DemoSelect />
    <DemoButton />
  </div>
);
