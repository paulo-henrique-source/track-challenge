"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import {
  requestSilentSession,
  silentSessionQueryKey,
} from "@/services/silentSessionApi";
import { useSessionStore } from "@/store/sessionStore";
import { SessionStatus } from "@/types/enums";
import { isTokenExpired } from "@/utils/jwt";

export function useSilentSession() {
  const hasHydrated = useSessionStore((state) => state.hasHydrated);
  const jwtToken = useSessionStore((state) => state.jwtToken);
  const tokenExp = useSessionStore((state) => state.tokenExp);
  const vehicles = useSessionStore((state) => state.vehicles);
  const packageTypes = useSessionStore((state) => state.packageTypes);
  const status = useSessionStore((state) => state.status);
  const errorMessage = useSessionStore((state) => state.errorMessage);
  const setStatus = useSessionStore((state) => state.setStatus);
  const setSession = useSessionStore((state) => state.setSession);
  const clearSession = useSessionStore((state) => state.clearSession);

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
    retry: false,
  });

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
      return;
    }

    if (silentSessionQuery.isFetching) {
      if (status !== SessionStatus.Loading) {
        setStatus(SessionStatus.Loading);
      }
      return;
    }

    if (silentSessionQuery.isSuccess) {
      setSession(silentSessionQuery.data);
      return;
    }

    if (silentSessionQuery.isError) {
      clearSession();
      setStatus(
        SessionStatus.Error,
        silentSessionQuery.error instanceof Error
          ? silentSessionQuery.error.message
          : "errors.session.silentLoginFailed",
      );
    }
  }, [
    clearSession,
    hasExpiredToken,
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

  return {
    hasHydrated,
    jwtToken,
    tokenExp,
    vehicles,
    packageTypes,
    status,
    errorMessage,
  };
}
