"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SizeProvider } from "@/lib/size-context";

const numberOptions = Array.from({ length: 30 }, (_, index) => ({
  label: `Option ${index + 1}`,
  value: index,
}));
export const SelectScrollDemo = () => (
  <SizeProvider size="compact">
    <Select items={numberOptions}>
      <SelectTrigger aria-label="Long list">
        <SelectValue placeholder="Choose a number" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {numberOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  </SizeProvider>
);
