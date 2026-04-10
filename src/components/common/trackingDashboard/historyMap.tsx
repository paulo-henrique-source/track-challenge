"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useHistoryMap } from "@/hooks/historyMap/useHistoryMap";
import type { HistoryRecord } from "@/types/history";

import { HistoryMapEmptyState } from "@/components/common/trackingDashboard/historyMapEmptyState";
import { HistoryMapHeader } from "@/components/common/trackingDashboard/historyMapHeader";
import { HistoryMapPopupContent } from "@/components/common/trackingDashboard/historyMapPopupContent";

type HistoryMapProps = {
  records: HistoryRecord[];
};

export function HistoryMap({ records }: HistoryMapProps) {
  const { mapElementRef, popupElementRef, pointsCount, activePopup } =
    useHistoryMap(records);

  return (
    <Card className='surface-card overflow-hidden p-0'>
      <CardContent className='p-0'>
        <HistoryMapHeader pointsCount={pointsCount} />
        {pointsCount === 0 ? <HistoryMapEmptyState /> : null}
        <div
          ref={mapElementRef}
          className={
            pointsCount === 0 ? "hidden" : "h-[560px] w-full lg:h-[640px]"
          }
        />
        <div
          ref={popupElementRef}
          className={
            activePopup
              ? "min-w-56 rounded-sm border border-border bg-[color:var(--surface-card)] px-3 py-2 text-xs text-[color:var(--text-strong)] shadow-lg"
              : "hidden"
          }>
          {activePopup ? <HistoryMapPopupContent popup={activePopup} /> : null}
        </div>
      </CardContent>
    </Card>
  );
}
