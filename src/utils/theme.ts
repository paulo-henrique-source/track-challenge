import { THEME_STORAGE_KEY } from "@/consts";

export function getPreferredDarkMode() {
  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme === "dark") {
    return true;
  }

  if (savedTheme === "light") {
    return false;
  }

  return prefersDark;
}

export function setPreferredDarkMode(isDark: boolean) {
  window.localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
}
