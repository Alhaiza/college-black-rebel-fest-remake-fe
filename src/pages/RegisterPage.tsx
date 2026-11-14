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
      <div className="w-full max-w-md p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur">
        <div className="flex flex-col items-center mb-8">
          <Flame className="w-10 h-10 text-amber-500 mb-2" />
          <h2 className="text-2xl font-black text-white">Create an Account</h2>
          <p className="text-xs text-zinc-400">Join Black Rebel Festival community</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. rebel_rocker"
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rocker@example.com"
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm rounded-lg transition-all shadow-md shadow-amber-500/10 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register Now"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-500">
          Already have an account?{" "}
          <Link to="/login" className="text-amber-500 font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
