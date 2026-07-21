import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-100">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-accent">AI Documentary</h1>
          <p className="mt-2 text-sm text-gray-400">Sign in to your account</p>
        </div>

        <div className="rounded-xl border bg-surface-200 p-6">
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
        </div>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-accent-light hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
