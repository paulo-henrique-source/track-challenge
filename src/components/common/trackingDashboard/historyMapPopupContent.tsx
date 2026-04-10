import type { MarkerPopupData } from "@/types/historyMap";

type HistoryMapPopupContentProps = {
  popup: MarkerPopupData;
};

export function HistoryMapPopupContent({ popup }: HistoryMapPopupContentProps) {
  const formattedDate = popup.timestamp.replace(" ", " | ");

  return (
    <div className='space-y-1'>
      <p className='font-semibold'>
        {popup.label === "A" ? "Start (A)" : "End (B)"}
      </p>
      <p>
        <span className='font-medium'>Date/Time:</span> {formattedDate}
      </p>
      <p>
        <span className='font-medium'>Driver:</span> {popup.driver}
      </p>
    </div>
  );
}
