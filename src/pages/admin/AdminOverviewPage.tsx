/**
 * ============================================================================
 * [ADMIN OVERVIEW PAGE] - src/pages/admin/AdminOverviewPage.tsx
 * ============================================================================
 * 
 * Tampilan analitik ringkasan finansial, tiket terjual, dan status kuota real-time.
 */

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../services/api";
import { DollarSign, Ticket, Users, CheckCircle } from "lucide-react";

export const AdminOverviewPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["adminAnalytics"],
    queryFn: async () => {
      const res = await api.get("/admin/analytics");
      return res.data.data;
    },
    refetchInterval: 10000, // Auto-refresh setiap 10 detik
  });

  if (isLoading) return <div className="text-zinc-500">Memuat statistik festival...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Festival Management Dashboard</h1>
        <p className="text-zinc-400 text-sm">
          Pantau omzet penjualan tiket, inventaris kapasitas kuota, dan statistik peserta festival.
        </p>
      </div>

      {/* Kartu Ringkasan Metrik */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Omzet</span>
            <DollarSign className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-white">
            Rp {(data?.totalRevenue || 0).toLocaleString("id-ID")}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Tiket Terjual</span>
            <Ticket className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-white">{data?.totalTicketsSold || 0} Tiket</div>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Transaksi</span>
            <CheckCircle className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-white">{data?.totalOrders || 0} Order</div>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">User Terdaftar</span>
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-white">{data?.activeUsersCount || 0} User</div>
        </div>
      </div>

      {/* Status Inventaris Kuota per Tier */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <h2 className="text-lg font-bold text-white mb-4">Status Inventaris Kuota Tiket</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="text-xs uppercase bg-zinc-950 text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Kategori Tier</th>
                <th className="py-3 px-4">Harga Tiket</th>
                <th className="py-3 px-4">Sisa Kuota</th>
                <th className="py-3 px-4">Total Kapasitas</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.tiers.map((tier: any) => (
                <tr key={tier._id} className="border-b border-zinc-800/60">
                  <td className="py-3 px-4 font-bold text-white">{tier.name}</td>
                  <td className="py-3 px-4">Rp {tier.price.toLocaleString("id-ID")}</td>
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">{tier.availableQuota}</td>
                  <td className="py-3 px-4 font-mono">{tier.totalQuota}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        tier.availableQuota <= 0
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {tier.availableQuota <= 0 ? "SOLD OUT" : "AVAILABLE"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

