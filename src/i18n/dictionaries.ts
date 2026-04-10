import enUS from "../../messages/en-US.json";
import ptBR from "../../messages/pt-BR.json";

import { DEFAULT_LANGUAGE, type AppLanguage } from "@/i18n/config";

type TranslationDict = Record<string, unknown>;

export const translationResources = {
  "pt-BR": {
    translation: ptBR,
  },
  "en-US": {
    translation: enUS,
  },
} as const;

const translationDict: Record<AppLanguage, TranslationDict> = {
  "pt-BR": ptBR,
  "en-US": enUS,
};

function getByPath(source: TranslationDict, path: string): unknown {
  return path.split(".").reduce<unknown>((accumulator, segment) => {
    if (accumulator == null || typeof accumulator !== "object") {
      return undefined;
    }

    return (accumulator as TranslationDict)[segment];
  }, source);
}

function applyInterpolation(
  message: string,
  values?: Record<string, string | number>,
): string {
  if (values == null) {
    return message;
  }

  return Object.entries(values).reduce((accumulator, [key, value]) => {
    return accumulator.replaceAll(`{{${key}}}`, String(value));
  }, message);
}

export function hasTranslationKey(language: AppLanguage, key: string) {
  const value = getByPath(translationDict[language], key);

  return typeof value === "string";
}

export function translateFromDictionary(
  language: AppLanguage,
  key: string,
  values?: Record<string, string | number>,
): string {
  const resolvedValue =
    getByPath(translationDict[language], key) ??
    getByPath(translationDict[DEFAULT_LANGUAGE], key);

  if (typeof resolvedValue !== "string") {
    return key;
  }

  return applyInterpolation(resolvedValue, values);
}
