import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Flame, Ticket, Music, LogOut, LogIn, User } from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-zinc-950/80 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <Flame className="w-7 h-7 text-amber-500 group-hover:scale-110 transition-transform" />
            <span className="font-extrabold text-xl tracking-wider text-amber-500">
              BRF<span className="text-zinc-100">22</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/lineup"
              className="flex items-center gap-1.5 text-zinc-300 hover:text-amber-400 font-medium transition-colors text-sm"
            >
              <Music className="w-4 h-4" />
              Line Up
            </Link>
            <Link
              to="/tickets"
              className="flex items-center gap-1.5 text-zinc-300 hover:text-amber-400 font-medium transition-colors text-sm"
            >
              <Ticket className="w-4 h-4" />
              Tickets
            </Link>
            {user && (
              <Link
                to="/my-tickets"
                className="flex items-center gap-1.5 text-zinc-300 hover:text-amber-400 font-medium transition-colors text-sm"
              >
                My Tickets
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-zinc-800">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <User className="w-4 h-4 text-amber-500" />
                  <span className="text-zinc-200 font-semibold">{user.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded-md transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1 text-xs bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-2 rounded-md transition-all shadow-md shadow-amber-500/10"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

