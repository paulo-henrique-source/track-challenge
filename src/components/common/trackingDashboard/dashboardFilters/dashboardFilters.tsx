"use client";

import { Search, SlidersHorizontal } from "lucide-react";

import { PackageTypesDropdown } from "@/components/common/packageTypesDropdown/packageTypesDropdown";
import { VehicleDropdown } from "@/components/common/vehicleDropdown/vehicleDropdown";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion/accordion";
import { Button } from "@/components/ui/button/button";
import { DatePicker } from "@/components/ui/datePicker/datePicker";
import { Label } from "@/components/ui/label/label";
import { useTranslate } from "@/hooks/useTranslate";
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
  const { t } = useTranslate();

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
            <SlidersHorizontal className="size-4 text-primary" />
            <span className="cursor-text">{t("filters.title")}</span>
          </div>
        </AccordionTrigger>

        <AccordionContent
          id={FILTERS_PANEL_ID}
          aria-labelledby={FILTERS_TRIGGER_ID}
        >
          <div className="dashboard-filters-grid pb-3">
            <div className="xl:col-span-2">
              <Label className="mb-2 block cursor-text">
                {t("filters.vehicle")}
              </Label>
              <VehicleDropdown
                triggerId="dashboard-vehicle-trigger"
                vehicles={vehicles}
                value={vehicleCode}
                onChange={onVehicleChange}
                disabled={isSessionReady === false}
              />
            </div>

            <div className="xl:col-span-2">
              <Label className="mb-2 block cursor-text">
                {t("filters.packageTypes")}
              </Label>
              <PackageTypesDropdown
                triggerId="dashboard-package-types-trigger"
                packageTypes={packageTypes}
                values={packageTypeCodes}
                onChange={onPackageTypesChange}
                disabled={isSessionReady === false}
              />
            </div>

            <div>
              <Label className="mb-2 block cursor-text">
                {t("filters.startDate")}
              </Label>
              <DatePicker
                triggerId="dashboard-start-date-trigger"
                value={startDate}
                onChange={onStartDateChange}
                placeholder={t("filters.startDatePlaceholder")}
                minDate={minStartDate}
                maxDate={maxStartDate}
              />
            </div>

            <div>
              <Label className="mb-2 block cursor-text">
                {t("filters.endDate")}
              </Label>
              <DatePicker
                triggerId="dashboard-end-date-trigger"
                value={endDate}
                onChange={onEndDateChange}
                placeholder={t("filters.endDatePlaceholder")}
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
              {historyPending ? t("filters.searching") : t("filters.search")}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="cursor-pointer h-11 rounded-sm px-5"
              onClick={onClear}
            >
              {t("filters.clear")}
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
