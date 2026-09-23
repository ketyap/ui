"use client";
import { Search } from "lucide-react";

import { InputField, InputGroup } from "@/components/ui/input-group";

export const InputGroupDemo = () => (
  <div className="flex flex-wrap gap-8">
    <InputGroup>
      <InputField
        label="Website"
        prefix="https://"
        suffix=".com"
        placeholder="example"
        description="Your public website."
      />
      <InputField label="Search" icon={Search} placeholder="Search books" />
      <InputField
        label="Budget"
        prefix="$"
        addon="USD"
        type="number"
        defaultValue="100"
      />
    </InputGroup>
  </div>
);
