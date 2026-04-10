"use client";

import { useSessionStore } from "@/store/sessionStore";

export function useSessionState() {
  const hasHydrated = useSessionStore((state) => state.hasHydrated);
  const jwtToken = useSessionStore((state) => state.jwtToken);
  const tokenExp = useSessionStore((state) => state.tokenExp);
  const vehicles = useSessionStore((state) => state.vehicles);
  const packageTypes = useSessionStore((state) => state.packageTypes);
  const status = useSessionStore((state) => state.status);
  const errorMessage = useSessionStore((state) => state.errorMessage);

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
