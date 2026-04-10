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
  MOCK_HISTORY_REQUEST,
  USE_HISTORY_REQUEST_MOCK,
} from "@/consts";
import { useSessionState } from "@/hooks/useSessionState";
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
      const message =
        error instanceof Error
          ? error.message
          : "Unexpected history request error";

      showValidationError(message, `history-error-${message}`);
    },
  });

  const historyRecords = historyMutation.data ?? [];
  const historyRecordsCount = historyRecords.length;

  const submitHistory = () => {
    if (!jwtToken) {
      showValidationError("Session token unavailable. Wait for silent login.");
      return;
    }

    if (USE_HISTORY_REQUEST_MOCK) {
      historyMutation.mutate({
        ...MOCK_HISTORY_REQUEST,
        token: jwtToken,
      });
      return;
    }

    if (!vehicleCode) {
      showValidationError("Vehicle selection is required.");
      return;
    }

    if (!startDate || !endDate) {
      showValidationError("Start and end dates are required.");
      return;
    }

    if (endDate > maxEndDateFromFuture) {
      showValidationError("End date cannot be more than 45 days from today.");
      return;
    }

    if (startDate > endDate) {
      showValidationError("Start date must be before end date.");
      return;
    }

    const rangeInMilliseconds = differenceInMilliseconds(endDate, startDate);

    if (rangeInMilliseconds > MAX_RANGE_MILLISECONDS) {
      showValidationError(
        "Maximum allowed range between start and end is 48 hours.",
      );
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
