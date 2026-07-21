import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";

// Ensure global styles are imported here if needed
// import "../styles/globals.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find the root element.");
}

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
