"use client";

import * as React from "react";
import { endOfDay, format, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { buttonVariants } from "@/src/components/ui/button";
import { Calendar } from "@/src/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { cn } from "@/src/utils/tailwind";

type DatePickerProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  showTime?: boolean;
};

function clampDate(date: Date, minDate?: Date, maxDate?: Date) {
  if (minDate && date < minDate) {
    return minDate;
  }

  if (maxDate && date > maxDate) {
    return maxDate;
  }

  return date;
}

function toTimeValue(date: Date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  minDate,
  maxDate,
  showTime = false,
}: DatePickerProps) {
  const [internalDate, setInternalDate] = React.useState<Date>();
  const selectedDate = value ?? internalDate;

  const normalizedMinDate = minDate ? startOfDay(minDate) : undefined;
  const normalizedMaxDate = maxDate ? endOfDay(maxDate) : undefined;

  const disabledMatcher = React.useMemo(() => {
    const hasMinDate = normalizedMinDate instanceof Date;
    const hasMaxDate = normalizedMaxDate instanceof Date;

    if (hasMinDate === false && hasMaxDate === false) {
      return undefined;
    }

    return (date: Date) => {
      if (hasMinDate && normalizedMinDate instanceof Date && date < normalizedMinDate) {
        return true;
      }

      if (hasMaxDate && normalizedMaxDate instanceof Date && date > normalizedMaxDate) {
        return true;
      }

      return false;
    };
  }, [normalizedMinDate, normalizedMaxDate]);

  const emitDate = React.useCallback(
    (nextDate: Date | undefined) => {
      const boundedDate = nextDate
        ? clampDate(nextDate, minDate, maxDate)
        : undefined;

      setInternalDate(boundedDate);
      onChange?.(boundedDate);
    },
    [maxDate, minDate, onChange],
  );

  const handleDateChange = (date: Date | undefined) => {
    if (date == null) {
      emitDate(undefined);
      return;
    }

    const baseDate = selectedDate ?? new Date();
    const nextDate = new Date(date);

    if (showTime) {
      nextDate.setHours(baseDate.getHours(), baseDate.getMinutes(), 0, 0);
    } else {
      nextDate.setHours(0, 0, 0, 0);
    }

    emitDate(nextDate);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedDate == null) {
      return;
    }

    const [hoursRaw, minutesRaw] = event.target.value.split(":");
    const hours = Number(hoursRaw);
    const minutes = Number(minutesRaw);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return;
    }

    const nextDate = new Date(selectedDate);
    nextDate.setHours(hours, minutes, 0, 0);

    emitDate(nextDate);
  };

  const triggerLabel = selectedDate
    ? format(selectedDate, showTime ? "PPP p" : "PPP", { locale: ptBR })
    : placeholder;

  const timeValue = selectedDate ? toTimeValue(selectedDate) : "00:00";

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-11 w-full justify-start rounded-sm px-3 text-left text-sm font-normal focus-visible:border-ring focus-visible:ring-0",
          selectedDate == null && "text-muted-foreground",
        )}
      >
        <CalendarIcon className="mr-2 size-4 shrink-0" />
        <span className="truncate">{triggerLabel}</span>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateChange}
          locale={ptBR}
          disabled={disabledMatcher}
        />

        {showTime ? (
          <div className="border-t border-border p-3">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Time
            </label>
            <input
              type="time"
              className="h-9 w-full rounded-sm border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring"
              step={60}
              value={timeValue}
              onChange={handleTimeChange}
              disabled={selectedDate == null}
            />
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
