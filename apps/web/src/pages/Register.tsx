import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useAuth } from "@/hooks/useAuth";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (
    name: string,
    email: string,
    password: string
  ) => {
    setIsLoading(true);
    try {
      await register(name, email, password);
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
          <p className="mt-2 text-sm text-gray-400">Create your account</p>
        </div>

        <div className="rounded-xl border bg-surface-200 p-6">
          <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
        </div>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-accent-light hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
