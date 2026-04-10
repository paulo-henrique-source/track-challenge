import {
  DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE_NAME,
  type AppLanguage,
  toSupportedLanguage,
} from "@/i18n/config";
import {
  hasTranslationKey,
  translateFromDictionary,
} from "@/i18n/dictionaries";

function getLanguageFromCookieHeader(cookieHeader: string | null): AppLanguage | null {
  if (!cookieHeader) {
    return null;
  }

  const cookieParts = cookieHeader.split(";");

  for (const cookiePart of cookieParts) {
    const [rawName, ...rawValueParts] = cookiePart.split("=");
    const cookieName = rawName?.trim();

    if (cookieName !== LANGUAGE_COOKIE_NAME) {
      continue;
    }

    const cookieValue = rawValueParts.join("=").trim();
    return toSupportedLanguage(cookieValue);
  }

  return null;
}

export function getRequestLanguage(request: Request): AppLanguage {
  const cookieLanguage = getLanguageFromCookieHeader(
    request.headers.get("cookie"),
  );

  if (cookieLanguage) {
    return cookieLanguage;
  }

  return DEFAULT_LANGUAGE;
}

export function translateServer(
  language: AppLanguage,
  key: string,
  values?: Record<string, string | number>,
) {
  return translateFromDictionary(language, key, values);
}

export function resolveServerMessage(
  language: AppLanguage,
  message: string | null | undefined,
  fallbackKey: string,
) {
  if (typeof message === "string" && hasTranslationKey(language, message)) {
    return translateServer(language, message);
  }

  if (typeof message === "string" && message.trim().length > 0) {
    return message;
  }

  return translateServer(language, fallbackKey);
}
