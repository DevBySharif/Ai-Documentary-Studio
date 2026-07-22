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
 * Renders the production-grade multi-pane desktop workspace.
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
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100vw", backgroundColor: "#0f172a", color: "#f8fafc" }}>
      {/* Top Toolbar */}
      {toolbar && (
        <header style={{ height: "48px", backgroundColor: "#1e293b", borderBottom: "1px solid #334155", display: "flex", alignItems: "center", padding: "0 16px", flexShrink: 0 }}>
          {toolbar}
        </header>
      )}

      {/* Main Content Area */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left Sidebar */}
        {sidebar && (
          <aside style={{ width: "240px", backgroundColor: "#1e293b", borderRight: "1px solid #334155", flexShrink: 0, overflowY: "auto" }}>
            {sidebar}
          </aside>
        )}

        {/* Center Workspace */}
        <main style={{ flex: 1, backgroundColor: "#0f172a", overflowY: "auto", display: "flex", flexDirection: "column" }}>
          {workspace}
        </main>

        {/* Right Inspector */}
        {inspector && (
          <aside style={{ width: "280px", backgroundColor: "#1e293b", borderLeft: "1px solid #334155", flexShrink: 0, overflowY: "auto" }}>
            {inspector}
          </aside>
        )}
      </div>

      {/* Bottom Timeline */}
      {timeline && (
        <section style={{ height: "180px", backgroundColor: "#0f172a", borderTop: "1px solid #334155", flexShrink: 0, overflowY: "auto" }}>
          {timeline}
        </section>
      )}

      {/* Status Bar */}
      {statusBar && (
        <footer style={{ height: "24px", backgroundColor: "#020617", borderTop: "1px solid #1e293b", display: "flex", alignItems: "center", padding: "0 12px", fontSize: "11px", color: "#94a3b8", flexShrink: 0 }}>
          {statusBar}
        </footer>
      )}
    </div>
  );
};
