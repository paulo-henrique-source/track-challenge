"use client";

import { useEffect } from "react";
import type { Coordinate } from "ol/coordinate";
import { createEmpty, extendCoordinate } from "ol/extent";
import Feature from "ol/Feature";
import { LineString, Point } from "ol/geom";
import type Map from "ol/Map";
import { fromLonLat } from "ol/proj";
import type VectorSource from "ol/source/Vector";
import CircleStyle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import Text from "ol/style/Text";

import {
  MAX_SEGMENT_DURATION,
  MIN_SEGMENT_DURATION,
  SEGMENT_DURATION_FACTOR,
} from "@/consts";
import {
  getMapThemeColors,
  interpolateCoordinate,
  projectCoordinates,
} from "@/utils/historyMap";
import type {
  MappableHistoryPoint,
  MarkerPopupData,
} from "@/types/historyMap";

type MapRef = React.RefObject<Map | null>;
type VectorSourceRef = React.RefObject<VectorSource | null>;
type MapThemeColors = ReturnType<typeof getMapThemeColors>;
type CancelledRef = { current: boolean };

type UseHistoryMapRouteRendererParams = {
  points: MappableHistoryPoint[];
  mapRef: MapRef;
  vectorSourceRef: VectorSourceRef;
  onPopupChange: (popup: MarkerPopupData | null) => void;
};

type RenderRouteParams = {
  points: MappableHistoryPoint[];
  mapRef: MapRef;
  vectorSourceRef: VectorSourceRef;
  onPopupChange: (popup: MarkerPopupData | null) => void;
  cancelledRef: CancelledRef;
  setAnimationFrameId: (animationFrameId: number) => void;
};

type RouteFeatures = {
  traveledFeature: Feature;
  remainingFeature: Feature;
  busFeature: Feature;
};

type StartRouteAnimationParams = {
  projectedCoordinates: Coordinate[];
  routeFeatures: RouteFeatures;
  mapRef: MapRef;
  vectorSourceRef: VectorSourceRef;
  cancelledRef: CancelledRef;
  setAnimationFrameId: (animationFrameId: number) => void;
};

function renderPointFeatures(
  vectorSource: VectorSource,
  projectedCoordinates: Coordinate[],
  mapThemeColors: MapThemeColors,
) {
  projectedCoordinates.forEach((coordinate) => {
    const pointFeature = new Feature({
      geometry: new Point(coordinate),
    });

    pointFeature.setStyle(
      new Style({
        image: new CircleStyle({
          radius: 3,
          fill: new Fill({
            color: mapThemeColors.accentBlue,
          }),
          stroke: new Stroke({
            color: "#ffffff",
            width: 1,
          }),
        }),
      }),
    );

    vectorSource.addFeature(pointFeature);
  });
}

function buildMarkerDefinitions(
  points: MappableHistoryPoint[],
): MarkerPopupData[] {
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  return [
    {
      label: "A",
      timestamp: firstPoint.timestamp,
      driver: firstPoint.driver,
      coordinate: [firstPoint.longitude, firstPoint.latitude],
    },
    {
      label: "B",
      timestamp: lastPoint.timestamp,
      driver: lastPoint.driver,
      coordinate: [lastPoint.longitude, lastPoint.latitude],
    },
  ];
}

function renderEndpointMarkers(
  vectorSource: VectorSource,
  markerDefinitions: MarkerPopupData[],
  mapThemeColors: MapThemeColors,
) {
  markerDefinitions.forEach((marker) => {
    const markerFeature = new Feature({
      geometry: new Point(fromLonLat(marker.coordinate)),
    });

    markerFeature.set("popupData", marker);

    markerFeature.setStyle(
      new Style({
        image: new CircleStyle({
          radius: 10,
          fill: new Fill({
            color:
              marker.label === "A"
                ? mapThemeColors.accentBlue
                : mapThemeColors.accentPink,
          }),
          stroke: new Stroke({
            color: "#ffffff",
            width: 2,
          }),
        }),
        text: new Text({
          text: marker.label,
          fill: new Fill({
            color: "#ffffff",
          }),
          font: "700 11px Plus Jakarta Sans, sans-serif",
        }),
      }),
    );

    vectorSource.addFeature(markerFeature);
  });
}

function createRouteFeatures(
  projectedCoordinates: Coordinate[],
  mapThemeColors: MapThemeColors,
): RouteFeatures {
  const traveledFeature = new Feature({
    geometry: new LineString([]),
  });
  traveledFeature.setStyle(
    new Style({
      stroke: new Stroke({
        color: mapThemeColors.brand,
        width: 5,
      }),
    }),
  );

  const remainingFeature = new Feature({
    geometry: new LineString(projectedCoordinates),
  });
  remainingFeature.setStyle(
    new Style({
      stroke: new Stroke({
        color: mapThemeColors.brandAlt,
        width: 4,
      }),
    }),
  );

  const busFeature = new Feature({
    geometry: new Point(projectedCoordinates[0]),
  });
  busFeature.setStyle(
    new Style({
      text: new Text({
        text: "🚚",
        font: "700 20px Plus Jakarta Sans, sans-serif",
      }),
      image: new CircleStyle({
        radius: 12,
        fill: new Fill({
          color: "rgba(255,255,255,0.84)",
        }),
        stroke: new Stroke({
          color: mapThemeColors.brand,
          width: 1.5,
        }),
      }),
    }),
  );

  return {
    traveledFeature,
    remainingFeature,
    busFeature,
  };
}

