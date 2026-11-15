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
    refetchInterval: 10000,
  });

  if (isLoading) return <div className="text-[var(--color-muted)]">Memuat statistik festival…</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-display font-light text-[var(--color-ink)] mb-2 uppercase">
          Festival Management <span className="text-[var(--color-accent)] font-normal">Dashboard</span>
        </h1>
        <p className="text-[var(--color-muted)] text-sm">
          Pantau omzet penjualan tiket, inventaris kapasitas kuota, dan statistik peserta festival.
        </p>
      </div>

      {/* Kartu Ringkasan Metrik */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="p-6 bg-[var(--color-paper-2)] border border-[var(--color-rule)]">
          <div className="flex items-center justify-between text-[var(--color-muted)] mb-2">
            <span className="text-xs font-medium">Total omzet</span>
            <DollarSign className="w-5 h-5 text-[var(--color-accent)]" />
          </div>
          <div className="text-3xl font-display font-light text-[var(--color-ink)]">
            Rp {(data?.totalRevenue || 0).toLocaleString("id-ID")}
          </div>
        </div>

        <div className="p-6 bg-[var(--color-paper-2)] border border-[var(--color-rule)]">
          <div className="flex items-center justify-between text-[var(--color-muted)] mb-2">
            <span className="text-xs font-medium">Tiket terjual</span>
            <Ticket className="w-5 h-5 text-[var(--color-success)]" />
          </div>
          <div className="text-3xl font-display font-light text-[var(--color-ink)]">{data?.totalTicketsSold || 0} Tiket</div>
        </div>

        <div className="p-6 bg-[var(--color-paper-2)] border border-[var(--color-rule)]">
          <div className="flex items-center justify-between text-[var(--color-muted)] mb-2">
            <span className="text-xs font-medium">Total transaksi</span>
            <CheckCircle className="w-5 h-5 text-[var(--color-accent)]" />
          </div>
          <div className="text-3xl font-display font-light text-[var(--color-ink)]">{data?.totalOrders || 0} Order</div>
        </div>

        <div className="p-6 bg-[var(--color-paper-2)] border border-[var(--color-rule)]">
          <div className="flex items-center justify-between text-[var(--color-muted)] mb-2">
            <span className="text-xs font-medium">User terdaftar</span>
            <Users className="w-5 h-5 text-[var(--color-muted)]" />
          </div>
          <div className="text-3xl font-display font-light text-[var(--color-ink)]">{data?.activeUsersCount || 0} User</div>
        </div>
      </div>

      {/* Status Inventaris Kuota per Tier */}
      <div className="p-6 bg-[var(--color-paper-2)] border border-[var(--color-rule)]">
        <h2 className="text-2xl font-display font-medium text-[var(--color-ink)] mb-4 uppercase">Status inventaris kuota tiket</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[var(--color-ink-2)]">
            <thead className="text-xs bg-[var(--color-paper)] text-[var(--color-muted)] border-b border-[var(--color-rule)]">
              <tr>
                <th className="py-3 px-4 font-normal">Kategori tier</th>
                <th className="py-3 px-4 font-normal">Harga tiket</th>
                <th className="py-3 px-4 font-normal">Sisa kuota</th>
                <th className="py-3 px-4 font-normal">Total kapasitas</th>
                <th className="py-3 px-4 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.tiers.map((tier: any) => (
                <tr key={tier._id} className="border-b border-[var(--color-rule)]">
                  <td className="py-3 px-4 font-medium text-[var(--color-ink)]">{tier.name}</td>
                  <td className="py-3 px-4">Rp {tier.price.toLocaleString("id-ID")}</td>
                  <td className="py-3 px-4 font-display text-base text-[var(--color-accent)]">{tier.availableQuota}</td>
                  <td className="py-3 px-4 font-display text-base text-[var(--color-muted)]">{tier.totalQuota}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-2 py-0.5 border font-medium ${
                        tier.availableQuota <= 0
                          ? "border-[var(--color-error)] text-[var(--color-error)]"
                          : "border-[var(--color-success)] text-[var(--color-success)]"
                      }`}
                    >
                      {tier.availableQuota <= 0 ? "Habis" : "Tersedia"}
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
