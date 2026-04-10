"use client";

import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils/tailwind";

type DatePickerProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
};

export function DatePicker({
  value,
  onChange,
  placeholder = "Selecione uma data",
}: DatePickerProps) {
  const [internalDate, setInternalDate] = React.useState<Date>();
  const selectedDate = value ?? internalDate;

  const handleDateChange = (date: Date | undefined) => {
    setInternalDate(date);
    onChange?.(date);
  };

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-full justify-start text-left font-normal",
          !selectedDate && "text-muted-foreground",
        )}>
        <CalendarIcon className='mr-2 size-4' />
        {selectedDate ? (
          format(selectedDate, "PPP", { locale: ptBR })
        ) : (
          <span>{placeholder}</span>
        )}
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          selected={selectedDate}
          onSelect={handleDateChange}
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  );
}
