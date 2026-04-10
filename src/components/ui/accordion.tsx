"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/utils/tailwind";

type AccordionContextValue = {
  openValues: string[];
  toggleItem: (value: string) => void;
};

type AccordionItemContextValue = {
  value: string;
  triggerId: string;
  panelId: string;
};

const AccordionContext = React.createContext<AccordionContextValue | null>(null);
const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(
  null,
);

function useAccordionContext() {
  const context = React.useContext(AccordionContext);

  if (context == null) {
    throw new Error("Accordion components must be used inside <Accordion>");
  }

  return context;
}

function useAccordionItemContext() {
  const context = React.useContext(AccordionItemContext);

  if (context == null) {
    throw new Error(
      "AccordionTrigger and AccordionContent must be inside <AccordionItem>",
    );
  }

  return context;
}

type AccordionProps = React.ComponentProps<"div"> & {
  defaultValue?: string[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
};

function Accordion({
  className,
  defaultValue = [],
  value,
  onValueChange,
  ...props
}: AccordionProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);

  const openValues = value ?? uncontrolledValue;

  const toggleItem = React.useCallback(
    (itemValue: string) => {
      const nextOpenValues = openValues.includes(itemValue)
        ? openValues.filter((current) => current !== itemValue)
        : [...openValues, itemValue];

      if (value == null) {
        setUncontrolledValue(nextOpenValues);
      }

      onValueChange?.(nextOpenValues);
    },
    [onValueChange, openValues, value],
  );

  return (
    <AccordionContext.Provider value={{ openValues, toggleItem }}>
      <div
        data-slot="accordion"
        className={cn("w-full", className)}
        role="region"
        {...props}
      />
    </AccordionContext.Provider>
  );
}

type AccordionItemProps = React.ComponentProps<"div"> & {
  value: string;
};

function AccordionItem({ className, value, ...props }: AccordionItemProps) {
  const sanitizedValue = React.useMemo(() => {
    return value.replace(/[^a-zA-Z0-9_-]/g, "-");
  }, [value]);

  const itemContextValue = React.useMemo<AccordionItemContextValue>(() => {
    return {
      value,
      triggerId: `accordion-trigger-${sanitizedValue}`,
      panelId: `accordion-panel-${sanitizedValue}`,
    };
  }, [sanitizedValue, value]);

  return (
    <AccordionItemContext.Provider value={itemContextValue}>
      <div
        data-slot="accordion-item"
        className={cn(
          "rounded-sm border border-border bg-[color:var(--surface-card)] transition-colors duration-300 hover:border-[color:var(--brand)]",
          className,
        )}
        {...props}
      />
    </AccordionItemContext.Provider>
  );
}

type AccordionTriggerProps = React.ComponentProps<"button">;

function AccordionTrigger({
  className,
  children,
  onClick,
  id,
  "aria-controls": ariaControls,
  ...props
}: AccordionTriggerProps) {
  const { openValues, toggleItem } = useAccordionContext();
  const { value, triggerId, panelId } = useAccordionItemContext();

  const isOpen = openValues.includes(value);
  const resolvedTriggerId = id ?? triggerId;
  const resolvedPanelId = ariaControls ?? panelId;

  return (
    <h3 data-slot="accordion-header">
      <button
        type="button"
        data-slot="accordion-trigger"
        id={resolvedTriggerId}
        aria-controls={resolvedPanelId}
        aria-expanded={isOpen}
        onClick={(event) => {
          onClick?.(event);

          if (event.defaultPrevented) {
            return;
          }

          toggleItem(value);
        }}
        className={cn(
          "group/accordion-trigger flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-[color:var(--text-strong)] transition hover:bg-muted/40",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition",
            isOpen && "rotate-180",
          )}
        />
      </button>
    </h3>
  );
}

type AccordionContentProps = React.ComponentProps<"div">;

function AccordionContent({
  className,
  children,
  id,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: AccordionContentProps) {
  const { openValues } = useAccordionContext();
  const { value, triggerId, panelId } = useAccordionItemContext();

  const isOpen = openValues.includes(value);
  const resolvedPanelId = id ?? panelId;
  const resolvedTriggerId = ariaLabelledBy ?? triggerId;

  return (
    <div
      data-slot="accordion-content"
      id={resolvedPanelId}
      aria-labelledby={resolvedTriggerId}
      role="region"
      hidden={!isOpen}
      className={cn(
        "overflow-visible border-t border-border/70 px-4 py-4 text-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
