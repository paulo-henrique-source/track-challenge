"use client";

import dynamic from "next/dynamic";

import { DashboardFilters } from "@/components/common/trackingDashboard/dashboardFilters/dashboardFilters";
import { DashboardHeader } from "@/components/common/trackingDashboard/dashboardHeader/dashboardHeader";
import { DashboardKpiGrid } from "@/components/common/trackingDashboard/dashboardKpiGrid/dashboardKpiGrid";
import { HistoryDataTable } from "@/components/common/trackingDashboard/historyDataTable/historyDataTable";
import { HistoryStateAnalysis } from "@/components/common/trackingDashboard/historyStateAnalysis/historyStateAnalysis";
import { useTrackingDashboard } from "@/hooks/useTrackingDashboard";

const HistoryMap = dynamic(
  () =>
    import("@/components/common/trackingDashboard/historyMap/historyMap").then(
      (module) => module.HistoryMap,
    ),
  { ssr: false },
);

export function TrackingDashboard() {
  const {
    vehicles,
    packageTypes,
    isSessionReady,
    onlineVehiclesCount,
    historyRecords,
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
    <main className="page-shell dashboard-shell animate-in fade-in-0 duration-300">
      <DashboardHeader />

      <section className="page-container animate-in fade-in-0 duration-500">
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

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
          <HistoryMap records={historyRecords} isLoading={historyPending} />
          <HistoryStateAnalysis
            records={historyRecords}
            isLoading={historyPending}
          />
        </div>

        <HistoryDataTable records={historyRecords} isLoading={historyPending} />
      </section>
    </main>
  );
}
