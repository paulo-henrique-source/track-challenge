"use client";

import { Check, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

import { useTranslate } from "@/hooks/useTranslate";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { PackageTypeRecord } from "@/types/session";
import { cn } from "@/utils/tailwind";

type PackageTypesDropdownProps = {
  packageTypes: PackageTypeRecord[];
  values: string[];
  onChange: (packageTypeCodes: string[]) => void;
  disabled?: boolean;
  triggerId?: string;
};

export function PackageTypesDropdown({
  packageTypes,
  values,
  onChange,
  disabled = false,
  triggerId,
}: PackageTypesDropdownProps) {
  const { t } = useTranslate();
  const [open, setOpen] = useState(false);

  const label = useMemo(() => {
    if (values.length === 0) {
      return t("dropdowns.packageTypes.all");
    }

    const selectedLabels = packageTypes
      .filter((packageType) => values.includes(packageType.pcttcodigo))
      .map((packageType) => packageType.pcttnomeresumido);

    if (selectedLabels.length <= 3) {
      return selectedLabels.join(", ");
    }

    return t("dropdowns.packageTypes.selected", {
      count: selectedLabels.length,
    });
  }, [packageTypes, t, values]);

  const toggleValue = (code: string) => {
    if (values.includes(code)) {
      onChange(values.filter((value) => value !== code));
      return;
    }

    onChange([...values, code]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={triggerId}
        disabled={disabled}
        className={cn(
          "flex h-11 w-full cursor-pointer items-center justify-between rounded-sm border border-border bg-background px-3 text-left text-sm font-medium text-foreground outline-none transition hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-0 aria-expanded:bg-muted aria-expanded:text-foreground disabled:cursor-not-allowed disabled:opacity-60 dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
          values.length === 0 && "text-muted-foreground",
        )}>
        <span className='truncate cursor-text'>{label}</span>
        <ChevronDown className='size-4 shrink-0 text-muted-foreground' />
      </PopoverTrigger>

      <PopoverContent className='max-h-72 w-(--anchor-width) gap-1 overflow-y-auto bg-popover p-1'>
        {packageTypes.length === 0 ? (
          <p className='px-2 py-1 text-sm text-muted-foreground'>
            {t("dropdowns.packageTypes.empty")}
          </p>
        ) : (
          packageTypes.map((packageType) => {
            const isSelected = values.includes(packageType.pcttcodigo);

            return (
              <button
                key={packageType.pcttcodigo}
                type='button'
                className={cn(
                  "flex h-9 w-full cursor-pointer items-center gap-2 rounded-sm px-2.5 text-left text-sm transition",
                  isSelected
                    ? "bg-secondary text-secondary-foreground"
                    : "hover:bg-muted",
                )}
                onClick={() => toggleValue(packageType.pcttcodigo)}>
                <span
                  className={cn(
                    "flex size-4 items-center justify-center rounded-sm border border-border",
                    isSelected &&
                      "border-primary bg-primary text-primary-foreground",
                  )}>
                  {isSelected ? <Check className='size-3' /> : null}
                </span>
                <span className='truncate cursor-text'>{packageType.pcttnomeresumido}</span>
              </button>
            );
          })
        )}
      </PopoverContent>
    </Popover>
  );
}
