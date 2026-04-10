"use client";

import {
  DashboardFilters,
  DashboardHeader,
  DashboardKpiGrid,
} from "@/src/components/common/trackingDashboard/index";
import { useTrackingDashboard } from "@/src/hooks/useTrackingDashboard";

export function TrackingDashboard() {
  const {
    vehicles,
    packageTypes,
    isSessionReady,
    onlineVehiclesCount,
    historyRecordsCount,
    historyPending,
    vehicleCode,
    packageTypeCodes,
    startDate,
    endDate,
    minStartDate,
    maxStartDate,
    minEndDate,
    maxEndDate,
    setVehicleCode,
    setPackageTypeCodes,
    setStartDate,
    setEndDate,
    submitHistory,
    clearFilters,
  } = useTrackingDashboard();

  return (
    <main className="page-shell dashboard-shell">
      <DashboardHeader />

      <section className="page-container">
        <DashboardKpiGrid
          vehiclesCount={vehicles.length}
          packageTypesCount={packageTypes.length}
          historyRecordsCount={historyRecordsCount}
          onlineVehiclesCount={onlineVehiclesCount}
        />

        <DashboardFilters
          vehicles={vehicles}
          packageTypes={packageTypes}
          vehicleCode={vehicleCode}
          packageTypeCodes={packageTypeCodes}
          startDate={startDate}
          endDate={endDate}
          minStartDate={minStartDate}
          maxStartDate={maxStartDate}
          minEndDate={minEndDate}
          maxEndDate={maxEndDate}
          isSessionReady={isSessionReady}
          historyPending={historyPending}
          onVehicleChange={setVehicleCode}
          onPackageTypesChange={setPackageTypeCodes}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onSearch={submitHistory}
          onClear={clearFilters}
        />
      </section>
    </main>
  );
}
