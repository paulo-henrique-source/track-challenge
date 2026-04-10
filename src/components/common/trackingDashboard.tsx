"use client";

import { useMutation } from "@tanstack/react-query";
import { differenceInMilliseconds, format as formatDate } from "date-fns";
import { Search, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

import { PackageTypesDropdown } from "@/components/common/packageTypesDropdown";
import { VehicleDropdown } from "@/components/common/vehicleDropdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/datePicker";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSessionState } from "@/hooks/useSessionState";
import { requestHistory } from "@/services/historyApi";
import { SessionStatus } from "@/types/enums";
import type { HistoryRequest } from "@/types/history";

const MAX_RANGE_HOURS = 48;
const MAX_RANGE_MILLISECONDS = MAX_RANGE_HOURS * 60 * 60 * 1000;

function normalizeStartDate(date: Date) {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

function normalizeEndDate(date: Date) {
  const normalized = new Date(date);
  normalized.setHours(23, 59, 59, 0);
  return normalized;
}

function formatApiDate(date: Date) {
  return formatDate(date, "yyyy-MM-dd HH:mm:ss");
}

function getSessionBadge(status: SessionStatus) {
  if (status === SessionStatus.Authenticated) {
    return <Badge variant='default'>Session active</Badge>;
  }

  if (status === SessionStatus.Loading) {
    return <Badge variant='secondary'>Session loading</Badge>;
  }

  if (status === SessionStatus.Error) {
    return <Badge variant='destructive'>Session error</Badge>;
  }

  return <Badge variant='outline'>Session idle</Badge>;
}

export function TrackingDashboard() {
  const { jwtToken, vehicles, packageTypes, status, errorMessage } = useSessionState();

  const [vehicleCode, setVehicleCode] = useState("");
  const [packageTypeCodes, setPackageTypeCodes] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [formError, setFormError] = useState<string | null>(null);
  const [lastPayload, setLastPayload] = useState<HistoryRequest | null>(null);

  const historicoMutation = useMutation({
    mutationFn: requestHistory,
  });

  const responsePreview = useMemo(() => {
    if (!historicoMutation.data) {
      return null;
    }

    return JSON.stringify(historicoMutation.data, null, 2);
  }, [historicoMutation.data]);

  const handleSubmit = () => {
    setFormError(null);

    if (!jwtToken) {
      setFormError("Session token unavailable. Wait for silent login.");
      return;
    }

    if (!vehicleCode) {
      setFormError("Vehicle selection is required.");
      return;
    }

    if (!startDate || !endDate) {
      setFormError("Start and end dates are required.");
      return;
    }

    const normalizedStart = normalizeStartDate(startDate);
    const normalizedEnd = normalizeEndDate(endDate);

    if (normalizedStart > normalizedEnd) {
      setFormError("Start date must be before end date.");
      return;
    }

    const rangeInMilliseconds = differenceInMilliseconds(normalizedEnd, normalizedStart);

    if (rangeInMilliseconds > MAX_RANGE_MILLISECONDS) {
      setFormError("Maximum allowed range between start and end is 48 hours.");
      return;
    }

    const payload: HistoryRequest = {
      inicio: formatApiDate(normalizedStart),
      fim: formatApiDate(normalizedEnd),
      tipos_pacotes:
        packageTypeCodes.length > 0 ? packageTypeCodes.join(",") : "-1",
      veiccodigo: vehicleCode,
      token: jwtToken,
    };

    setLastPayload(payload);
    historicoMutation.mutate(payload);
  };

  return (
    <main className='page-shell dashboard-shell'>
      <section className='page-container gap-6'>
        <Card className='surface-card border-0 p-1'>
          <CardHeader className='dashboard-hero'>
            <div className='flex flex-wrap items-start justify-between gap-3'>
              <div className='space-y-1'>
                <CardTitle className='text-2xl text-[color:var(--text-strong)]'>
                  Vehicle Tracking Dashboard
                </CardTitle>
                <CardDescription className='max-w-2xl text-[color:var(--text-subtle)]'>
                  Search trajectories with performance-focused filters. Session data,
                  vehicles and package types are loaded via silent login.
                </CardDescription>
              </div>

              <div className='flex items-center gap-2'>
                <ShieldCheck className='size-4 text-primary' />
                {getSessionBadge(status)}
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className='surface-card border-0'>
          <CardHeader>
            <CardTitle>Search Filters</CardTitle>
            <CardDescription>
              Vehicle is required. Date range supports up to 48 hours.
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-5'>
            <div className='dashboard-grid'>
              <div className='space-y-2 lg:col-span-2'>
                <Label>Vehicle *</Label>
                <VehicleDropdown
                  vehicles={vehicles}
                  value={vehicleCode}
                  onChange={setVehicleCode}
                  disabled={status !== SessionStatus.Authenticated}
                />
              </div>

              <div className='space-y-2 lg:col-span-2'>
                <Label>Package Types</Label>
                <PackageTypesDropdown
                  packageTypes={packageTypes}
                  values={packageTypeCodes}
                  onChange={setPackageTypeCodes}
                  disabled={status !== SessionStatus.Authenticated}
                />
              </div>

              <div className='space-y-2'>
                <Label>Start Date *</Label>
                <DatePicker
                  value={startDate}
                  onChange={setStartDate}
                  placeholder='Select start date'
                />
              </div>

              <div className='space-y-2'>
                <Label>End Date *</Label>
                <DatePicker
                  value={endDate}
                  onChange={setEndDate}
                  placeholder='Select end date'
                />
              </div>
            </div>

            <div className='flex flex-wrap items-center gap-3'>
              <Button
                type='button'
                size='lg'
                className='h-11 rounded-xl px-6'
                disabled={historicoMutation.isPending || status !== SessionStatus.Authenticated}
                onClick={handleSubmit}>
                <Search className='size-4' />
                {historicoMutation.isPending ? "Consulting..." : "Consultar"}
              </Button>

              <Button
                type='button'
                variant='ghost'
                size='lg'
                className='h-11 rounded-xl px-5'
                onClick={() => {
                  setVehicleCode("");
                  setPackageTypeCodes([]);
                  setStartDate(undefined);
                  setEndDate(undefined);
                  setFormError(null);
                  setLastPayload(null);
                  historicoMutation.reset();
                }}>
                Clear filters
              </Button>
            </div>

            {formError ? (
              <p className='text-sm font-medium text-destructive'>{formError}</p>
            ) : null}

            {status === SessionStatus.Error && errorMessage ? (
              <p className='text-sm font-medium text-destructive'>{errorMessage}</p>
            ) : null}
          </CardContent>
        </Card>

        <Card className='surface-card border-0'>
          <CardHeader>
            <CardTitle>Request/Response Preview</CardTitle>
            <CardDescription>
              Payload sent to <code>/api/historico</code> and latest response.
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <p className='text-sm font-semibold text-[color:var(--text-strong)]'>Payload</p>
              <pre className='dashboard-pre'>
                {lastPayload ? JSON.stringify(lastPayload, null, 2) : "No request sent yet."}
              </pre>
            </div>

            <Separator />

            <div className='space-y-2'>
              <p className='text-sm font-semibold text-[color:var(--text-strong)]'>Response</p>
              <pre className='dashboard-pre'>
                {historicoMutation.isPending
                  ? "Loading history data..."
                  : responsePreview ?? "No response yet."}
              </pre>
            </div>

            {historicoMutation.error instanceof Error ? (
              <p className='text-sm font-medium text-destructive'>
                {historicoMutation.error.message}
              </p>
            ) : null}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
