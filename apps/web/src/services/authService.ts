import { api } from "./api";
import type { User } from "@/types";

interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>("/auth/login", { email, password }),

  register: (name: string, email: string, password: string) =>
    api.post<AuthResponse>("/auth/register", { name, email, password }),

  logout: () => api.post<void>("/auth/logout", {}),

  getProfile: () => api.get<User>("/auth/profile"),
};