function fitMapToRoute(map: Map, projectedCoordinates: Coordinate[]) {
  const fitExtent = createEmpty();

  projectedCoordinates.forEach((coordinate) => {
    extendCoordinate(fitExtent, coordinate);
  });

  map.updateSize();

  map.getView().fit(fitExtent, {
    duration: 350,
    padding: [92, 72, 92, 72],
    maxZoom: 16,
  });
}

function startRouteAnimation({
  projectedCoordinates,
  routeFeatures,
  mapRef,
  vectorSourceRef,
  cancelledRef,
  setAnimationFrameId,
}: StartRouteAnimationParams) {
  let direction = 1;
  let directionRoute = projectedCoordinates;
  let fromIndex = 0;
  let toIndex = 1;
  let segmentStartTimestamp: number | null = null;

  const animate = (timestamp: number) => {
    if (
      cancelledRef.current === true ||
      mapRef.current == null ||
      vectorSourceRef.current == null
    ) {
      return;
    }

    if (segmentStartTimestamp == null) {
      segmentStartTimestamp = timestamp;
    }

    const fromCoordinate = directionRoute[fromIndex];
    const toCoordinate = directionRoute[toIndex];

    const deltaX = toCoordinate[0] - fromCoordinate[0];
    const deltaY = toCoordinate[1] - fromCoordinate[1];
    const segmentLength = Math.hypot(deltaX, deltaY);
    const segmentDuration = Math.min(
      MAX_SEGMENT_DURATION,
      Math.max(MIN_SEGMENT_DURATION, segmentLength / SEGMENT_DURATION_FACTOR),
    );

    let progress = (timestamp - segmentStartTimestamp) / segmentDuration;
    if (progress > 1) {
      progress = 1;
    }

    const currentCoordinate = interpolateCoordinate(
      fromCoordinate,
      toCoordinate,
      progress,
    );

    (routeFeatures.busFeature.getGeometry() as Point).setCoordinates(
      currentCoordinate,
    );

    const traveledCoordinates = directionRoute
      .slice(0, fromIndex + 1)
      .concat([currentCoordinate]);
    const remainingCoordinates = [currentCoordinate].concat(
      directionRoute.slice(toIndex),
    );

    (routeFeatures.traveledFeature.getGeometry() as LineString).setCoordinates(
      traveledCoordinates,
    );
    (routeFeatures.remainingFeature.getGeometry() as LineString).setCoordinates(
      remainingCoordinates,
    );

    if (progress >= 1) {
      fromIndex = toIndex;
      toIndex = toIndex + 1;
      segmentStartTimestamp = timestamp;

      if (toIndex >= directionRoute.length) {
        direction = direction * -1;

        if (direction === 1) {
          directionRoute = projectedCoordinates;
        } else {
          directionRoute = [...projectedCoordinates].reverse();
        }

        fromIndex = 0;
        toIndex = 1;
        segmentStartTimestamp = timestamp;
      }
    }

    setAnimationFrameId(window.requestAnimationFrame(animate));
  };

  setAnimationFrameId(window.requestAnimationFrame(animate));
}

function renderRoute({
  points,
  mapRef,
  vectorSourceRef,
  onPopupChange,
  cancelledRef,
  setAnimationFrameId,
}: RenderRouteParams) {
  if (
    cancelledRef.current === true ||
    mapRef.current == null ||
    vectorSourceRef.current == null
  ) {
    return;
  }

  const map = mapRef.current;
  const vectorSource = vectorSourceRef.current;
  const mapThemeColors = getMapThemeColors();

  vectorSource.clear();
  onPopupChange(null);

  if (points.length === 0) {
    return;
  }

  const projectedCoordinates = projectCoordinates(points);

  renderPointFeatures(vectorSource, projectedCoordinates, mapThemeColors);

  const markerDefinitions = buildMarkerDefinitions(points);
  renderEndpointMarkers(vectorSource, markerDefinitions, mapThemeColors);

  const routeFeatures = createRouteFeatures(
    projectedCoordinates,
    mapThemeColors,
  );

  vectorSource.addFeature(routeFeatures.remainingFeature);
  vectorSource.addFeature(routeFeatures.traveledFeature);
  vectorSource.addFeature(routeFeatures.busFeature);

  fitMapToRoute(map, projectedCoordinates);

  if (projectedCoordinates.length === 1) {
    (routeFeatures.traveledFeature.getGeometry() as LineString).setCoordinates(
      projectedCoordinates,
    );
    (routeFeatures.remainingFeature.getGeometry() as LineString).setCoordinates(
      projectedCoordinates,
    );
    return;
  }

  startRouteAnimation({
    projectedCoordinates,
    routeFeatures,
    mapRef,
    vectorSourceRef,
    cancelledRef,
    setAnimationFrameId,
  });
}

export function useHistoryMapRouteRenderer({
  points,
  mapRef,
  vectorSourceRef,
  onPopupChange,
}: UseHistoryMapRouteRendererParams) {
  useEffect(() => {
    const cancelledRef: CancelledRef = { current: false };
    let animationFrameId: number | null = null;

    renderRoute({
      points,
      mapRef,
      vectorSourceRef,
      onPopupChange,
      cancelledRef,
      setAnimationFrameId: (nextAnimationFrameId) => {
        animationFrameId = nextAnimationFrameId;
      },
    });

    return () => {
      cancelledRef.current = true;

      if (animationFrameId != null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [points, mapRef, vectorSourceRef, onPopupChange]);
}
