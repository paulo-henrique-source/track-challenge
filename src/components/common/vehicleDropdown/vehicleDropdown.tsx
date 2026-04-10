"use client";

import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { VehicleRecord } from "@/types/session";
import { cn } from "@/utils/tailwind";

type VehicleDropdownProps = {
  vehicles: VehicleRecord[];
  value: string;
  onChange: (vehicleCode: string) => void;
  disabled?: boolean;
};

export function VehicleDropdown({
  vehicles,
  value,
  onChange,
  disabled = false,
}: VehicleDropdownProps) {
  const [open, setOpen] = useState(false);

  const selectedVehicleLabel = useMemo(() => {
    const selectedVehicle = vehicles.find((vehicle) => vehicle.veiccodigo === value);

    return selectedVehicle?.veicnome ?? "Select a vehicle";
  }, [value, vehicles]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-sm border border-border bg-background px-3 text-sm font-medium text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-60",
          !value && "text-muted-foreground",
        )}>
        <span className='truncate'>{selectedVehicleLabel}</span>
        <ChevronDown className='size-4 shrink-0 text-muted-foreground' />
      </PopoverTrigger>

      <PopoverContent className='max-h-72 w-(--anchor-width) gap-1 overflow-y-auto bg-popover p-1'>
        {vehicles.length === 0 ? (
          <p className='px-2 py-1 text-sm text-muted-foreground'>
            No vehicles available
          </p>
        ) : (
          vehicles.map((vehicle) => {
            const isSelected = vehicle.veiccodigo === value;

            return (
              <Button
                key={vehicle.veiccodigo}
                type='button'
                variant={isSelected ? "secondary" : "ghost"}
                className='h-9 w-full justify-start truncate px-2.5'
                onClick={() => {
                  onChange(vehicle.veiccodigo);
                  setOpen(false);
                }}>
                {vehicle.veicnome}
              </Button>
            );
          })
        )}
      </PopoverContent>
    </Popover>
  );
}
