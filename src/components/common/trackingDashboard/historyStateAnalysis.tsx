"use client";

import { useMemo } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HistoryRecordState } from "@/types/enums";
import type { HistoryRecord } from "@/types/history";

type HistoryStateAnalysisProps = {
  records: HistoryRecord[];
};

type StateStats = {
  open: number;
  closed: number;
  others: number;
  total: number;
};

function normalizeState(value: string | undefined) {
  if (value == null || value.length === 0) {
    return "";
  }

  return value.trim().toLowerCase();
}

function getStateStats(records: HistoryRecord[]): StateStats {
  return records.reduce<StateStats>(
    (accumulator, record) => {
      const state = normalizeState(record.estado);

      if (
        state === HistoryRecordState.Aberto ||
        state === HistoryRecordState.Open
      ) {
        return {
          ...accumulator,
          open: accumulator.open + 1,
          total: accumulator.total + 1,
        };
      }

      if (
        state === HistoryRecordState.Fechado ||
        state === HistoryRecordState.Closed
      ) {
        return {
          ...accumulator,
          closed: accumulator.closed + 1,
          total: accumulator.total + 1,
        };
      }

      return {
        ...accumulator,
        others: accumulator.others + 1,
        total: accumulator.total + 1,
      };
    },
    {
      open: 0,
      closed: 0,
      others: 0,
      total: 0,
    },
  );
}

function toPercent(value: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Number(((value / total) * 100).toFixed(1));
}

export function HistoryStateAnalysis({ records }: HistoryStateAnalysisProps) {
  const stats = useMemo(() => {
    return getStateStats(records);
  }, [records]);

  const openPercent = toPercent(stats.open, stats.total);
  const closedPercent = toPercent(stats.closed, stats.total);
  const othersPercent = toPercent(stats.others, stats.total);

  const chartBackground = `conic-gradient(
    var(--accent-blue) 0% ${openPercent}%,
    var(--accent-pink) ${openPercent}% ${openPercent + closedPercent}%,
    color-mix(in srgb, var(--text-subtle) 35%, transparent) ${openPercent + closedPercent}% 100%
  )`;

  return (
    <Card className="surface-card h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">State Analysis</CardTitle>
        <CardDescription>
          Percentage distribution for the <code>estado</code> field (Open vs
          Closed).
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {stats.total === 0 ? (
          <p className="text-sm text-[color:var(--text-subtle)]">
            No state data available.
          </p>
        ) : (
          <>
            <div className="mx-auto grid size-44 place-items-center rounded-full p-4" style={{ background: chartBackground }}>
              <div className="grid size-full place-items-center rounded-full bg-[color:var(--surface-card)]">
                <div className="text-center">
                  <p className="text-[11px] text-[color:var(--text-subtle)]">
                    Records
                  </p>
                  <p className="text-lg font-semibold text-[color:var(--text-strong)]">
                    {stats.total}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-[color:var(--accent-blue)]" />
                  <span>Open</span>
                </div>
                <span className="font-medium">
                  {openPercent}% ({stats.open})
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-[color:var(--accent-pink)]" />
                  <span>Closed</span>
                </div>
                <span className="font-medium">
                  {closedPercent}% ({stats.closed})
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-[color:var(--text-subtle)]/40" />
                  <span>Others/Unknown</span>
                </div>
                <span className="font-medium">
                  {othersPercent}% ({stats.others})
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
