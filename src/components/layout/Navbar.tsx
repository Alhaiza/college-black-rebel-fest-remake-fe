import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Flame, Ticket, Music, LogOut, LogIn, User, ShieldAlert } from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-[var(--color-paper)] border-b border-[var(--color-rule)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <Flame className="w-6 h-6 text-[var(--color-accent)] motion-safe:transition-transform group-hover:scale-105" />
            <span className="font-display text-2xl tracking-normal text-[var(--color-ink)]">
              BLACK REBEL <span className="text-[var(--color-accent)]">2022</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/lineup"
              className="flex items-center gap-1.5 text-[var(--color-ink-2)] hover:text-[var(--color-accent)] font-medium transition-colors text-sm"
            >
              <Music className="w-4 h-4" />
              Lineup
            </Link>
            <Link
              to="/tickets"
              className="flex items-center gap-1.5 text-[var(--color-ink-2)] hover:text-[var(--color-accent)] font-medium transition-colors text-sm"
            >
              <Ticket className="w-4 h-4" />
              Tickets
            </Link>
            {user && user.role !== "admin" && (
              <Link
                to="/my-tickets"
                className="flex items-center gap-1.5 text-[var(--color-ink-2)] hover:text-[var(--color-accent)] font-medium transition-colors text-sm"
              >
                My tickets
              </Link>
            )}

            {/* Tautan Khusus Admin */}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 text-[var(--color-accent)] hover:text-[var(--color-ink)] font-medium transition-colors text-sm bg-[var(--color-paper-2)] px-3 py-1 border border-[var(--color-rule)]"
              >
                <ShieldAlert className="w-4 h-4" />
                Admin panel
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-[var(--color-rule)]">
                <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
                  <User className="w-4 h-4 text-[var(--color-accent)]" />
                  <span className="text-[var(--color-ink)] font-medium">{user.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs bg-[var(--color-paper-2)] hover:bg-[var(--color-paper-3)] text-[var(--color-ink)] px-3 py-1.5 border border-[var(--color-rule)] transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-xs bg-[var(--color-accent)] hover:bg-[var(--color-accent-deep)] text-[var(--color-accent-ink)] font-bold px-4 py-2 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
