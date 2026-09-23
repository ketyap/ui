"use client";

import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { CircleIcon } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

import { dropdownClose, dropdownOpen } from "@/audio/core";
import { Elevated } from "@/components/ui/elevated";
import { FluidHoverArea } from "@/components/ui/fluid-hover-area";
import type { FeedbackType } from "@/hooks/use-feedback";
import { useFeedback } from "@/hooks/use-feedback";
import { Icon } from "@/lib/icon-context";
import { useShape } from "@/lib/shape-context";
import { useSize } from "@/lib/size-context";
import { useSurface } from "@/lib/surface-context";
import { cn } from "@/lib/utils";

const useMenuItemClass = () => {
  const size = useSize();
  return cn(
    "relative flex items-center cursor-default outline-none select-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none focus-visible:bg-accent focus-visible:ring-1 focus-visible:ring-ring",
    size.control,
    size.text,
    size.gap,
    size.iconClass,
    size.variant === "compact" ? "px-1.5" : "px-2",
    useShape()
  );
};
const popupClass =
  "w-72 max-w-[calc(100vw-2rem)] max-h-(--available-height) overflow-y-auto rounded-lg border border-border/60 p-1 shadow-md origin-(--transform-origin) transition-[opacity,transform] duration-(--motion-moderate) data-[ending-style]:duration-(--motion-exit-moderate) data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[ending-style]:scale-95 motion-reduce:transition-none";

const ContextMenu = ({
  onOpenChange,
  sounds = false,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Root> & {
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
          React.ComponentProps<typeof ContextMenuPrimitive.Root>["onOpenChange"]
        >
      >[1]
    ) => {
      onOpenChange?.(open, details);
      // Controlled roots only play after their prop reflects the new state.
      // Uncontrolled roots can play immediately once the request is accepted.
      if (!isControlled && !details.isCanceled) {
        playStateSound(open);
      }
    },
    [isControlled, onOpenChange, playStateSound]
  );

  if (!sounds) {
    return (
      <ContextMenuPrimitive.Root
        data-slot="context-menu"
        onOpenChange={onOpenChange}
        {...props}
      />
    );
  }

  return (
    <ContextMenuPrimitive.Root
      data-slot="context-menu"
      onOpenChange={handleOpenChange}
      {...props}
    />
  );
};

const ContextMenuPortal = ({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) => (
  <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
);

const ContextMenuTrigger = ({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) => (
  <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />
);

const ContextMenuContent = ({
  className,
  align = "start",
  side = "bottom",
  sideOffset = 4,
  alignOffset = 0,
  collisionPadding = 8,
  anchor,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Popup> &
  Pick<
    React.ComponentProps<typeof ContextMenuPrimitive.Positioner>,
    | "align"
    | "side"
    | "sideOffset"
    | "alignOffset"
    | "collisionPadding"
    | "anchor"
  >) => {
  const surface = useSurface();
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Positioner
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
            <ContextMenuPrimitive.Popup
              data-slot="context-menu-content"
              render={<FluidHoverArea itemSelector="[role^=menuitem]" />}
              className={cn(popupClass, className)}
              {...props}
            />
          }
        />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  );
};

const ContextMenuGroup = ({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Group>) => (
  <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
);

const ContextMenuItem = ({
  className,
  inset,
  variant = "default",
  onClick,
  sound,
  haptic,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
  sound?: FeedbackType;
  haptic?: boolean;
}) => {
  const play = useFeedback({ haptic, sound });
  const itemClass = useMenuItemClass();

  const handleClick: NonNullable<
    React.ComponentProps<typeof ContextMenuPrimitive.Item>["onClick"]
  > = (e) => {
    play();
    onClick?.(e);
  };

  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      onClick={handleClick}
      className={cn(
        "data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:ps-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        itemClass,
        className
      )}
      {...props}
    />
  );
};

const ContextMenuCheckboxItem = ({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>) => {
  const itemClass = useMenuItemClass();
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pe-2 ps-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        itemClass,
        "ps-8",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute start-2 flex size-3.5 items-center justify-center">
        <ContextMenuPrimitive.CheckboxItemIndicator>
          <Icon name="check" className="size-4" />
        </ContextMenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
};

const ContextMenuRadioGroup = ({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>) => (
  <ContextMenuPrimitive.RadioGroup
    data-slot="context-menu-radio-group"
    {...props}
  />
);

const ContextMenuRadioItem = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>) => {
  const itemClass = useMenuItemClass();
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pe-2 ps-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        itemClass,
        "ps-8",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute start-2 flex size-3.5 items-center justify-center">
        <ContextMenuPrimitive.RadioItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </ContextMenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
};

const ContextMenuLabel = ({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.GroupLabel> & {
  inset?: boolean;
}) => (
  <ContextMenuPrimitive.GroupLabel
    data-slot="context-menu-label"
    data-inset={inset}
    className={cn(
      "px-2 py-1.5 text-sm font-medium data-[inset]:ps-8",
      className
    )}
    {...props}
  />
);

const ContextMenuSeparator = ({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) => (
  <ContextMenuPrimitive.Separator
    data-slot="context-menu-separator"
    className={cn("bg-border -mx-1 my-1 h-px", className)}
    {...props}
  />
);

const ContextMenuShortcut = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    data-slot="context-menu-shortcut"
    className={cn(
      "text-muted-foreground ms-auto text-xs tracking-widest",
      className
    )}
    {...props}
  />
);

const ContextMenuSub = ({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubmenuRoot>) => (
  <ContextMenuPrimitive.SubmenuRoot data-slot="context-menu-sub" {...props} />
);

const ContextMenuSubTrigger = ({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubmenuTrigger> & {
  inset?: boolean;
}) => {
  const itemClass = useMenuItemClass();
  return (
    <ContextMenuPrimitive.SubmenuTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "data-[open]:bg-accent data-[open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:ps-8",
        itemClass,
        "ps-8",
        className
      )}
      {...props}
    >
      {children}
      <Icon name="chevron-right" className="ms-auto size-4 rtl:rotate-180" />
    </ContextMenuPrimitive.SubmenuTrigger>
  );
};

const ContextMenuSubContent = ({
  className,
  align = "start",
  side = "right",
  sideOffset = 4,
  alignOffset = 0,
  collisionPadding = 8,
  anchor,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Popup> &
  Pick<
    React.ComponentProps<typeof ContextMenuPrimitive.Positioner>,
    | "align"
    | "side"
    | "sideOffset"
    | "alignOffset"
    | "collisionPadding"
    | "anchor"
  >) => {
  const surface = useSurface();
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Positioner
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
            <ContextMenuPrimitive.Popup
              data-slot="context-menu-sub-content"
              render={<FluidHoverArea itemSelector="[role^=menuitem]" />}
              className={cn(popupClass, className)}
              {...props}
            />
          }
        />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  );
};

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
};
