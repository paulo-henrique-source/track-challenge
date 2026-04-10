import { MapPin } from "lucide-react";

type HistoryMapHeaderProps = {
  pointsCount: number;
};

export function HistoryMapHeader({ pointsCount }: HistoryMapHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-3">
      <div>
        <p className="dashboard-panel-title cursor-text">Vehicle Route</p>
        <p className="dashboard-panel-subtitle cursor-text">
          Polyline with custom start (A) and end (B) markers
        </p>
      </div>
      <div className="inline-flex cursor-text items-center gap-2 rounded-sm border border-border bg-[color:var(--surface-soft)] px-2.5 py-1 text-xs text-[color:var(--text-subtle)]">
        <MapPin className="size-3.5" />
        {pointsCount} points
      </div>
    </div>
  );
}
