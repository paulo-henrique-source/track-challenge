import type { HistoryRequest } from "@/types/history";

export const INTERNAL_SILENT_SESSION_ENDPOINT = "/api/silent-session";
export const INTERNAL_HISTORY_ENDPOINT = "/api/history";

export const MIN_SEGMENT_DURATION = 900;
export const MAX_SEGMENT_DURATION = 5200;
export const SEGMENT_DURATION_FACTOR = 1.4;

export const MAX_RANGE_HOURS = 48;
export const MAX_RANGE_MILLISECONDS = MAX_RANGE_HOURS * 60 * 60 * 1000;
export const MAX_END_DATE_FUTURE_DAYS = 45;

// Temporary local mock while dashboard development is in progress.
// Set to false to restore real payload based on filters.
export const USE_HISTORY_REQUEST_MOCK = true;
export const MOCK_HISTORY_REQUEST: Omit<HistoryRequest, "token"> = {
  inicio: "2026-04-07 00:00:00",
  fim: "2026-04-08 00:00:00",
  tipos_pacotes: "1,2,3,4",
  veiccodigo: "024",
};

export const THEME_STORAGE_KEY = "track-challenge-theme";
