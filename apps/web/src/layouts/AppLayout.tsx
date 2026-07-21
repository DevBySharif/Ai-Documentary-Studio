import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/ui/Sidebar";

interface AppLayoutProps {
  onLogout: () => void;
}

export function AppLayout({ onLogout }: AppLayoutProps) {
  return (
    <div className="flex h-screen">
      <Sidebar onLogout={onLogout} />
      <main className="ml-60 flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
