"use client";

import { useCallback, useEffect, useState } from "react";

import {
  DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE_NAME,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  type AppLanguage,
  normalizeLanguage,
} from "@/i18n/config";
import { ensureI18nInitialized, i18next } from "@/i18n/i18next";

type TranslateValues = Record<string, string | number>;

function persistLanguage(language: AppLanguage) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);

  document.cookie = `${LANGUAGE_COOKIE_NAME}=${language}; path=/; max-age=31536000; SameSite=Lax`;
  document.documentElement.setAttribute("lang", language);
}

function getStoredLanguage(): AppLanguage {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  return normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
}

export function useTranslate() {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    return normalizeLanguage(i18next.resolvedLanguage ?? i18next.language);
  });

  useEffect(() => {
    let active = true;

    const syncLanguage = () => {
      if (!active) {
        return;
      }

      setLanguageState(
        normalizeLanguage(i18next.resolvedLanguage ?? i18next.language),
      );
    };

    const initialize = async () => {
      await ensureI18nInitialized();

      const storedLanguage = getStoredLanguage();
      persistLanguage(storedLanguage);

      if (i18next.language !== storedLanguage) {
        await i18next.changeLanguage(storedLanguage);
      }

      syncLanguage();
    };

    void initialize();
    i18next.on("languageChanged", syncLanguage);

    return () => {
      active = false;
      i18next.off("languageChanged", syncLanguage);
    };
  }, []);

  const setLanguage = useCallback(
    (nextLanguage: AppLanguage) => {
      const normalizedLanguage = normalizeLanguage(nextLanguage);

      persistLanguage(normalizedLanguage);
      setLanguageState(normalizedLanguage);

      if (i18next.language !== normalizedLanguage) {
        void ensureI18nInitialized().then(() => {
          return i18next.changeLanguage(normalizedLanguage);
        });
      }
    },
    [],
  );

  const t = useCallback(
    (key: string, values?: TranslateValues) => {
      return i18next.t(key, values);
    },
    [],
  );

  const hasTranslation = useCallback(
    (key: string) => {
      return i18next.exists(key);
    },
    [],
  );

  return {
    t,
    language,
    setLanguage,
    hasTranslation,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };
}
