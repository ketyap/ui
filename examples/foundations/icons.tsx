"use client";
import { ArrowDown, CircleCheck } from "lucide-react";
import { useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DemoButton, DemoSelect } from "@/examples/foundations/controls";
import { IconProvider } from "@/lib/icon-context";

const alternativeIcons = { check: CircleCheck, "chevron-down": ArrowDown };
export const IconsDemo = () => {
  const [value, setValue] = useState("default");
  return (
    <div className="mx-auto flex max-w-xs flex-col gap-4">
      <Tabs value={value} onValueChange={setValue}>
        <TabsList aria-label="Icon set">
          <TabsTrigger value="default">Default</TabsTrigger>
          <TabsTrigger value="alternative">Alternative</TabsTrigger>
        </TabsList>
      </Tabs>
      <IconProvider icons={value === "alternative" ? alternativeIcons : {}}>
        <div className="flex items-center gap-3">
          <DemoSelect />
          <DemoButton />
        </div>
      </IconProvider>
    </div>
  );
};
