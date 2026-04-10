"use client";

import { Moon, Search, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPreferredDarkMode, setPreferredDarkMode } from "@/utils/theme";

export function DashboardHeader() {
  const [isDark, setIsDark] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

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
            {hasMounted && isDark ? (
              <Sun className='size-4' />
            ) : (
              <Moon className='size-4' />
            )}
          </Button>

          <div className='text-right'>
            <p className='text-xs font-semibold text-[color:var(--text-strong)]'>
              Fleet User
            </p>
            <p className='text-[11px] text-[color:var(--text-subtle)]'>
              Life Web
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
