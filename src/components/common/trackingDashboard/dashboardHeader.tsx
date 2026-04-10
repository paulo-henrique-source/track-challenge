"use client";

import { Moon, Search, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

const THEME_STORAGE_KEY = "track-challenge-theme";

function getInitialDarkMode() {
  if (typeof window === "undefined") {
    return false;
  }

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

export function DashboardHeader() {
  const [isDark, setIsDark] = useState(getInitialDarkMode);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    window.localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  const handleToggleTheme = () => {
    setIsDark((current) => !current);
  };

  return (
    <header className='dashboard-topbar'>
      <div className='dashboard-header-inner'>
        <div className='dashboard-search'>
          <Search className='pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-[color:var(--text-muted)]' />
          <Input className='dashboard-search-input' placeholder='Search...' />
        </div>

        <div className='flex items-center gap-2'>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='size-9 rounded-sm border border-border'
            onClick={handleToggleTheme}
            aria-label='Toggle dark mode'>
            {isDark ? <Sun className='size-4' /> : <Moon className='size-4' />}
          </Button>

          <div className='text-right'>
            <p className='text-xs font-semibold text-[color:var(--text-strong)]'>
              Fleet User
            </p>
            <p className='text-[11px] text-[color:var(--text-subtle)]'>Life Web</p>
          </div>
        </div>
      </div>
    </header>
  );
}
