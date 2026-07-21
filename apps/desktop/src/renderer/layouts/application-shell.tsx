import React, { ReactNode } from "react";

interface ApplicationShellProps {
  toolbar?: ReactNode;
  sidebar?: ReactNode;
  workspace?: ReactNode;
  inspector?: ReactNode;
  timeline?: ReactNode;
  statusBar?: ReactNode;
}

/**
 * The canonical Application Shell Layout.
 * Defines the strict boundaries for various dockable panels.
 */
export const ApplicationShell: React.FC<ApplicationShellProps> = ({
  toolbar,
  sidebar,
  workspace,
  inspector,
  timeline,
  statusBar
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Top Toolbar */}
      {toolbar && <header>{toolbar}</header>}

      {/* Main Content Area */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left Sidebar */}
        {sidebar && <aside>{sidebar}</aside>}

        {/* Center Workspace */}
        <main style={{ flex: 1, overflow: "auto" }}>
          {workspace}
        </main>

        {/* Right Inspector */}
        {inspector && <aside>{inspector}</aside>}
      </div>

      {/* Bottom Timeline */}
      {timeline && <section>{timeline}</section>}

      {/* Status Bar */}
      {statusBar && <footer>{statusBar}</footer>}
    </div>
  );
};
