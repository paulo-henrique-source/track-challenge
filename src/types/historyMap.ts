export type MappableHistoryPoint = {
  timestamp: string;
  driver: string;
  latitude: number;
  longitude: number;
};

export type MarkerPopupData = {
  label: "A" | "B";
  timestamp: string;
  driver: string;
  coordinate: [number, number];
};
