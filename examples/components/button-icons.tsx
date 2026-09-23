"use client";
import { ArrowRight, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

export const ButtonIconsDemo = () => (
  <div className="flex flex-wrap items-center gap-2">
    <Button leadingIcon={Plus}>Create</Button>
    <Button trailingIcon={ArrowRight}>Next</Button>
    <Button size="icon" aria-label="Search">
      <Search />
    </Button>
    <Button size="compact" shape="pill">
      Compact
    </Button>
    <Button disabled>Disabled</Button>
  </div>
);
