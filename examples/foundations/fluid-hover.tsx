"use client";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { FluidHoverHighlight } from "@/components/ui/fluid-hover-highlight";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useFluidHover } from "@/hooks/use-fluid-hover";
import { cn } from "@/lib/utils";

const folders = ["Inbox", "Drafts", "Sent", "Archive"];
const FluidMenuItems = ({
  onSelect,
}: {
  onSelect: (value: string) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const hover = useFluidHover(ref, { gapClick: false });
  return (
    <DropdownMenuGroup
      ref={ref}
      {...hover.handlers}
      className="relative isolate"
    >
      <FluidHoverHighlight hover={hover} />
      {folders.map((folder, index) => (
        <DropdownMenuItem
          key={folder}
          ref={(node) => hover.registerItem(index, node)}
          onFocus={() => hover.setActiveIndex(index)}
          onBlur={() => hover.setActiveIndex(null)}
          onClick={() => onSelect(folder)}
          className="focus:bg-transparent"
        >
          {folder}
        </DropdownMenuItem>
      ))}
    </DropdownMenuGroup>
  );
};
export const FluidMenuDemo = () => {
  const [selected, setSelected] = useState("Inbox");
  return (
    <div className="flex flex-col gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="outline">Open fluid menu</Button>}
        />
        <DropdownMenuContent>
          <FluidMenuItems onSelect={setSelected} />
        </DropdownMenuContent>
      </DropdownMenu>
      <p role="status" className="text-sm text-muted-foreground">
        Selected: {selected}
      </p>
    </div>
  );
};
export const FluidTableDemo = () => {
  const ref = useRef<HTMLDivElement>(null);
  const hover = useFluidHover(ref, { gapClick: false });
  const [selected, setSelected] = useState("Inbox");
  return (
    <div className="flex flex-col gap-4">
      <div
        ref={ref}
        {...hover.handlers}
        className="relative isolate overflow-hidden rounded-lg border"
      >
        <FluidHoverHighlight hover={hover} />
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Mail folders</caption>
          <thead>
            <tr className="border-b">
              <th scope="col" className="px-4 py-3">
                Folder
              </th>
              <th scope="col" className="px-4 py-3">
                Messages
              </th>
            </tr>
          </thead>
          <tbody>
            {folders.map((folder, index) => (
              <tr key={folder} ref={(node) => hover.registerItem(index, node)}>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onFocus={() => hover.setActiveIndex(index)}
                    onBlur={() => hover.setActiveIndex(null)}
                    onClick={() => setSelected(folder)}
                    className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {folder}
                  </button>
                </td>
                <td className="px-4 py-3">{[24, 3, 18, 42][index]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p role="status" className="text-sm text-muted-foreground">
        Selected: {selected}
      </p>
    </div>
  );
};
export const FluidListDemo = ({ grid = false }: { grid?: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const hover = useFluidHover(ref, { axis: grid ? "xy" : "y" });
  const [selected, setSelected] = useState("Inbox");
  return (
    <div className="flex flex-col gap-4">
      <div
        ref={ref}
        {...hover.handlers}
        className={cn(
          "relative isolate grid gap-2 rounded-xl border p-2",
          grid && "grid-cols-2"
        )}
      >
        <FluidHoverHighlight hover={hover} />
        {folders.map((folder, index) => (
          <button
            key={folder}
            ref={(node) => hover.registerItem(index, node)}
            type="button"
            onFocus={() => hover.setActiveIndex(index)}
            onBlur={() => hover.setActiveIndex(null)}
            onClick={() => setSelected(folder)}
            aria-pressed={selected === folder}
            className={cn(
              "relative rounded-lg px-4 py-3 text-left text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring",
              grid && "h-16",
              selected === folder && "font-semibold"
            )}
          >
            <span>{folder}</span>
          </button>
        ))}
      </div>
      <p role="status" className="text-muted-foreground text-sm">
        Selected: {selected}
      </p>
    </div>
  );
};
export const FluidTabsDemo = () => (
  <Tabs defaultValue="overview">
    <TabsList aria-label="Fluid navigation">
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="analytics">Analytics</TabsTrigger>
      <TabsTrigger value="settings">Settings</TabsTrigger>
    </TabsList>
    <TabsContent value="overview">Your workspace at a glance.</TabsContent>
    <TabsContent value="analytics">Activity increased this week.</TabsContent>
    <TabsContent value="settings">Manage workspace preferences.</TabsContent>
  </Tabs>
);
