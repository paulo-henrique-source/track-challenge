"use client";

import { Languages, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button/button";
import { useTranslate } from "@/hooks/useTranslate";
import type { AppLanguage } from "@/i18n/config";
import { getPreferredDarkMode, setPreferredDarkMode } from "@/utils/theme";

const LANGUAGE_LABEL_KEYS: Record<AppLanguage, string> = {
  "pt-BR": "header.language.options.ptBR",
  "en-US": "header.language.options.enUS",
};

export function DashboardHeader() {
  const [isDark, setIsDark] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const { t, language, setLanguage, supportedLanguages } = useTranslate();

  const handleToggleTheme = () => {
    setIsDark((current) => !current);
  };

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setIsDark(getPreferredDarkMode());
      setHasMounted(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    if (hasMounted === false) {
      return;
    }

    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    setPreferredDarkMode(isDark);
  }, [hasMounted, isDark]);

  return (
    <header className='dashboard-topbar animate-in fade-in-0 slide-in-from-top-1 duration-500'>
      <div className='dashboard-header-inner'>
        <div className='flex min-w-0 flex-1 items-center gap-1 sm:gap-2'>
          <span className='hidden cursor-text text-sm font-medium text-[color:var(--text-subtle)] md:inline'>
            {t("header.language.label")}
          </span>
          <div className='relative'>
            <Languages className='pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-[color:var(--text-muted)]' />
            <select
              aria-label={t("header.language.triggerAria")}
              value={language}
              onChange={(event) => {
                setLanguage(event.target.value as AppLanguage);
              }}
              className='h-9 cursor-pointer rounded-sm border border-border bg-background pr-8 pl-8 text-sm text-[color:var(--text-strong)] outline-none transition hover:bg-muted focus-visible:border-ring dark:border-input dark:bg-input/30 dark:hover:bg-input/50'
            >
              {supportedLanguages.map((supportedLanguage) => (
                <option key={supportedLanguage} value={supportedLanguage}>
                  {t(LANGUAGE_LABEL_KEYS[supportedLanguage])}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className='flex shrink-0 items-center gap-1'>
          <div className='w-[4.8rem] text-right min-[390px]:w-[5.5rem] md:w-auto md:min-w-max'>
            <p className='cursor-text truncate text-[11px] font-semibold whitespace-nowrap text-[color:var(--text-strong)] min-[390px]:text-xs md:overflow-visible md:text-clip'>
              {t("common.fleetUser")}
            </p>
            <p className='cursor-text truncate text-[10px] whitespace-nowrap text-[color:var(--text-subtle)] min-[390px]:text-[11px] md:overflow-visible md:text-clip'>
              {t("common.appName")}
            </p>
          </div>

          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='size-9 rounded-sm border border-border cursor-pointer transition hover:border-[color:var(--brand)] hover:bg-muted hover:text-foreground focus-visible:border-ring dark:border-input dark:bg-input/30 dark:hover:border-[color:var(--brand)] dark:hover:bg-input/50'
            onClick={handleToggleTheme}
            aria-label={t("header.themeToggle")}>
            {hasMounted && isDark ? (
              <Sun className='size-4' />
            ) : (
              <Moon className='size-4' />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
