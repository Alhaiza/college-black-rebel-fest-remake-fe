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
        <h1 className="text-4xl font-display font-light text-[var(--color-ink)] mb-2 uppercase">
          Ticket Tier <span className="text-[var(--color-accent)] font-normal">Management</span>
        </h1>
        <p className="text-[var(--color-muted)] text-sm">
          Kelola harga dan restock kapasitas kuota tiket festival (Bronze, Silver, Gold).
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-[var(--color-paper-2)] border border-[var(--color-error)] flex items-center gap-3 text-[var(--color-error)] text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {isLoading ? (
        <div className="text-[var(--color-muted)]">Memuat kategori tiket…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers?.map((tier) => {
            const isEditing = editingTier?._id === tier._id;
            const soldCount = tier.totalQuota - tier.availableQuota;

            return (
              <div
                key={tier._id}
                className="p-6 bg-[var(--color-paper-2)] border border-[var(--color-rule)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-display font-medium text-[var(--color-ink)] uppercase">{tier.name}</h3>
                    <span className="text-xs px-2 py-0.5 bg-[var(--color-paper-3)] text-[var(--color-muted)] border border-[var(--color-rule)] font-sans">
                      {soldCount} Terjual
                    </span>
                  </div>

                  {isEditing ? (
                    <div className="space-y-4 my-4">
                      <div>
                        <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">
                          Harga Tiket (Rp)
                        </label>
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(Number(e.target.value))}
                          className="w-full px-3 py-1.5 bg-[var(--color-paper)] border border-[var(--color-rule)] text-[var(--color-ink)] text-sm focus:border-[var(--color-accent)]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">
                          Total Kapasitas Kuota
                        </label>
                        <input
                          type="number"
                          value={editTotalQuota}
                          onChange={(e) => setEditTotalQuota(Number(e.target.value))}
                          className="w-full px-3 py-1.5 bg-[var(--color-paper)] border border-[var(--color-rule)] text-[var(--color-ink)] text-sm focus:border-[var(--color-accent)]"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="my-4 space-y-2">
                      <div className="text-3xl font-display font-light text-[var(--color-ink)]">
                        Rp {tier.price.toLocaleString("id-ID")}
                      </div>
                      <div className="text-xs text-[var(--color-muted)] flex justify-between">
                        <span>Sisa kuota: <strong className="text-[var(--color-accent)]">{tier.availableQuota}</strong></span>
                        <span>Total: <strong>{tier.totalQuota}</strong></span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[var(--color-rule)] flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={handleSaveEdit}
                        disabled={updateMutation.isPending}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-deep)] text-[var(--color-accent-ink)] font-bold text-xs font-display uppercase transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        {updateMutation.isPending ? "Menyimpan…" : "Simpan"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingTier(null)}
                        className="px-3 py-2 bg-[var(--color-paper-3)] hover:bg-[var(--color-paper)] text-[var(--color-muted)] text-xs border border-[var(--color-rule)] transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStartEdit(tier)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 bg-[var(--color-paper-3)] hover:bg-[var(--color-paper)] text-[var(--color-ink)] text-xs font-display uppercase border border-[var(--color-rule)] transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit Harga & Kuota
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
