export const SUPPORTED_LANGUAGES = ["pt-BR", "en-US"] as const;

export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: AppLanguage = "pt-BR";
export const LANGUAGE_STORAGE_KEY = "track-challenge-language";
export const LANGUAGE_COOKIE_NAME = "track-challenge-language";

export function isSupportedLanguage(value: unknown): value is AppLanguage {
  return (
    typeof value === "string" &&
    SUPPORTED_LANGUAGES.includes(value as AppLanguage)
  );
}

export function toSupportedLanguage(
  value: string | null | undefined,
): AppLanguage | null {
  if (value == null) {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  if (["pt", "pt-br", "pt_br"].includes(normalized)) {
    return "pt-BR";
  }

  if (["en", "en-us", "en_us"].includes(normalized)) {
    return "en-US";
  }

  return null;
}

export function normalizeLanguage(value: string | null | undefined): AppLanguage {
  return toSupportedLanguage(value) ?? DEFAULT_LANGUAGE;
}
