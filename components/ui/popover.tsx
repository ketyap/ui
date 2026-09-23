"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { useCallback, useEffect, useRef } from "react";

import { dropdownClose, dropdownOpen } from "@/audio/core";
import { Elevated } from "@/components/ui/elevated";
import { useFeedback } from "@/hooks/use-feedback";
import { motionClasses } from "@/lib/motion";
import { useSurface } from "@/lib/surface-context";
import { cn } from "@/lib/utils";

const Popover = ({
  onOpenChange,
  sounds = false,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root> & {
  sounds?: boolean;
}) => {
  const playOpen = useFeedback({ soundDef: dropdownOpen });
  const playClose = useFeedback({ soundDef: dropdownClose });
  const isControlled = props.open !== undefined;
  const lastOpen = useRef(props.open ?? props.defaultOpen ?? false);

  const playStateSound = useCallback(
    (open: boolean) => {
      if (!sounds || open === lastOpen.current) {
        return;
      }

      if (open) {
        playOpen();
      } else {
        playClose();
      }

      lastOpen.current = open;
    },
    [playClose, playOpen, sounds]
  );

  useEffect(() => {
    if (!isControlled) {
      return;
    }

    playStateSound(props.open ?? false);
  }, [isControlled, playStateSound, props.open]);

  const handleOpenChange = useCallback(
    (
      open: boolean,
      details: Parameters<
        NonNullable<
          React.ComponentProps<typeof PopoverPrimitive.Root>["onOpenChange"]
        >
      >[1]
    ) => {
      playStateSound(open);
      onOpenChange?.(open, details);
    },
    [onOpenChange, playStateSound]
  );

  if (!sounds) {
    return (
      <PopoverPrimitive.Root
        data-slot="popover"
        onOpenChange={onOpenChange}
        {...props}
      />
    );
  }

  return (
    <PopoverPrimitive.Root
      data-slot="popover"
      onOpenChange={handleOpenChange}
      {...props}
    />
  );
};

const PopoverTrigger = ({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) => (
  <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
);

const PopoverContent = ({
  className,
  align = "center",
  side = "bottom",
  sideOffset = 4,
  alignOffset = 0,
  collisionPadding = 8,
  anchor,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Popup> &
  Pick<
    React.ComponentProps<typeof PopoverPrimitive.Positioner>,
    | "align"
    | "side"
    | "sideOffset"
    | "alignOffset"
    | "collisionPadding"
    | "anchor"
  >) => {
  const surface = useSurface();
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        side={side}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        anchor={anchor}
        style={{ zIndex: 50 + surface }}
      >
        <Elevated
          offset={2}
          render={
            <PopoverPrimitive.Popup
              data-slot="popover-content"
              className={cn(
                "bg-popover text-popover-foreground data-[open]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[open]:fade-in-0 data-[closed]:zoom-out-95 data-[open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--transform-origin) rounded-md border p-4 shadow-md outline-hidden",
                motionClasses.moderate,
                className
              )}
              {...props}
            />
          }
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
};

export { Popover, PopoverContent, PopoverTrigger };
