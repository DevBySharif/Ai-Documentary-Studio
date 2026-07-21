import React, { ReactNode } from "react";
import { ErrorBoundary } from "../errors/error-boundary";

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Composition root for all React context providers.
 * Keeps the App root clean and groups all global state setups in one place.
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      {/* 
        In a real app, you would nest other providers here:
        <ThemeProvider>
          <QueryProvider>
            <StoreProvider>
              {children}
            </StoreProvider>
          </QueryProvider>
        </ThemeProvider>
      */}
      {children}
    </ErrorBoundary>
  );
};
