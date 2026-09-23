"use client";

import { CheckboxItem } from "@/components/ui/checkbox";

export const CheckboxDemo = () => (
  <CheckboxItem
    name="terms"
    label="Accept terms"
    description="I agree to the terms of service."
    className="max-w-sm"
  />
);
