"use client";

import * as React from "react";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/utils/tailwind";

function Accordion({
  className,
  ...props
}: AccordionPrimitive.Root.Props<string>) {
  return (
    <AccordionPrimitive.Root
      data-slot='accordion'
      className={cn("w-full", className)}
      {...props}
    />
  );
}

function AccordionItem({
  className,
  ...props
}: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot='accordion-item'
      className={cn(
        "rounded-sm border border-border bg-[color:var(--surface-card)]",
        className,
      )}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header data-slot='accordion-header'>
      <AccordionPrimitive.Trigger
        data-slot='accordion-trigger'
        className={cn(
          "group/accordion-trigger flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-[color:var(--text-strong)] transition hover:bg-muted/40",
          className,
        )}
        {...props}>
        {children}
        <ChevronDown className='size-4 text-muted-foreground transition group-data-[panel-open]/accordion-trigger:rotate-180' />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot='accordion-content'
      className={cn(
        "overflow-visible border-t border-border/70 px-4 py-4 text-sm",
        className,
      )}
      {...props}>
      {children}
    </AccordionPrimitive.Panel>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
