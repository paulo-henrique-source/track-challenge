"use client";

import { useTranslate } from "@/hooks/useTranslate";

export function HistoryMapEmptyState() {
  const { t } = useTranslate();

  return (
    <div className="grid h-full w-full cursor-text place-items-center bg-[color:var(--surface-soft)] px-4 text-center text-sm text-[color:var(--text-subtle)]">
      {t("map.empty")}
    </div>
  );
}
