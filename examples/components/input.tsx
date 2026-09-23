"use client";

import { Input } from "@/components/ui/input";

export const InputDemo = () => (
  <div className="flex w-full max-w-sm flex-col gap-4">
    <Input aria-label="Email" type="email" placeholder="you@example.com" />
    <Input
      aria-label="Search"
      type="search"
      placeholder="Search…"
      density="compact"
    />
    <Input aria-label="Read-only value" value="Read-only value" readOnly />
    <Input aria-label="Disabled input" placeholder="Unavailable" disabled />
  </div>
);
