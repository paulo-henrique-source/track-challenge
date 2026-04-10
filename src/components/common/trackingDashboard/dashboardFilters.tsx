import { Search, ShieldCheck } from "lucide-react";

import { PackageTypesDropdown } from "@/src/components/common/packageTypesDropdown";
import { VehicleDropdown } from "@/src/components/common/vehicleDropdown";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { Button } from "@/src/components/ui/button";
import { DatePicker } from "@/src/components/ui/datePicker";
import { Label } from "@/src/components/ui/label";
import type { PackageTypeRecord, VehicleRecord } from "@/src/types/session";

type DashboardFiltersProps = {
  vehicles: VehicleRecord[];
  packageTypes: PackageTypeRecord[];
  vehicleCode: string;
  packageTypeCodes: string[];
  startDate: Date | undefined;
  endDate: Date | undefined;
  minStartDate: Date | undefined;
  maxStartDate: Date | undefined;
  minEndDate: Date | undefined;
  maxEndDate: Date;
  isSessionReady: boolean;
  historyPending: boolean;
  onVehicleChange: (value: string) => void;
  onPackageTypesChange: (value: string[]) => void;
  onStartDateChange: (value: Date | undefined) => void;
  onEndDateChange: (value: Date | undefined) => void;
  onSearch: () => void;
  onClear: () => void;
};

export function DashboardFilters({
  vehicles,
  packageTypes,
  vehicleCode,
  packageTypeCodes,
  startDate,
  endDate,
  minStartDate,
  maxStartDate,
  minEndDate,
  maxEndDate,
  isSessionReady,
  historyPending,
  onVehicleChange,
  onPackageTypesChange,
  onStartDateChange,
  onEndDateChange,
  onSearch,
  onClear,
}: DashboardFiltersProps) {
  return (
    <Accordion defaultValue={["filters"]}>
      <AccordionItem value="filters">
        <AccordionTrigger className="cursor-pointer">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" />
            <span>Search Filters</span>
          </div>
        </AccordionTrigger>

        <AccordionContent>
          <div className="dashboard-filters-grid pb-3">
            <div className="xl:col-span-2">
              <Label className="mb-2 block">Vehicle</Label>
              <VehicleDropdown
                vehicles={vehicles}
                value={vehicleCode}
                onChange={onVehicleChange}
                disabled={isSessionReady === false}
              />
            </div>

            <div className="xl:col-span-2">
              <Label className="mb-2 block">Package types</Label>
              <PackageTypesDropdown
                packageTypes={packageTypes}
                values={packageTypeCodes}
                onChange={onPackageTypesChange}
                disabled={isSessionReady === false}
              />
            </div>

            <div>
              <Label className="mb-2 block">Start date</Label>
              <DatePicker
                value={startDate}
                onChange={onStartDateChange}
                placeholder="Select start date"
                minDate={minStartDate}
                maxDate={maxStartDate}
              />
            </div>

            <div>
              <Label className="mb-2 block">End date</Label>
              <DatePicker
                value={endDate}
                onChange={onEndDateChange}
                placeholder="Select end date"
                minDate={minEndDate}
                maxDate={maxEndDate}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              type="button"
              size="lg"
              className="h-11 rounded-sm px-6"
              disabled={historyPending || isSessionReady === false}
              onClick={onSearch}
            >
              <Search className="size-4" />
              {historyPending ? "Searching..." : "Search"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="h-11 rounded-sm px-5"
              onClick={onClear}
            >
              Clear filters
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
