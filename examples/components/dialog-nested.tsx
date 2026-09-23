"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const DialogNestedDemo = () => (
  <Dialog>
    <DialogTrigger render={<Button variant="tertiary" />}>
      Open nested overlays
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Library settings</DialogTitle>
        <DialogDescription>
          Try a menu or tooltip without leaving the dialog.
        </DialogDescription>
      </DialogHeader>
      <Select
        items={{ fiction: "Fiction", science: "Science" }}
        defaultValue="fiction"
      >
        <SelectTrigger aria-label="Genre">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fiction">Fiction</SelectItem>
          <SelectItem value="science">Science</SelectItem>
        </SelectContent>
      </Select>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="tertiary" />}>
          Library actions
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>New book</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogFooter>
        <DialogClose render={<Button variant="tertiary" />}>Cancel</DialogClose>
        <Tooltip>
          <TooltipTrigger render={<Button />}>Save changes</TooltipTrigger>
          <TooltipContent>Save your library preferences</TooltipContent>
        </Tooltip>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
