"use client";
import { BookOpen } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SelectDemo = () => (
  <div className="flex max-w-xs flex-col gap-5">
    {(["bordered", "borderless"] as const).map((variant) => (
      <Select
        key={variant}
        items={[
          { label: "Fiction", value: "fiction" },
          { label: "Science", value: "science" },
        ]}
      >
        <SelectTrigger
          aria-label={`${variant} genre`}
          variant={variant}
          icon={BookOpen}
        >
          <SelectValue placeholder="Choose a genre" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Genres</SelectLabel>
            <SelectItem value="fiction">Fiction</SelectItem>
            <SelectItem value="science">Science</SelectItem>
            <SelectItem value="unavailable" disabled>
              Unavailable
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    ))}

    <Select disabled>
      <SelectTrigger aria-label="Disabled select">
        <SelectValue placeholder="Unavailable" />
      </SelectTrigger>
    </Select>
  </div>
);
