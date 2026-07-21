import React from "react";
import { ApplicationShell } from "../layouts/application-shell";
import { TimelineContainer } from "../features/timeline";

/**
 * Mock Workspace Route.
 * In a real implementation this would use react-router-dom or tanstack-router.
 */
export const WorkspaceRoute: React.FC = () => {
  return (
    <ApplicationShell
      toolbar={<div>Toolbar</div>}
      sidebar={<div>Sidebar</div>}
      workspace={<div>Main Workspace View</div>}
      inspector={<div>Inspector Panel</div>}
      timeline={<TimelineContainer />}
      statusBar={<div>Status Bar</div>}
    />
  );
};

export const AppRouter: React.FC = () => {
  // Simplistic router mockup
  return <WorkspaceRoute />;
};
