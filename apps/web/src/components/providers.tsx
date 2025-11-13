"use client";

import { Provider as AiProvider } from "@ai-sdk-tools/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      <NuqsAdapter>
        <QueryClientProvider client={queryClient}>
          <AiProvider>{children}</AiProvider>
        </QueryClientProvider>
      </NuqsAdapter>
      <Toaster richColors />
    </ThemeProvider>
  );
}
