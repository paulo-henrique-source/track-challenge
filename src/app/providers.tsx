"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";

import { useSilentSessionInitializer } from "@/hooks";

type ProvidersProps = {
  children: ReactNode;
};

function SessionInitializerRunner() {
  useSilentSessionInitializer();
  return null;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SessionInitializerRunner />
      {children}
    </QueryClientProvider>
  );
}
