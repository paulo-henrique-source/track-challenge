"use client";

import { useMutation } from "@tanstack/react-query";
import {
  addDays,
  addHours,
  differenceInMilliseconds,
  endOfDay,
  format as formatDate,
  subHours,
} from "date-fns";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

import {
  MAX_END_DATE_FUTURE_DAYS,
  MAX_RANGE_HOURS,
  MAX_RANGE_MILLISECONDS,
} from "@/consts";
import { useSessionState } from "@/hooks/useSessionState";
import { useTranslate } from "@/hooks/useTranslate";
import { requestHistory } from "@/services/historyApi";
import { SessionStatus } from "@/types/enums";
import type { HistoryRequest } from "@/types/history";

function formatApiDate(date: Date) {
  return formatDate(date, "yyyy-MM-dd HH:mm:ss");
}

function showValidationError(message: string, toastId?: string) {
  toast.error(message, {
    toastId: toastId ?? `validation-${message}`,
  });
}

export function useTrackingDashboard() {
  const { t, hasTranslation } = useTranslate();
  const { jwtToken, vehicles, packageTypes, status } = useSessionState();

  const [vehicleCode, setVehicleCode] = useState("");
  const [packageTypeCodes, setPackageTypeCodes] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const isSessionReady = status === SessionStatus.Authenticated;

  const maxEndDateFromFuture = useMemo(() => {
    return endOfDay(addDays(new Date(), MAX_END_DATE_FUTURE_DAYS));
  }, []);

  const minStartDate = useMemo(() => {
    if (endDate == null) {
      return undefined;
    }

    return subHours(endDate, MAX_RANGE_HOURS);
  }, [endDate]);

  const maxStartDate = useMemo(() => {
    return endDate;
  }, [endDate]);

  const minEndDate = useMemo(() => {
    return startDate;
  }, [startDate]);

  const maxEndDateFromRange = useMemo(() => {
    if (startDate == null) {
      return undefined;
    }

    return addHours(startDate, MAX_RANGE_HOURS);
  }, [startDate]);

  const maxEndDate = useMemo(() => {
    if (maxEndDateFromRange == null) {
      return maxEndDateFromFuture;
    }

    if (maxEndDateFromRange.getTime() < maxEndDateFromFuture.getTime()) {
      return maxEndDateFromRange;
    }

    return maxEndDateFromFuture;
  }, [maxEndDateFromFuture, maxEndDateFromRange]);

  const onlineVehiclesCount = useMemo(() => {
    return vehicles.filter((vehicle) => vehicle.veicorigemrastonline === "1")
      .length;
  }, [vehicles]);

  const historyMutation = useMutation({
    mutationFn: requestHistory,
    onError: (error) => {
      const message = (() => {
        if (!(error instanceof Error)) {
          return t("errors.history.unexpectedHistoryRequest");
        }

        if (hasTranslation(error.message)) {
          return t(error.message);
        }

        return error.message;
      })();

      showValidationError(message, `history-error-${message}`);
    },
  });

  const historyRecords = historyMutation.data ?? [];
  const historyRecordsCount = historyRecords.length;

  const submitHistory = () => {
    if (!jwtToken) {
      showValidationError(t("errors.session.tokenUnavailable"));
      return;
    }

    if (!vehicleCode) {
      showValidationError(t("errors.history.vehicleRequired"));
      return;
    }

    if (!startDate || !endDate) {
      showValidationError(t("errors.history.startEndRequired"));
      return;
    }

    if (endDate > maxEndDateFromFuture) {
      showValidationError(t("errors.history.endDateMaxFuture"));
      return;
    }

    if (startDate > endDate) {
      showValidationError(t("errors.history.startBeforeEnd"));
      return;
    }

    const rangeInMilliseconds = differenceInMilliseconds(endDate, startDate);

    if (rangeInMilliseconds > MAX_RANGE_MILLISECONDS) {
      showValidationError(t("errors.history.rangeMax48h"));
      return;
    }

    const payload: HistoryRequest = {
      inicio: formatApiDate(startDate),
      fim: formatApiDate(endDate),
      tipos_pacotes:
        packageTypeCodes.length > 0 ? packageTypeCodes.join(",") : "",
      veiccodigo: vehicleCode,
      token: jwtToken,
    };

    historyMutation.mutate(payload);
  };

  const clearFilters = () => {
    setVehicleCode("");
    setPackageTypeCodes([]);
    setStartDate(undefined);
    setEndDate(undefined);
    historyMutation.reset();
  };

  return {
    vehicles,
    packageTypes,
    isSessionReady,
    onlineVehiclesCount,
    historyRecords,
    historyRecordsCount,
    historyPending: historyMutation.isPending,
    vehicleCode,
    packageTypeCodes,
    startDate,
    endDate,
    minStartDate,
    maxStartDate,
    minEndDate,
    maxEndDate,
    setVehicleCode,
    setPackageTypeCodes,
    setStartDate,
    setEndDate,
    submitHistory,
    clearFilters,
  };
}
