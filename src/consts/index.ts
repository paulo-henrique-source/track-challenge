import type { HistoryRequest } from "@/types/history";

export const INTERNAL_SILENT_SESSION_ENDPOINT = "/api/silent-session";
export const INTERNAL_HISTORY_ENDPOINT = "/api/history";

export const MIN_SEGMENT_DURATION = 900;
export const MAX_SEGMENT_DURATION = 5200;
export const SEGMENT_DURATION_FACTOR = 1.4;

export const MAX_RANGE_HOURS = 48;
export const MAX_RANGE_MILLISECONDS = MAX_RANGE_HOURS * 60 * 60 * 1000;
export const MAX_END_DATE_FUTURE_DAYS = 45;

export const THEME_STORAGE_KEY = "track-challenge-theme";
