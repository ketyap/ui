"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SizeProvider } from "@/lib/size-context";

export const AccordionMultipleDemo = () => (
  <SizeProvider size="compact">
    <Accordion multiple defaultValue={["first"]}>
      <AccordionItem value="first">
        <AccordionTrigger>Multiple panels</AccordionTrigger>
        <AccordionContent>
          Base UI manages focus and disclosure state.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="second">
        <AccordionTrigger>Can I use the keyboard?</AccordionTrigger>
        <AccordionContent>
          Use the arrow keys to move and Enter or Space to toggle.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="disabled" disabled>
        <AccordionTrigger>Unavailable</AccordionTrigger>
        <AccordionContent>Disabled content</AccordionContent>
      </AccordionItem>
    </Accordion>
  </SizeProvider>
);
