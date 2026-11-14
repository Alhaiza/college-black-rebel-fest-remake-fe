/**
 * ============================================================================
 * [ADMIN TIERS MANAGEMENT] - src/pages/admin/AdminTiersPage.tsx
 * ============================================================================
 * 
 * Halaman restock kuota dan perubahan harga tiket festival dengan proteksi
 * anti-kuota-negatif dari sisi backend.
 */

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";
import type { TicketTier } from "../../types";
import { Edit2, Check, X, AlertCircle } from "lucide-react";

export const AdminTiersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [editingTier, setEditingTier] = useState<TicketTier | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editTotalQuota, setEditTotalQuota] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { data: tiers, isLoading } = useQuery<TicketTier[]>({
    queryKey: ["ticketTiers"],
    queryFn: async () => {
      const res = await api.get("/tickets/tiers");
      return res.data.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, price, totalQuota }: { id: string; price: number; totalQuota: number }) => {
      const res = await api.patch(`/admin/tiers/${id}`, { price, totalQuota });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticketTiers"] });
      queryClient.invalidateQueries({ queryKey: ["adminAnalytics"] });
      setEditingTier(null);
      setErrorMessage("");
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Gagal memperbarui data tier tiket.";
      setErrorMessage(msg);
    },
  });

  const handleStartEdit = (tier: TicketTier) => {
    setEditingTier(tier);
    setEditPrice(tier.price);
    setEditTotalQuota(tier.totalQuota);
    setErrorMessage("");
  };

  const handleSaveEdit = () => {
    if (!editingTier) return;
    updateMutation.mutate({
      id: editingTier._id,
      price: editPrice,
      totalQuota: editTotalQuota,
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Ticket Tier Management</h1>
        <p className="text-zinc-400 text-sm">
          Kelola harga dan restock kapasitas kuota tiket festival (Bronze, Silver, Gold).
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {isLoading ? (
        <div className="text-zinc-500">Memuat kategori tiket...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers?.map((tier) => {
            const isEditing = editingTier?._id === tier._id;
            const soldCount = tier.totalQuota - tier.availableQuota;

            return (
              <div
                key={tier._id}
                className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 font-mono">
                      {soldCount} Terjual
                    </span>
                  </div>

                  {isEditing ? (
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-400 mb-1">
                          Harga Tiket (Rp)
                        </label>
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-400 mb-1">
                          Total Kuota (Min: {soldCount})
                        </label>
                        <input
                          type="number"
                          value={editTotalQuota}
                          onChange={(e) => setEditTotalQuota(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-white text-sm"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 mb-6">
                      <div>
                        <div className="text-xs text-zinc-400">Harga Tiket</div>
                        <div className="text-2xl font-black text-white">
                          Rp {tier.price.toLocaleString("id-ID")}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-zinc-800">
                        <div>
                          <span className="text-zinc-500">Sisa Kuota:</span>
                          <div className="font-bold text-amber-400 text-sm font-mono">
                            {tier.availableQuota}
                          </div>
                        </div>
                        <div>
                          <span className="text-zinc-500">Total Kapasitas:</span>
                          <div className="font-bold text-zinc-200 text-sm font-mono">
                            {tier.totalQuota}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveEdit}
                      disabled={updateMutation.isPending}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      {updateMutation.isPending ? "Menyimpan..." : "Simpan"}
                    </button>
                    <button
                      onClick={() => setEditingTier(null)}
                      className="px-3 py-2 rounded-lg bg-zinc-800 text-zinc-300 font-bold text-xs hover:bg-zinc-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleStartEdit(tier)}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Restock / Ubah Harga
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
