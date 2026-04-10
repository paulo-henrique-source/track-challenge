"use client";

import { useEffect } from "react";
import Map from "ol/Map";
import { unByKey } from "ol/Observable";
import Overlay from "ol/Overlay";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { fromLonLat } from "ol/proj";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import type { EventsKey } from "ol/events";

import type { MarkerPopupData } from "@/types/historyMap";

type MapRef = React.RefObject<Map | null>;
type VectorSourceRef = React.RefObject<VectorSource | null>;
type OverlayRef = React.RefObject<Overlay | null>;

type UseHistoryMapSetupParams = {
  mapElementRef: React.RefObject<HTMLDivElement | null>;
  popupElementRef: React.RefObject<HTMLDivElement | null>;
  mapRef: MapRef;
  vectorSourceRef: VectorSourceRef;
  overlayRef: OverlayRef;
  onPopupChange: (popup: MarkerPopupData | null) => void;
};

type SetupMapParams = {
  mapElementRef: React.RefObject<HTMLDivElement | null>;
  popupElementRef: React.RefObject<HTMLDivElement | null>;
  mapRef: MapRef;
  vectorSourceRef: VectorSourceRef;
  overlayRef: OverlayRef;
  onPopupChange: (popup: MarkerPopupData | null) => void;
};

function setupMap({
  mapElementRef,
  popupElementRef,
  mapRef,
  vectorSourceRef,
  overlayRef,
  onPopupChange,
}: SetupMapParams): (() => void) | undefined {
  if (
    mapElementRef.current == null ||
    popupElementRef.current == null ||
    mapRef.current != null
  ) {
    return undefined;
  }

  const vectorSource = new VectorSource();
  vectorSourceRef.current = vectorSource;

  const vectorLayer = new VectorLayer({
    source: vectorSource,
  });

  const tileLayer = new TileLayer({
    source: new OSM({
      url: "https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    }),
  });

  const overlay = new Overlay({
    element: popupElementRef.current,
    positioning: "bottom-center",
    stopEvent: false,
    offset: [0, -14],
    autoPan: {
      animation: {
        duration: 220,
      },
    },
  });

  overlayRef.current = overlay;

  const map = new Map({
    target: mapElementRef.current,
    layers: [tileLayer, vectorLayer],
    overlays: [overlay],
    view: new View({
      center: fromLonLat([-43.1729, -22.9068]),
      zoom: 6,
    }),
  });

  mapRef.current = map;

  const clickKey: EventsKey = map.on("singleclick", (event) => {
    const feature = map.forEachFeatureAtPixel(event.pixel, (candidate) => {
      return candidate;
    });

    if (feature == null) {
      onPopupChange(null);
      return;
    }

    const popupData = feature.get("popupData") as MarkerPopupData | undefined;
    onPopupChange(popupData ?? null);
  });

  return () => {
    unByKey(clickKey);
  };
}

export function useHistoryMapSetup({
  mapElementRef,
  popupElementRef,
  mapRef,
  vectorSourceRef,
  overlayRef,
  onPopupChange,
}: UseHistoryMapSetupParams) {
  useEffect(() => {
    const cleanup = setupMap({
      mapElementRef,
      popupElementRef,
      mapRef,
      vectorSourceRef,
      overlayRef,
      onPopupChange,
    });

    return () => {
      if (typeof cleanup === "function") {
        cleanup();
      }

      if (mapRef.current != null) {
        mapRef.current.setTarget(undefined);
        mapRef.current = null;
      }

      vectorSourceRef.current = null;
      overlayRef.current = null;
    };
  }, [
    mapElementRef,
    popupElementRef,
    mapRef,
    vectorSourceRef,
    overlayRef,
    onPopupChange,
  ]);
}
