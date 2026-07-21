import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { LoginPage } from "@/pages/Login";
import { RegisterPage } from "@/pages/Register";
import { DashboardPage } from "@/pages/Dashboard";
import { ProjectPage } from "@/pages/Project";
import { ScriptPage } from "@/pages/Script";
import { PromptPackPage } from "@/pages/PromptPack";
import { ImagesPage } from "@/pages/Images";
import { VoicePage } from "@/pages/Voice";
import { TimelinePage } from "@/pages/Timeline";
import { PreviewPage } from "@/pages/Preview";
import { SettingsPage } from "@/pages/Settings";
import { useAuth } from "@/hooks/useAuth";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-100">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function LogoutHandler({ onLogout }: { onLogout: () => void }) {
  return <Navigate to="/login" replace />;
}

export function App() {
  const { logout } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout onLogout={logout} />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects/new" element={<ProjectPage />} />
          <Route path="/projects/:id" element={<ProjectPage />} />
          <Route path="/script" element={<ScriptPage />} />
          <Route path="/prompts" element={<PromptPackPage />} />
          <Route path="/images" element={<ImagesPage />} />
          <Route path="/voice" element={<VoicePage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/logout" element={<LogoutHandler onLogout={logout} />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
