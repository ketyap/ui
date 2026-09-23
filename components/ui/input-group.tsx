"use client";

import { Field } from "@base-ui/react/field";
import type { ComponentProps, ReactNode } from "react";

import { Input } from "@/components/ui/input";
import type { IconComponent } from "@/lib/icon-context";
import { useShape } from "@/lib/shape-context";
import { SizeProvider, useSizeVariant, useSize } from "@/lib/size-context";
import type { SizeVariant } from "@/lib/size-context";
import { cn } from "@/lib/utils";

export const InputGroup = ({
  size,
  className,
  ...props
}: ComponentProps<"div"> & { size?: SizeVariant }) => {
  const density = useSizeVariant(size);
  return (
    <SizeProvider size={density}>
      <div
        className={cn("flex w-72 max-w-full flex-col gap-3", className)}
        {...props}
      />
    </SizeProvider>
  );
};

export interface InputFieldProps extends Omit<
  ComponentProps<typeof Input>,
  "prefix"
> {
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  addon?: ReactNode;
  icon?: IconComponent;
  labelHidden?: boolean;
}

export const InputField = ({
  label,
  description,
  error,
  prefix,
  suffix,
  addon,
  icon: FieldIcon,
  labelHidden,
  className,
  disabled,
  density,
  shape,
  ...props
}: InputFieldProps) => {
  const sizes = useSize(density);
  const radius = useShape(shape);
  return (
    <Field.Root
      disabled={disabled}
      invalid={!!error}
      className={cn("flex flex-col gap-1", sizes.text, className)}
    >
      <Field.Label
        className={cn(
          sizes.px,
          "text-muted-foreground",
          labelHidden && "sr-only"
        )}
      >
        {label}
      </Field.Label>
      <div
        className={cn(
          "flex items-center overflow-hidden border border-input transition-[border-color,box-shadow] duration-(--motion-fast) focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30 has-[[aria-invalid=true]]:border-destructive has-[:disabled]:opacity-50",
          radius
        )}
      >
        {(prefix || FieldIcon) && (
          <span
            className={cn(
              "flex shrink-0 items-center text-muted-foreground",
              sizes.px,
              "pe-0",
              sizes.gap,
              sizes.iconClass
            )}
          >
            {FieldIcon && <FieldIcon aria-hidden="true" />}
            {prefix}
          </span>
        )}
        <Input
          density={density}
          shape={shape}
          className={cn(
            "rounded-none border-0 shadow-none focus-visible:ring-0",
            (prefix || FieldIcon) &&
              (sizes.variant === "compact" ? "ps-1" : "ps-2"),
            suffix && (sizes.variant === "compact" ? "pe-1" : "pe-2")
          )}
          {...props}
        />
        {suffix && (
          <span
            className={cn("shrink-0 text-muted-foreground", sizes.px, "ps-0")}
          >
            {suffix}
          </span>
        )}
        {addon && (
          <span
            className={cn(
              "flex shrink-0 items-center self-stretch border-l border-input bg-muted",
              sizes.px
            )}
          >
            {addon}
          </span>
        )}
      </div>
      {description && (
        <Field.Description
          className={cn(sizes.px, "text-xs text-muted-foreground")}
        >
          {description}
        </Field.Description>
      )}
      {error && (
        <Field.Error match className={cn(sizes.px, "text-xs text-destructive")}>
          {error}
        </Field.Error>
      )}
    </Field.Root>
  );
};
