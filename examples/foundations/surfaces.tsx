"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Elevated } from "@/components/ui/elevated";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { SurfaceProvider, useSurface } from "@/lib/surface-context";

const Level = () => (
  <span className="text-muted-foreground text-xs">Surface {useSurface()}</span>
);
const NestedPopover = () => {
  const [selection, setSelection] = useState("Choose an action");
  return (
    <Popover>
      <PopoverTrigger
        render={<Button variant="outline">Open popover</Button>}
      />
      <PopoverContent className="flex flex-col gap-4">
        <Level />
        <p className="text-sm">A popover above its parent.</p>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="outline">Open nested menu</Button>}
          />
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setSelection("Renamed")}>
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelection("Duplicated")}>
                Duplicate
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <div className="px-2 py-1">
              <Level />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <p role="status" className="text-sm">
          {selection}
        </p>
      </PopoverContent>
    </Popover>
  );
};
export const SurfacesDemo = () => (
  <SurfaceProvider value={1}>
    <Elevated offset={0} className="flex flex-col gap-5 rounded-xl p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Page</span>
        <Level />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Card</CardTitle>
          <Level />
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <NestedPopover />
        </CardContent>
      </Card>
      <Dialog>
        <DialogTrigger render={<Button>Open dialog</Button>} />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog</DialogTitle>
            <DialogDescription>
              Open the popover, then its menu to climb the surface ladder.
            </DialogDescription>
          </DialogHeader>
          <Level />
          <NestedPopover />
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 8 }, (_, index) => (
          <SurfaceProvider key={index} value={index + 1}>
            <Elevated offset={0} className="rounded-md p-3 text-center text-xs">
              {index + 1}
            </Elevated>
          </SurfaceProvider>
        ))}
      </div>
    </Elevated>
  </SurfaceProvider>
);
