"use client";

import { useState } from "react";

import { CheckboxGroup, CheckboxItem } from "@/components/ui/checkbox-group";

const options = ["Design", "Development"];

export const CheckboxGroupControlledDemo = () => {
  const [selected, setSelected] = useState(["Design"]);
  const allChecked = selected.length === options.length;

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <CheckboxItem
        label="Select all"
        className="font-medium"
        checked={allChecked}
        indeterminate={!allChecked && selected.length > 0}
        onCheckedChange={(checked) => setSelected(checked ? options : [])}
      />
      <CheckboxGroup
        aria-label="Disciplines"
        value={selected}
        onValueChange={setSelected}
      >
        {options.map((label) => (
          <CheckboxItem key={label} value={label} label={label} />
        ))}
      </CheckboxGroup>
    </div>
  );
};
