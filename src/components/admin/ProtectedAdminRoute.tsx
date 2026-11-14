/**
 * ============================================================================
 * [PROTECTED ADMIN ROUTE WRAPPER]
 * src/components/admin/ProtectedAdminRoute.tsx
 * ============================================================================
 * 
 * Memastikan hanya user yang memiliki `role === 'admin'` yang dapat mengakses
 * rute anak di `/admin/*`. User reguler atau tamu akan otomatis diarahkan ke homepage.
 */

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const ProtectedAdminRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-500">
        Memverifikasi hak akses administrator...
      </div>
    );
  }

  // Jika belum login atau bukan admin, arahkan ke beranda
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

