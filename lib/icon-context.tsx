"use client";

import {
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  LoaderCircle,
  Search,
  X,
} from "lucide-react";
import { createContext, useContext, useMemo } from "react";
import type { ComponentType, ReactNode, SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
  strokeWidth?: number;
};
export type IconComponent = ComponentType<IconProps>;
export const defaultIcons = {
  check: Check,
  "chevron-down": ChevronDown,
  "chevron-right": ChevronRight,
  close: X,
  copy: Copy,
  loading: LoaderCircle,
  search: Search,
} satisfies Record<string, IconComponent>;
export type IconName = keyof typeof defaultIcons;
const IconContext =
  createContext<Record<IconName, IconComponent>>(defaultIcons);
export const IconProvider = ({
  icons,
  children,
}: {
  icons: Partial<Record<IconName, IconComponent>>;
  children: ReactNode;
}) => {
  const parent = useContext(IconContext);
  const value = useMemo(() => ({ ...parent, ...icons }), [parent, icons]);
  return <IconContext.Provider value={value}>{children}</IconContext.Provider>;
};
export const Icon = ({ name, ...props }: IconProps & { name: IconName }) => {
  const Component = useContext(IconContext)[name];
  return <Component aria-hidden="true" focusable="false" {...props} />;
};
