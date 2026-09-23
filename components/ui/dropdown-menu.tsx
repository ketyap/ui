"use client";

import { Menu as DropdownMenuPrimitive } from "@base-ui/react/menu";
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

const DropdownMenu = ({
  onOpenChange,
  sounds = false,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root> & {
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
          React.ComponentProps<
            typeof DropdownMenuPrimitive.Root
          >["onOpenChange"]
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
      <DropdownMenuPrimitive.Root
        data-slot="dropdown-menu"
        onOpenChange={onOpenChange}
        {...props}
      />
    );
  }

  return (
    <DropdownMenuPrimitive.Root
      data-slot="dropdown-menu"
      onOpenChange={handleOpenChange}
      {...props}
    />
  );
};

const DropdownMenuPortal = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) => (
  <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
);

const DropdownMenuTrigger = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) => (
  <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
);

const DropdownMenuContent = ({
  className,
  align = "start",
  side = "bottom",
  sideOffset = 6,
  alignOffset = 0,
  collisionPadding = 8,
  anchor,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Popup> &
  Pick<
    React.ComponentProps<typeof DropdownMenuPrimitive.Positioner>,
    | "align"
    | "side"
    | "sideOffset"
    | "alignOffset"
    | "collisionPadding"
    | "anchor"
  >) => {
  const surface = useSurface();
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Positioner
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
            <DropdownMenuPrimitive.Popup
              data-slot="dropdown-menu-content"
              render={<FluidHoverArea itemSelector="[role^=menuitem]" />}
              className={cn(popupClass, className)}
              {...props}
            />
          }
        />
      </DropdownMenuPrimitive.Positioner>
    </DropdownMenuPrimitive.Portal>
  );
};

const DropdownMenuGroup = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) => (
  <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
);

const DropdownMenuItem = ({
  className,
  inset,
  variant = "default",
  onClick,
  sound,
  haptic,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
  sound?: FeedbackType;
  haptic?: boolean;
}) => {
  const play = useFeedback({ haptic, sound });
  const itemClass = useMenuItemClass();

  const handleClick: NonNullable<
    React.ComponentProps<typeof DropdownMenuPrimitive.Item>["onClick"]
  > = (e) => {
    play();
    onClick?.(e);
  };

  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      onClick={handleClick}
      className={cn(
        "data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        itemClass,
        className
      )}
      {...props}
    />
  );
};

const DropdownMenuCheckboxItem = ({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) => {
  const itemClass = useMenuItemClass();
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        itemClass,
        "pl-8",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.CheckboxItemIndicator>
          <Icon name="check" className="size-4" />
        </DropdownMenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
};

const DropdownMenuRadioGroup = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) => (
  <DropdownMenuPrimitive.RadioGroup
    data-slot="dropdown-menu-radio-group"
    {...props}
  />
);

const DropdownMenuRadioItem = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) => {
  const itemClass = useMenuItemClass();
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        itemClass,
        "pl-8",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.RadioItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </DropdownMenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
};

const DropdownMenuLabel = ({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.GroupLabel> & {
  inset?: boolean;
}) => (
  <DropdownMenuPrimitive.GroupLabel
    data-slot="dropdown-menu-label"
    data-inset={inset}
    className={cn(
      "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
      className
    )}
    {...props}
  />
);

const DropdownMenuSeparator = ({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) => (
  <DropdownMenuPrimitive.Separator
    data-slot="dropdown-menu-separator"
    className={cn("bg-border -mx-1 my-1 h-px", className)}
    {...props}
  />
);

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    data-slot="dropdown-menu-shortcut"
    className={cn(
      "text-muted-foreground ml-auto text-xs tracking-widest",
      className
    )}
    {...props}
  />
);

const DropdownMenuSub = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubmenuRoot>) => (
  <DropdownMenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />
);

const DropdownMenuSubTrigger = ({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubmenuTrigger> & {
  inset?: boolean;
}) => {
  const itemClass = useMenuItemClass();
  return (
    <DropdownMenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "data-[open]:bg-accent data-[open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8",
        itemClass,
        "pl-8",
        className
      )}
      {...props}
    >
      {children}
      <Icon name="chevron-right" className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubmenuTrigger>
  );
};

const DropdownMenuSubContent = ({
  className,
  align = "start",
  side = "right",
  sideOffset = 6,
  alignOffset = 0,
  collisionPadding = 8,
  anchor,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Popup> &
  Pick<
    React.ComponentProps<typeof DropdownMenuPrimitive.Positioner>,
    | "align"
    | "side"
    | "sideOffset"
    | "alignOffset"
    | "collisionPadding"
    | "anchor"
  >) => {
  const surface = useSurface();
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Positioner
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
            <DropdownMenuPrimitive.Popup
              data-slot="dropdown-menu-sub-content"
              render={<FluidHoverArea itemSelector="[role^=menuitem]" />}
              className={cn(popupClass, className)}
              {...props}
            />
          }
        />
      </DropdownMenuPrimitive.Positioner>
    </DropdownMenuPrimitive.Portal>
  );
};

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
