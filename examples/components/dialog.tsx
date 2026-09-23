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

export const DialogDemo = () => (
  <div className="flex gap-3">
    {(["small", "default", "large"] as const).map((size) => (
      <Dialog key={size}>
        <DialogTrigger render={<Button variant="tertiary" />}>
          Open {size}
        </DialogTrigger>
        <DialogContent size={size}>
          <DialogHeader>
            <DialogTitle>Library settings</DialogTitle>
            <DialogDescription>
              Choose a genre and manage your library.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            These preferences apply to your library.
          </p>
          <DialogFooter>
            <DialogClose render={<Button variant="tertiary" />}>
              Cancel
            </DialogClose>
            <DialogClose render={<Button />}>Save changes</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ))}
  </div>
);
