"use client";

import { Field } from "@base-ui/react/field";

import { Input } from "@/components/ui/input";

export const InputFieldDemo = () => (
  <Field.Root
    invalid
    className="flex w-full max-w-sm flex-col gap-1.5 text-[13px]"
  >
    <Field.Label>Email</Field.Label>
    <Input type="email" defaultValue="invalid-email" />
    <Field.Error match className="text-xs text-destructive">
      Enter a valid email address.
    </Field.Error>
  </Field.Root>
);
