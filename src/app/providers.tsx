"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "@/i18n/i18next";
import { useSilentSessionInitializer } from "@/hooks/useSilentSessionInitializer";
import { useSessionStore } from "@/store/sessionStore";

type ProvidersProps = {
  children: ReactNode;
};

type ToastTheme = "light" | "dark";
const THEME_COLOR_META_SELECTOR = "meta[name='theme-color']";

function syncBrowserThemeColor(root: HTMLElement) {
  const surfaceCardColor = window
    .getComputedStyle(root)
    .getPropertyValue("--surface-card")
    .trim();
  const resolvedThemeColor = surfaceCardColor || "#ffffff";

  const themeColorMetaTags = Array.from(
    document.querySelectorAll<HTMLMetaElement>(THEME_COLOR_META_SELECTOR),
  );

  if (themeColorMetaTags.length === 0) {
    const themeColorMeta = document.createElement("meta");
    themeColorMeta.name = "theme-color";
    themeColorMeta.content = resolvedThemeColor;
    document.head.append(themeColorMeta);
    return;
  }

  for (const themeColorMeta of themeColorMetaTags) {
    themeColorMeta.removeAttribute("media");
    themeColorMeta.content = resolvedThemeColor;
  }
}

function SessionInitializerRunner() {
  useSilentSessionInitializer();
  return null;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  const [toastTheme, setToastTheme] = useState<ToastTheme>("light");
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    useSessionStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    const syncTheme = () => {
      setToastTheme(root.classList.contains("dark") ? "dark" : "light");
      syncBrowserThemeColor(root);
    };

    const frameId = window.requestAnimationFrame(() => {
      setHasMounted(true);
      syncTheme();
    });

    const observer = new MutationObserver(syncTheme);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionInitializerRunner />
      {children}
      {hasMounted ? (
        <ToastContainer
          position='top-center'
          theme={toastTheme}
          autoClose={3500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          pauseOnFocusLoss={false}
        />
      ) : null}
    </QueryClientProvider>
  );
}
