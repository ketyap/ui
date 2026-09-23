"use client";

import { InputField, InputGroup } from "@/components/ui/input-group";

export const InputGroupValidationDemo = () => (
  <InputGroup size="compact">
    <InputField
      label="Email"
      type="email"
      defaultValue="invalid"
      error="Enter a valid email address."
    />
    <InputField
      label="Read only"
      defaultValue="Managed by your team"
      disabled
    />
  </InputGroup>
);
