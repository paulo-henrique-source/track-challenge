import type { MarkerPopupData } from "@/types/historyMap";

type HistoryMapPopupContentProps = {
  popup: MarkerPopupData;
};

export function HistoryMapPopupContent({ popup }: HistoryMapPopupContentProps) {
  const formattedDate = popup.timestamp.replace(" ", " | ");

  return (
    <div className='space-y-1 cursor-text'>
      <p className='font-semibold cursor-text'>
        {popup.label === "A" ? "Start (A)" : "End (B)"}
      </p>
      <p className='cursor-text'>
        <span className='font-medium'>Date/Time:</span> {formattedDate}
      </p>
      <p className='cursor-text'>
        <span className='font-medium'>Driver:</span> {popup.driver}
      </p>
    </div>
  );
}
