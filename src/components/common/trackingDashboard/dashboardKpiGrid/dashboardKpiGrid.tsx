"use client";

import { Boxes, Car, Route, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card/card";
import { useTranslate } from "@/hooks/useTranslate";

type DashboardKpiGridProps = {
  vehiclesCount: number;
  packageTypesCount: number;
  historyRecordsCount: number;
  onlineVehiclesCount: number;
};

function formatNumber(value: number, locale: string) {
  return Intl.NumberFormat(locale).format(value);
}

export function DashboardKpiGrid({
  vehiclesCount,
  packageTypesCount,
  historyRecordsCount,
  onlineVehiclesCount,
}: DashboardKpiGridProps) {
  const { t, language } = useTranslate();

  return (
    <div className='dashboard-kpi-grid animate-in fade-in-0 slide-in-from-bottom-1 duration-500'>
      <Card className='dashboard-kpi-card transition-all duration-300 hover:-translate-y-0.5'>
        <CardContent className='p-0'>
          <div className='flex items-center gap-3'>
            <span className='grid size-9 place-items-center rounded-full bg-[color:var(--brand-soft)] text-primary'>
              <Car className='size-4' />
            </span>
            <div>
              <p className='cursor-text text-lg font-semibold text-[color:var(--text-strong)]'>
                {formatNumber(vehiclesCount, language)}
              </p>
              <p className='cursor-text text-xs text-[color:var(--text-subtle)]'>
                {t("kpi.vehiclesLoaded")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='dashboard-kpi-card transition-all duration-300 hover:-translate-y-0.5'>
        <CardContent className='p-0'>
          <div className='flex items-center gap-3'>
            <span className='grid size-9 place-items-center rounded-full bg-[color:var(--surface-elevated)] text-[color:var(--accent-blue)]'>
              <Boxes className='size-4' />
            </span>
            <div>
              <p className='cursor-text text-lg font-semibold text-[color:var(--text-strong)]'>
                {formatNumber(packageTypesCount, language)}
              </p>
              <p className='cursor-text text-xs text-[color:var(--text-subtle)]'>
                {t("kpi.packageTypes")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='dashboard-kpi-card transition-all duration-300 hover:-translate-y-0.5'>
        <CardContent className='p-0'>
          <div className='flex items-center gap-3'>
            <span className='grid size-9 place-items-center rounded-full bg-[color:var(--surface-elevated)] text-[color:var(--accent-orange)]'>
              <Route className='size-4' />
            </span>
            <div>
              <p className='cursor-text text-lg font-semibold text-[color:var(--text-strong)]'>
                {formatNumber(historyRecordsCount, language)}
              </p>
              <p className='cursor-text text-xs text-[color:var(--text-subtle)]'>
                {t("kpi.latestRecords")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='dashboard-kpi-card transition-all duration-300 hover:-translate-y-0.5'>
        <CardContent className='p-0'>
          <div className='flex items-center gap-3'>
            <span className='grid size-9 place-items-center rounded-full bg-[color:var(--surface-elevated)] text-[color:var(--accent-pink)]'>
              <Users className='size-4' />
            </span>
            <div>
              <p className='cursor-text text-lg font-semibold text-[color:var(--text-strong)]'>
                {formatNumber(onlineVehiclesCount, language)}
              </p>
              <p className='cursor-text text-xs text-[color:var(--text-subtle)]'>
                {t("kpi.vehiclesOnline")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
