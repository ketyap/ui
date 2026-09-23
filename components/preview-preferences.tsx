"use client";

import {
  Check,
  ChevronDown,
  ChevronRight,
  Copy01,
  Loading01,
  SearchSm,
  XClose,
} from "@untitledui/icons";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROUTES } from "@/constants/routes";
import { IconProvider } from "@/lib/icon-context";
import { ShapeProvider } from "@/lib/shape-context";
import type { ShapeVariant } from "@/lib/shape-context";
import { SizeProvider } from "@/lib/size-context";
import type { SizeVariant } from "@/lib/size-context";

type IconVariant = "lucide" | "untitledui";
interface Preferences {
  shape: ShapeVariant;
  size: SizeVariant;
  icons: IconVariant;
  setShape: (value: ShapeVariant) => void;
  setSize: (value: SizeVariant) => void;
  setIcons: (value: IconVariant) => void;
}

const PreferencesContext = createContext<Preferences | null>(null);
const untitledIcons = {
  check: Check,
  "chevron-down": ChevronDown,
  "chevron-right": ChevronRight,
  close: XClose,
  copy: Copy01,
  loading: Loading01,
  search: SearchSm,
};

export const PreviewPreferencesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [shape, setShape] = useState<ShapeVariant>("rounded");
  const [size, setSize] = useState<SizeVariant>("default");
  const [icons, setIcons] = useState<IconVariant>("untitledui");

  return (
    <PreferencesContext.Provider
      value={{ icons, setIcons, setShape, setSize, shape, size }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

const usePreferences = () => {
  const value = useContext(PreferencesContext);
  if (!value) {
    throw new Error("PreviewPreferencesProvider is required");
  }
  return value;
};

export const PreviewStyle = ({ children }: { children: ReactNode }) => {
  const { shape, size, icons } = usePreferences();
  return (
    <ShapeProvider shape={shape}>
      <SizeProvider size={size}>
        <IconProvider icons={icons === "untitledui" ? untitledIcons : {}}>
          {children}
        </IconProvider>
      </SizeProvider>
    </ShapeProvider>
  );
};

const PreferenceSelect = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) => (
  <div className="flex items-center justify-between gap-4">
    <span className="text-sm font-medium">{label}</span>
    <Select
      value={value}
      items={Object.fromEntries(
        options.map((option) => [option.value, option.label])
      )}
      onValueChange={(next) => next && onChange(next)}
    >
      <SelectTrigger aria-label={label} className="w-36">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export const PreviewPreferenceFields = () => {
  const { theme, setTheme } = useTheme();
  const { shape, size, icons, setShape, setSize, setIcons } = usePreferences();
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold">Make them yours</h2>
      <PreferenceSelect
        label="Theme"
        value={theme ?? "system"}
        onChange={setTheme}
        options={[
          { label: "System", value: "system" },
          { label: "Light", value: "light" },
          { label: "Dark", value: "dark" },
        ]}
      />
      <PreferenceSelect
        label="Radius"
        value={shape}
        onChange={(value) => setShape(value as ShapeVariant)}
        options={[
          { label: "Rounded", value: "rounded" },
          { label: "Pill", value: "pill" },
        ]}
      />
      <PreferenceSelect
        label="Size"
        value={size}
        onChange={(value) => setSize(value as SizeVariant)}
        options={[
          { label: "Default", value: "default" },
          { label: "Compact", value: "compact" },
        ]}
      />
      <PreferenceSelect
        label="Icons"
        value={icons}
        onChange={(value) => setIcons(value as IconVariant)}
        options={[
          { label: "Untitled UI", value: "untitledui" },
          { label: "Lucide", value: "lucide" },
        ]}
      />
      <p className="text-muted-foreground text-xs">
        Changes check, arrow, copy, search, close, and loading icons in
        supported previews.
      </p>
    </div>
  );
};

export const PreviewHeaderControls = () => {
  const pathname = usePathname();
  if (!pathname.startsWith(ROUTES.DOCS_COMPONENTS)) {
    return null;
  }
  return (
    <div className="hidden items-center gap-1 lg:flex">
      {pathname !== ROUTES.DOCS_COMPONENTS && (
        <Button
          variant="ghost"
          size="sm"
          render={
            <Link href={ROUTES.DOCS_COMPONENTS}>
              <ArrowLeft />
              All previews
            </Link>
          }
        />
      )}
      <Popover>
        <PopoverTrigger
          render={
            <Button variant="outline" size="sm">
              <SlidersHorizontal />
              Customize
            </Button>
          }
        />
        <PopoverContent align="end" className="w-72 p-4">
          <PreviewPreferenceFields />
        </PopoverContent>
      </Popover>
    </div>
  );
};
