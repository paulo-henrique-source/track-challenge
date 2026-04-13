"use client";

import { MapPin } from "lucide-react";

import { useTranslate } from "@/hooks/useTranslate";

type HistoryMapHeaderProps = {
  pointsCount: number;
};

export function HistoryMapHeader({ pointsCount }: HistoryMapHeaderProps) {
  const { t } = useTranslate();

  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-3">
      <div>
        <p className="dashboard-panel-title cursor-text">{t("map.title")}</p>
        <p className="dashboard-panel-subtitle cursor-text">
          {t("map.subtitle")}
        </p>
      </div>
      <div className="inline-flex cursor-text items-center gap-2 rounded-sm border border-border bg-[color:var(--surface-soft)] px-2.5 py-1 text-xs text-[color:var(--text-subtle)]">
        <MapPin className="size-3.5" />
        {t("map.points", { count: pointsCount })}
      </div>
    </div>
  );
}
