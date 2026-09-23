"use client";

import { useId } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const LabelDemo = () => {
  const id = useId();
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="grid gap-2">
        <Label htmlFor={`${id}-email`}>Your email address</Label>
        <Input id={`${id}-email`} type="email" placeholder="you@example.com" />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id={`${id}-terms`} />
        <Label htmlFor={`${id}-terms`}>Accept terms and conditions</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id={`${id}-disabled`} className="peer" disabled />
        <Label htmlFor={`${id}-disabled`}>Unavailable option</Label>
      </div>
    </div>
  );
};
