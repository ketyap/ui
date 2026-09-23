"use client";

import { Autocomplete } from "@base-ui/react/autocomplete";
import { SearchIcon } from "lucide-react";
import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ComponentProps, ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Entry {
  value: string;
  keywords?: string[];
  children?: ReactNode;
}
type Filter = (value: string, search: string, keywords?: string[]) => number;
const defaultFilter: Filter = (value, search, keywords) =>
  `${value} ${keywords?.join(" ") ?? ""}`
    .toLowerCase()
    .includes(search.toLowerCase())
    ? 1
    : 0;
const SearchContext = createContext({ filter: defaultFilter, search: "" });
const collect = (children: ReactNode): Entry[] =>
  Children.toArray(children).flatMap((child) => {
    if (!isValidElement<Entry>(child)) {
      return [];
    }
    if (typeof child.props.value === "string") {
      return [child.props];
    }
    return collect(child.props.children);
  });
const Command = ({
  className,
  children,
  filter = defaultFilter,
  onItemHighlighted,
  ...props
}: ComponentProps<"div"> & {
  filter?: Filter;
  onItemHighlighted?: (value: string | undefined) => void;
}) => {
  const [search, setSearch] = useState("");
  const entries = useMemo(() => collect(children), [children]);
  const matches = entries
    .filter((item) => filter(item.value, search, item.keywords) > 0)
    .map((item) => item.value);
  return (
    <SearchContext.Provider value={{ filter, search }}>
      <Autocomplete.Root
        inline
        open
        autoHighlight="always"
        keepHighlight
        value={search}
        onValueChange={setSearch}
        items={matches}
        filter={null}
        onItemHighlighted={onItemHighlighted}
      >
        <div
          data-slot="command"
          className={cn(
            "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </Autocomplete.Root>
    </SearchContext.Provider>
  );
};
const CommandDialog = ({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = true,
  ...props
}: Omit<ComponentProps<typeof Dialog>, "children"> & {
  children?: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
}) => (
  <Dialog {...props}>
    <DialogContent
      className={cn("overflow-hidden p-0", className)}
      showCloseButton={showCloseButton}
    >
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <Command>{children}</Command>
    </DialogContent>
  </Dialog>
);
const CommandInput = ({
  className,
  ...props
}: ComponentProps<typeof Autocomplete.Input>) => (
  <div
    data-slot="command-input-wrapper"
    className="flex h-9 items-center gap-2 border-b px-3"
  >
    <SearchIcon className="size-4 shrink-0 opacity-50" />
    <Autocomplete.Input
      aria-label="Search commands"
      data-slot="command-input"
      className={cn(
        "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
);
const CommandList = ({
  className,
  ...props
}: ComponentProps<typeof Autocomplete.List>) => (
  <Autocomplete.List
    data-slot="command-list"
    className={cn(
      "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto",
      className
    )}
    {...props}
  />
);
const CommandEmpty = ({
  className,
  ...props
}: ComponentProps<typeof Autocomplete.Empty>) => (
  <Autocomplete.Empty
    data-slot="command-empty"
    className={cn("py-6 text-center text-sm empty:p-0", className)}
    {...props}
  />
);
const CommandGroup = ({
  className,
  heading,
  children,
  ...props
}: ComponentProps<typeof Autocomplete.Group> & { heading?: ReactNode }) => {
  const { search, filter } = useContext(SearchContext);
  if (
    !collect(children).some(
      (item) => filter(item.value, search, item.keywords) > 0
    )
  ) {
    return null;
  }
  return (
    <Autocomplete.Group
      data-slot="command-group"
      className={cn("text-foreground overflow-hidden p-1", className)}
      {...props}
    >
      {heading && (
        <Autocomplete.GroupLabel
          data-slot="command-group-heading"
          className="text-muted-foreground px-2 py-1.5 text-xs font-medium"
        >
          {heading}
        </Autocomplete.GroupLabel>
      )}
      {children}
    </Autocomplete.Group>
  );
};
const CommandSeparator = ({
  className,
  ...props
}: ComponentProps<typeof Autocomplete.Separator>) => (
  <Autocomplete.Separator
    data-slot="command-separator"
    className={cn("bg-border -mx-1 h-px", className)}
    {...props}
  />
);
const CommandItem = ({
  className,
  value,
  keywords,
  onSelect,
  onClick,
  ...props
}: Omit<ComponentProps<typeof Autocomplete.Item>, "onSelect" | "value"> & {
  value: string;
  keywords?: string[];
  onSelect?: (value: string) => void;
}) => {
  const { search, filter } = useContext(SearchContext);
  if (filter(value, search, keywords) <= 0) {
    return null;
  }
  return (
    <Autocomplete.Item
      data-slot="command-item"
      value={value}
      className={cn(
        "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          onSelect?.(value);
        }
      }}
      {...props}
    />
  );
};
const CommandShortcut = ({ className, ...props }: ComponentProps<"span">) => (
  <span
    data-slot="command-shortcut"
    className={cn(
      "text-muted-foreground ml-auto text-xs tracking-widest",
      className
    )}
    {...props}
  />
);
export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};
