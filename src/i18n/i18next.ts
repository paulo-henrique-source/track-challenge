"use client";

import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "@/i18n/config";
import { translationResources } from "@/i18n/dictionaries";

let initializationPromise: Promise<typeof i18next> | null = null;

export function ensureI18nInitialized() {
  if (i18next.isInitialized) {
    return Promise.resolve(i18next);
  }

  if (initializationPromise == null) {
    i18next.use(initReactI18next);

    initializationPromise = i18next
      .init({
        resources: translationResources,
        lng: DEFAULT_LANGUAGE,
        fallbackLng: DEFAULT_LANGUAGE,
        supportedLngs: SUPPORTED_LANGUAGES,
        interpolation: {
          escapeValue: false,
        },
        returnNull: false,
        initAsync: false,
      })
      .then(() => i18next);
  }

  return initializationPromise;
}

void ensureI18nInitialized();

export { i18next };
