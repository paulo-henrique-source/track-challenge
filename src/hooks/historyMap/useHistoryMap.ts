"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type Map from "ol/Map";
import type Overlay from "ol/Overlay";
import type VectorSource from "ol/source/Vector";

import type { MarkerPopupData } from "@/types/historyMap";
import { useHistoryMapPopupPosition } from "@/hooks/historyMap/useHistoryMapPopupPosition";
import { useHistoryMapRouteRenderer } from "@/hooks/historyMap/useHistoryMapRouteRenderer";
import { useHistoryMapSetup } from "@/hooks/historyMap/useHistoryMapSetup";
import type { HistoryRecord } from "@/types/history";
import { getMappablePoints } from "@/utils/historyMap";

type UseHistoryMapResult = {
  mapElementRef: React.RefObject<HTMLDivElement | null>;
  popupElementRef: React.RefObject<HTMLDivElement | null>;
  pointsCount: number;
  activePopup: MarkerPopupData | null;
};

export function useHistoryMap(records: HistoryRecord[]): UseHistoryMapResult {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const popupElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const vectorSourceRef = useRef<VectorSource | null>(null);
  const overlayRef = useRef<Overlay | null>(null);

  const [activePopup, setActivePopup] = useState<MarkerPopupData | null>(null);

  const points = useMemo(() => {
    return getMappablePoints(records);
  }, [records]);

  const handlePopupChange = useCallback((popup: MarkerPopupData | null) => {
    setActivePopup(popup);
  }, []);

  useHistoryMapSetup({
    mapElementRef,
    popupElementRef,
    mapRef,
    vectorSourceRef,
    overlayRef,
    onPopupChange: handlePopupChange,
  });

  useHistoryMapRouteRenderer({
    points,
    mapRef,
    vectorSourceRef,
    onPopupChange: handlePopupChange,
  });

  useHistoryMapPopupPosition({
    overlayRef,
    activePopup,
  });

  return {
    mapElementRef,
    popupElementRef,
    pointsCount: points.length,
    activePopup,
  };
}
