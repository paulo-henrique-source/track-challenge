"use client";

import type { MarkerPopupData } from "@/types/historyMap";
import { useTranslate } from "@/hooks/useTranslate";

type HistoryMapPopupContentProps = {
  popup: MarkerPopupData;
};

export function HistoryMapPopupContent({ popup }: HistoryMapPopupContentProps) {
  const { t } = useTranslate();
  const formattedDate = popup.timestamp.replace(" ", " | ");

  return (
    <div className='space-y-1 cursor-text'>
      <p className='font-semibold cursor-text'>
        {popup.label === "A" ? t("map.popup.start") : t("map.popup.end")}
      </p>
      <p className='cursor-text'>
        <span className='font-medium'>{t("map.popup.dateTime")}:</span>{" "}
        {formattedDate}
      </p>
      <p className='cursor-text'>
        <span className='font-medium'>{t("map.popup.driver")}:</span>{" "}
        {popup.driver}
      </p>
    </div>
  );
}
