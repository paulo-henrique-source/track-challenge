"use client";

import { useEffect } from "react";
import { fromLonLat } from "ol/proj";

import type { MarkerPopupData } from "@/types/historyMap";

type UseHistoryMapPopupPositionParams = {
  overlayRef: React.RefObject<import("ol/Overlay").default | null>;
  activePopup: MarkerPopupData | null;
};

export function useHistoryMapPopupPosition({
  overlayRef,
  activePopup,
}: UseHistoryMapPopupPositionParams) {
  useEffect(() => {
    if (overlayRef.current == null) {
      return;
    }

    if (activePopup == null) {
      overlayRef.current.setPosition(undefined);
      return;
    }

    overlayRef.current.setPosition(fromLonLat(activePopup.coordinate));
  }, [overlayRef, activePopup]);
}
