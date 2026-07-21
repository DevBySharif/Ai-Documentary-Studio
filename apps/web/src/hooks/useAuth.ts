import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { authService } from "@/services/authService";

export function useAuth() {
  const { user, token, isLoading, setAuth, clearAuth, setLoading } =
    useAuthStore();

  useEffect(() => {
    if (token && !user) {
      setLoading(true);
      authService
        .getProfile()
        .then((user) => setAuth(user, token))
        .catch(() => clearAuth());
    }
  }, []);

  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login: async (email: string, password: string) => {
      const { user, token } = await authService.login(email, password);
      setAuth(user, token);
    },
    register: async (name: string, email: string, password: string) => {
      const { user, token } = await authService.register(name, email, password);
      setAuth(user, token);
    },
    logout: () => {
      authService.logout().catch(() => {});
      clearAuth();
    },
  };
}
