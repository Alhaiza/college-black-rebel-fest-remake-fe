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
    <div className="min-h-screen flex bg-[var(--color-paper)] text-[var(--color-ink)] font-body">
      {/* Sidebar Navigasi Admin */}
      <aside className="w-64 border-r border-[var(--color-rule)] bg-[var(--color-paper-2)] flex flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <span className="font-display text-2xl uppercase tracking-normal text-[var(--color-ink)]">
              BRF22 <span className="text-xs px-2 py-0.5 bg-[var(--color-paper-3)] text-[var(--color-accent)] border border-[var(--color-rule)] font-sans">Panel</span>
            </span>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-bold"
                      : "text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper-3)]"
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="space-y-2 pt-6 border-t border-[var(--color-rule)]">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-3.5 py-2 text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper-3)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Ke festival publik
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2 text-xs font-medium text-[var(--color-error)] hover:bg-[var(--color-paper-3)] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Keluar (Sign out)
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
