import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Flame, AlertCircle } from "lucide-react";

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { username, password });
      if (res.data.success) {
        login(res.data.data.token, res.data.data.user);
        navigate("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 border border-[var(--color-rule)] bg-[var(--color-paper-2)]">
        <div className="flex flex-col items-center mb-8">
          <Flame className="w-8 h-8 text-[var(--color-accent)] mb-2" />
          <h2 className="text-3xl font-display font-medium text-[var(--color-ink)] uppercase">Welcome Back</h2>
          <p className="text-xs text-[var(--color-muted)]">Sign in to manage and view your festival tickets</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-[var(--color-paper-3)] border border-[var(--color-error)] flex items-center gap-2 text-[var(--color-error)] text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--color-muted)] mb-1.5">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. johndoe"
              className="w-full px-3.5 py-2.5 bg-[var(--color-paper)] border border-[var(--color-rule)] text-[var(--color-ink)] text-sm focus:border-[var(--color-accent)] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-muted)] mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-[var(--color-paper)] border border-[var(--color-rule)] text-[var(--color-ink)] text-sm focus:border-[var(--color-accent)] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[var(--color-accent)] hover:bg-[var(--color-accent-deep)] text-[var(--color-accent-ink)] font-bold font-display text-sm uppercase transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[var(--color-muted)]">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[var(--color-accent)] font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
