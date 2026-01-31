"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClientConfig } from "@/lib/getQueryClient";
import { ReactNode, useState } from "react";

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient(queryClientConfig));

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
