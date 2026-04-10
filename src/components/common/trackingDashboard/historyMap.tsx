"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useHistoryMap } from "@/hooks/historyMap/useHistoryMap";
import type { HistoryRecord } from "@/types/history";

import { HistoryMapEmptyState } from "@/components/common/trackingDashboard/historyMapEmptyState";
import { HistoryMapHeader } from "@/components/common/trackingDashboard/historyMapHeader";
import { HistoryMapPopupContent } from "@/components/common/trackingDashboard/historyMapPopupContent";

type HistoryMapProps = {
  records: HistoryRecord[];
  isLoading?: boolean;
};

export function HistoryMap({ records, isLoading = false }: HistoryMapProps) {
  const { mapElementRef, popupElementRef, pointsCount, activePopup } =
    useHistoryMap(records);

  return (
    <Card className='surface-card animate-in fade-in-0 slide-in-from-bottom-2 overflow-hidden p-0 duration-500'>
      <CardContent className='p-0'>
        <HistoryMapHeader pointsCount={isLoading ? 0 : pointsCount} />

        <div className="relative h-[560px] w-full lg:h-[640px]">
          <div ref={mapElementRef} className="h-full w-full" />

          {!isLoading && pointsCount === 0 ? (
            <div className="absolute inset-0 z-10">
              <HistoryMapEmptyState />
            </div>
          ) : null}

        </div>

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
