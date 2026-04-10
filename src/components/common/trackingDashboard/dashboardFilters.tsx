import { Search, ShieldCheck } from "lucide-react";

import { PackageTypesDropdown } from "@/components/common/packageTypesDropdown/packageTypesDropdown";
import { VehicleDropdown } from "@/components/common/vehicleDropdown/vehicleDropdown";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datePicker";
import { Label } from "@/components/ui/label";
import type { PackageTypeRecord, VehicleRecord } from "@/types/session";

const FILTERS_TRIGGER_ID = "dashboard-filters-trigger";
const FILTERS_PANEL_ID = "dashboard-filters-panel";

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
    <Accordion
      defaultValue={["filters"]}
      className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500"
    >
      <AccordionItem value="filters">
        <AccordionTrigger
          id={FILTERS_TRIGGER_ID}
          aria-controls={FILTERS_PANEL_ID}
          className="cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" />
            <span className="cursor-text">Search Filters</span>
          </div>
        </AccordionTrigger>

        <AccordionContent
          id={FILTERS_PANEL_ID}
          aria-labelledby={FILTERS_TRIGGER_ID}
        >
          <div className="dashboard-filters-grid pb-3">
            <div className="xl:col-span-2">
              <Label className="mb-2 block cursor-text">Vehicle</Label>
              <VehicleDropdown
                triggerId="dashboard-vehicle-trigger"
                vehicles={vehicles}
                value={vehicleCode}
                onChange={onVehicleChange}
                disabled={isSessionReady === false}
              />
            </div>

            <div className="xl:col-span-2">
              <Label className="mb-2 block cursor-text">Package types</Label>
              <PackageTypesDropdown
                triggerId="dashboard-package-types-trigger"
                packageTypes={packageTypes}
                values={packageTypeCodes}
                onChange={onPackageTypesChange}
                disabled={isSessionReady === false}
              />
            </div>

            <div>
              <Label className="mb-2 block cursor-text">Start date</Label>
              <DatePicker
                triggerId="dashboard-start-date-trigger"
                value={startDate}
                onChange={onStartDateChange}
                placeholder="Select start date"
                minDate={minStartDate}
                maxDate={maxStartDate}
              />
            </div>

            <div>
              <Label className="mb-2 block cursor-text">End date</Label>
              <DatePicker
                triggerId="dashboard-end-date-trigger"
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
              className="cursor-pointer h-11 rounded-sm px-6"
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
              className="cursor-pointer h-11 rounded-sm px-5"
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
