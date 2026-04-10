"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "react-toastify";

import {
  requestSilentSession,
  silentSessionQueryKey,
} from "@/services/silentSessionApi";
import { useTranslate } from "@/hooks/useTranslate";
import { useSessionStore } from "@/store/sessionStore";
import { SessionStatus } from "@/types/enums";
import { isTokenExpired } from "@/utils/jwt";

export function useSilentSessionInitializer() {
  const { t, hasTranslation } = useTranslate();
  const hasHydrated = useSessionStore((state) => state.hasHydrated);
  const jwtToken = useSessionStore((state) => state.jwtToken);
  const tokenExp = useSessionStore((state) => state.tokenExp);
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
          : "errors.session.silentLoginFailed",
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
      return;
    }

    const message = hasTranslation(errorMessage)
      ? t(errorMessage)
      : errorMessage;

    toast.error(message, {
      toastId: `session-error-${message}`,
    });
  }, [errorMessage, hasTranslation, status, t]);
}
