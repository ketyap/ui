"use client";

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";

import { FluidHoverArea } from "@/components/ui/fluid-hover-area";
import type { FeedbackType } from "@/hooks/use-feedback";
import { useFeedback } from "@/hooks/use-feedback";
import { Icon } from "@/lib/icon-context";
import { useShape } from "@/lib/shape-context";
import { useSize } from "@/lib/size-context";
import { cn } from "@/lib/utils";

const Accordion = ({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) => (
  <AccordionPrimitive.Root
    data-slot="accordion"
    render={<FluidHoverArea itemSelector="[data-slot=accordion-trigger]" />}
    {...props}
  />
);

const AccordionItem = ({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) => (
  <AccordionPrimitive.Item
    data-slot="accordion-item"
    className={cn(
      "relative border-b border-border/60 last:border-b-0",
      className
    )}
    {...props}
  />
);

const AccordionTrigger = ({
  className,
  children,
  onClick,
  sound,
  haptic,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  sound?: FeedbackType;
  haptic?: boolean;
}) => {
  const play = useFeedback({ haptic, sound });
  const sizes = useSize();
  const shape = useShape();

  const handleClick: NonNullable<
    React.ComponentProps<typeof AccordionPrimitive.Trigger>["onClick"]
  > = (e) => {
    play();
    onClick?.(e);
  };

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "relative flex w-full items-center justify-between text-left outline-none transition-colors duration-(--motion-fast) focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 [&[data-panel-open]>svg]:rotate-180",
          sizes.control,
          sizes.px,
          sizes.gap,
          sizes.text,
          shape,
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
        <Icon
          name="chevron-down"
          className="shrink-0 transition-transform duration-(--motion-moderate) motion-reduce:transition-none"
          width={sizes.icon}
          height={sizes.icon}
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
};

const AccordionContent = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Panel>) => (
  <AccordionPrimitive.Panel
    data-slot="accordion-content"
    className="h-(--accordion-panel-height) overflow-hidden text-sm transition-[height] duration-(--motion-moderate) data-[ending-style]:duration-(--motion-exit-moderate) data-[starting-style]:h-0 data-[ending-style]:h-0 motion-reduce:transition-none"
    {...props}
  >
    <div
      className={cn(
        "px-3 pt-1 pb-3 text-[13px] text-muted-foreground",
        className
      )}
    >
      {children}
    </div>
  </AccordionPrimitive.Panel>
);

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
