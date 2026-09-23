"use client";
import { InputCopy } from "@/components/ui/input-copy";

export const InputCopyDemo = () => (
  <div className="flex max-w-sm flex-col gap-5">
    <InputCopy label="Share link" value="https://example.com/library" />
    <InputCopy value="pnpm dlx shadcn@latest add button" variant="button" />
    <InputCopy value="Compact copy" size="compact" align="left" />
    <InputCopy value="Unavailable" disabled />
  </div>
);
