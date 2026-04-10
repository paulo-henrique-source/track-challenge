import type { Coordinate } from "ol/coordinate";
import { MappableHistoryPoint } from "../types/historyMap";
import { fromLonLat } from "ol/proj";
import { HistoryRecord } from "../types/history";

type MapThemeColors = {
  brand: string;
  brandAlt: string;
  accentBlue: string;
  accentPink: string;
};

export function resolveCssColor(
  styles: CSSStyleDeclaration,
  variableName: string,
  fallback: string,
) {
  const value = styles.getPropertyValue(variableName).trim();
  return value.length > 0 ? value : fallback;
}

export function getMapThemeColors(): MapThemeColors {
  const styles = window.getComputedStyle(document.documentElement);

  return {
    brand: resolveCssColor(styles, "--brand", "#6f42f4"),
    brandAlt: resolveCssColor(styles, "--brand-alt", "#8e62ff"),
    accentBlue: resolveCssColor(styles, "--accent-blue", "#4aa8ff"),
    accentPink: resolveCssColor(styles, "--accent-pink", "#f56ba5"),
  };
}

export function interpolateCoordinate(
  from: Coordinate,
  to: Coordinate,
  progress: number,
): Coordinate {
  return [
    from[0] + (to[0] - from[0]) * progress,
    from[1] + (to[1] - from[1]) * progress,
  ];
}

export function projectCoordinates(
  points: MappableHistoryPoint[],
): Coordinate[] {
  return points.map(
    (point) => fromLonLat([point.longitude, point.latitude]) as Coordinate,
  );
}

export function getMappablePoints(
  records: HistoryRecord[],
): MappableHistoryPoint[] {
  return records
    .map((record) => {
      const latitude = Number(record.latitude);
      const longitude = Number(record.longitude);

      const invalidNumber =
        Number.isFinite(latitude) === false ||
        Number.isFinite(longitude) === false;

      if (invalidNumber) {
        return null;
      }

      return {
        timestamp: record.data,
        driver: record.motorista ?? "Not informed",
        latitude,
        longitude,
      };
    })
    .filter((point): point is MappableHistoryPoint =>
      point === null ? false : true,
    );
}
