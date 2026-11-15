import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { Flame, AlertCircle } from "lucide-react";

export const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/register", { username, email, password });
      if (res.data.success) {
        navigate("/login");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 border border-[var(--color-rule)] bg-[var(--color-paper-2)]">
        <div className="flex flex-col items-center mb-8">
          <Flame className="w-8 h-8 text-[var(--color-accent)] mb-2" />
          <h2 className="text-3xl font-display font-medium text-[var(--color-ink)] uppercase">Create an Account</h2>
          <p className="text-xs text-[var(--color-muted)]">Join Black Rebel Festival community</p>
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
              placeholder="e.g. rebel_rocker"
              className="w-full px-3.5 py-2.5 bg-[var(--color-paper)] border border-[var(--color-rule)] text-[var(--color-ink)] text-sm focus:border-[var(--color-accent)] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-muted)] mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rocker@example.com"
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
              placeholder="At least 6 characters"
              className="w-full px-3.5 py-2.5 bg-[var(--color-paper)] border border-[var(--color-rule)] text-[var(--color-ink)] text-sm focus:border-[var(--color-accent)] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[var(--color-accent)] hover:bg-[var(--color-accent-deep)] text-[var(--color-accent-ink)] font-bold font-display text-sm uppercase transition-colors disabled:opacity-50"
          >
            {loading ? "Creating Account…" : "Register Now"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[var(--color-muted)]">
          Already have an account?{" "}
          <Link to="/login" className="text-[var(--color-accent)] font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
