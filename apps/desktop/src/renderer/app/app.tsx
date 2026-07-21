import React from "react";
import { AppProviders } from "../providers";
import { AppRouter } from "../routes";

/**
 * Main application component.
 * Responsible strictly for composing providers and initializing the router.
 */
export const App: React.FC = () => {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
};
