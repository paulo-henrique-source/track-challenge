"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

import {
  requestSilentSession,
  silentSessionQueryKey,
} from "@/src/services/silentSessionApi";
import { useSessionStore } from "@/src/store";
import { SessionStatus } from "@/src/types/enums";
import { isTokenExpired } from "@/src/utils/jwt";

export function useSilentSessionInitializer() {
  const hasHydrated = useSessionStore((state) => state.hasHydrated);
  const jwtToken = useSessionStore((state) => state.jwtToken);
  const tokenExp = useSessionStore((state) => state.tokenExp);
  const status = useSessionStore((state) => state.status);
  const errorMessage = useSessionStore((state) => state.errorMessage);
  const setStatus = useSessionStore((state) => state.setStatus);
  const setSession = useSessionStore((state) => state.setSession);
  const clearSession = useSessionStore((state) => state.clearSession);

  const lastSessionErrorRef = useRef<string | null>(null);

  const hasToken = Boolean(jwtToken);
  const hasExpiration = typeof tokenExp === "number";
  const hasValidToken = hasToken && hasExpiration && !isTokenExpired(tokenExp);
  const hasExpiredToken = hasToken && hasExpiration && isTokenExpired(tokenExp);

  const shouldFetchSilentSession =
    hasHydrated &&
    !hasValidToken &&
    !hasExpiredToken &&
    status !== SessionStatus.Error;

  const silentSessionQuery = useQuery({
    queryKey: silentSessionQueryKey,
    queryFn: requestSilentSession,
    enabled: shouldFetchSilentSession,
    staleTime: 0,
  });

  useEffect(() => {
    if (!hasHydrated || hasValidToken) {
      return;
    }

    if (silentSessionQuery.isFetching) {
      if (status !== SessionStatus.Loading) {
        setStatus(SessionStatus.Loading);
      }
      return;
    }

    if (
      silentSessionQuery.isSuccess &&
      status !== SessionStatus.Authenticated
    ) {
      setSession(silentSessionQuery.data);
      return;
    }

    if (silentSessionQuery.isError && status !== SessionStatus.Error) {
      clearSession();
      setStatus(
        SessionStatus.Error,
        silentSessionQuery.error instanceof Error
          ? silentSessionQuery.error.message
          : "Silent login failed",
      );
    }
  }, [
    clearSession,
    hasHydrated,
    hasValidToken,
    setSession,
    setStatus,
    silentSessionQuery.data,
    silentSessionQuery.error,
    silentSessionQuery.isError,
    silentSessionQuery.isFetching,
    silentSessionQuery.isSuccess,
    status,
  ]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (hasValidToken) {
      if (status !== SessionStatus.Authenticated) {
        setStatus(SessionStatus.Authenticated);
      }
      return;
    }

    if (hasExpiredToken) {
      clearSession();
    }
  }, [
    clearSession,
    hasExpiredToken,
    hasHydrated,
    hasValidToken,
    setStatus,
    status,
  ]);

  useEffect(() => {
    if (status !== SessionStatus.Error || !errorMessage) {
      lastSessionErrorRef.current = null;
      return;
    }

    if (lastSessionErrorRef.current === errorMessage) {
      return;
    }

    lastSessionErrorRef.current = errorMessage;
    toast.error(errorMessage, {
      toastId: `session-error-${errorMessage}`,
    });
  }, [errorMessage, status]);
}
