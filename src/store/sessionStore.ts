"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { SessionStatus } from "@/types/enums/sessionStatus"
import type {
  PackageTypeRecord,
  SilentSessionPayload,
  VehicleRecord,
} from "@/types/session"

type SessionStore = {
  jwtToken: string | null
  tokenExp: number | null
  vehicles: VehicleRecord[]
  packageTypes: PackageTypeRecord[]
  status: SessionStatus
  errorMessage: string | null
  hasHydrated: boolean
  setHydrated: (value: boolean) => void
  setStatus: (status: SessionStatus, errorMessage?: string | null) => void
  setSession: (payload: SilentSessionPayload) => void
  clearSession: () => void
}

const persistedDefaults = {
  jwtToken: null,
  tokenExp: null,
  vehicles: [] as VehicleRecord[],
  packageTypes: [] as PackageTypeRecord[],
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      ...persistedDefaults,
      status: SessionStatus.Idle,
      errorMessage: null,
      hasHydrated: false,
      setHydrated: (value) => set({ hasHydrated: value }),
      setStatus: (status, errorMessage = null) => set({ status, errorMessage }),
      setSession: ({ jwtToken, tokenExp, vehicles, packageTypes }) =>
        set({
          jwtToken,
          tokenExp,
          vehicles,
          packageTypes,
          status: SessionStatus.Authenticated,
          errorMessage: null,
        }),
      clearSession: () =>
        set({
          ...persistedDefaults,
          status: SessionStatus.Idle,
          errorMessage: null,
        }),
    }),
    {
      name: "track-challenge-silent-session",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        jwtToken: state.jwtToken,
        tokenExp: state.tokenExp,
        vehicles: state.vehicles,
        packageTypes: state.packageTypes,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          state?.setStatus(SessionStatus.Error, "Failed to load persisted session")
        }

        state?.setHydrated(true)
      },
    }
  )
)
