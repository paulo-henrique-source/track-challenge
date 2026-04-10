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
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

import { useSessionState } from "@/src/hooks/useSessionState";
import { requestHistory } from "@/src/services/historyApi";
import { SessionStatus } from "@/src/types/enums";
import type { HistoryRequest } from "@/src/types/history";

const MAX_RANGE_HOURS = 48;
const MAX_RANGE_MILLISECONDS = MAX_RANGE_HOURS * 60 * 60 * 1000;
const MAX_END_DATE_FUTURE_DAYS = 45;

// Temporary local mock while dashboard development is in progress.
// Set to false to restore real payload based on filters.
const USE_HISTORY_REQUEST_MOCK = true;

const MOCK_HISTORY_REQUEST: Omit<HistoryRequest, "token"> = {
  inicio: "2026-04-07 00:00:00",
  fim: "2026-04-08 00:00:00",
  tipos_pacotes: "1,2,3,4",
  veiccodigo: "024",
};

function formatApiDate(date: Date) {
  return formatDate(date, "yyyy-MM-dd HH:mm:ss");
}

function getHistoryRecordsCount(response: unknown) {
  if (Array.isArray(response)) {
    return response.length;
  }

  if (response == null) {
    return 0;
  }

  if (typeof response === "object") {
    const objectResponse = response as Record<string, unknown>;

    if (Array.isArray(objectResponse.data)) {
      return objectResponse.data.length;
    }

    if (Array.isArray(objectResponse.historico)) {
      return objectResponse.historico.length;
    }

    return Object.keys(objectResponse).length;
  }

  return 0;
}

function showValidationError(message: string) {
  toast.error(message, {
    toastId: `validation-${message}`,
  });
}

export function useTrackingDashboard() {
  const { jwtToken, vehicles, packageTypes, status } = useSessionState();

  const [vehicleCode, setVehicleCode] = useState("");
  const [packageTypeCodes, setPackageTypeCodes] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

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

  const lastHistoryErrorRef = useRef<string | null>(null);

  const historyMutation = useMutation({
    mutationFn: requestHistory,
  });

  const isSessionReady = status === SessionStatus.Authenticated;

  const onlineVehiclesCount = useMemo(() => {
    return vehicles.filter((vehicle) => vehicle.veicorigemrastonline === "1").length;
  }, [vehicles]);

  const historyRecordsCount = useMemo(() => {
    return getHistoryRecordsCount(historyMutation.data);
  }, [historyMutation.data]);

  useEffect(() => {
    if (!(historyMutation.error instanceof Error)) {
      lastHistoryErrorRef.current = null;
      return;
    }

    const message = historyMutation.error.message;

    if (lastHistoryErrorRef.current === message) {
      return;
    }

    lastHistoryErrorRef.current = message;
    toast.error(message, {
      toastId: `history-error-${message}`,
    });
  }, [historyMutation.error]);

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
      showValidationError("Maximum allowed range between start and end is 48 hours.");
      return;
    }

    const payload: HistoryRequest = {
      inicio: formatApiDate(startDate),
      fim: formatApiDate(endDate),
      tipos_pacotes: packageTypeCodes.length > 0 ? packageTypeCodes.join(",") : "",
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
