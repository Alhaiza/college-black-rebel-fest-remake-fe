/**
 * ============================================================================
 * [ADMIN LAYOUT SHELL] - src/components/admin/AdminLayout.tsx
 * ============================================================================
 * 
 * Layout dashboard admin dengan Sidebar navigasi modern bertema gelap.
 */

import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Layers, ShoppingBag, QrCode, LogOut, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const AdminLayout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: "Overview", path: "/admin", icon: LayoutDashboard },
    { name: "Ticket Tiers", path: "/admin/tiers", icon: Layers },
    { name: "All Orders", path: "/admin/orders", icon: ShoppingBag },
    { name: "Gate Scanner", path: "/admin/scanner", icon: QrCode },
  ];

  return (
    <div className="min-h-screen flex bg-zinc-950 text-zinc-100 font-sans">
      {/* Sidebar Navigasi Admin */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900/60 backdrop-blur flex flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <span className="font-black text-xl tracking-wider text-amber-500">
              BRF22 <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">PANEL</span>
            </span>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="space-y-2 pt-6 border-t border-zinc-800">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Ke Festival Publik
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Keluar (Logout)
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

