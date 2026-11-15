import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import type { TicketTier } from "../types";
import { useAuth } from "../context/AuthContext";
import { Check, AlertCircle } from "lucide-react";

export const TicketPurchasePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedTier, setSelectedTier] = useState<TicketTier | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { data: tiers, isLoading } = useQuery<TicketTier[]>({
    queryKey: ["ticketTiers"],
    queryFn: async () => {
      const res = await api.get("/tickets/tiers");
      return res.data.data;
    },
  });

  const orderMutation = useMutation({
    mutationFn: async () => {
      if (!selectedTier) return;
      const res = await api.post("/orders", {
        tierId: selectedTier._id,
        quantity,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticketTiers"] });
      navigate("/my-tickets");
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Pemesanan tiket gagal. Silakan coba lagi.";
      setErrorMessage(msg);
    },
  });

  const handleCheckout = () => {
    setErrorMessage("");
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role === "admin") {
      setErrorMessage("Akun Administrator tidak dapat memesan tiket. Silakan gunakan akun penonton (user reguler).");
      return;
    }
    if (!selectedTier) return;
    orderMutation.mutate();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl sm:text-7xl font-display font-light text-[var(--color-ink)] mb-3 uppercase">
          Secure Your <span className="text-[var(--color-accent)] font-normal">Tickets</span>
        </h1>
        <p className="text-[var(--color-muted)] text-sm max-w-lg mx-auto">
          Pilih kategori tiket festival Anda. Seluruh tiket sudah mencakup akses konser multi-hari dan barcode elektronik resmi.
        </p>
      </div>

      {errorMessage && (
        <div className="max-w-xl mx-auto mb-8 p-4 bg-[var(--color-paper-2)] border border-[var(--color-error)] flex items-center gap-3 text-[var(--color-error)] text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-20 text-[var(--color-muted)]">Memuat ketersediaan tiket…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {tiers?.map((tier) => {
            const isSelected = selectedTier?._id === tier._id;
            const isSoldOut = tier.availableQuota <= 0;

            return (
              <div
                key={tier._id}
                onClick={() => !isSoldOut && setSelectedTier(tier)}
                className={`relative flex flex-col justify-between p-6 border transition-colors cursor-pointer ${
                  isSelected
                    ? "border-[var(--color-accent)] bg-[var(--color-paper-2)]"
                    : isSoldOut
                    ? "opacity-50 border-[var(--color-rule)] bg-[var(--color-paper)] cursor-not-allowed"
                    : "border-[var(--color-rule)] bg-[var(--color-paper-2)] hover:border-[var(--color-muted)]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-display font-medium text-[var(--color-ink)] uppercase">{tier.name}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 font-medium border ${
                        isSoldOut
                          ? "border-[var(--color-error)] text-[var(--color-error)]"
                          : "border-[var(--color-success)] text-[var(--color-success)]"
                      }`}
                    >
                      {isSoldOut ? "Sold out" : `Sisa ${tier.availableQuota}`}
                    </span>
                  </div>

                  <div className="mb-6">
                    <span className="text-3xl font-display font-light text-[var(--color-ink)]">
                      Rp {tier.price.toLocaleString("id-ID")}
                    </span>
                    <span className="text-[var(--color-muted)] text-xs ml-1">/ tiket</span>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {tier.perks.map((perk, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-[var(--color-ink-2)]">
                        <Check className="w-4 h-4 text-[var(--color-accent)] flex-shrink-0" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  disabled={isSoldOut}
                  className={`w-full py-2.5 font-display text-sm uppercase transition-colors ${
                    isSelected
                      ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-bold"
                      : isSoldOut
                      ? "bg-[var(--color-paper-3)] text-[var(--color-muted)]"
                      : "bg-[var(--color-paper-3)] text-[var(--color-ink)] hover:bg-[var(--color-paper-2)] border border-[var(--color-rule)]"
                  }`}
                >
                  {isSoldOut ? "Habis terjual" : isSelected ? "Tier dipilih" : "Pilih kategori"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Bar Sticky Checkout */}
      {selectedTier && (
        <div className="p-6 border border-[var(--color-rule)] bg-[var(--color-paper-2)] max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-xs text-[var(--color-muted)] mb-1">Kategori: {selectedTier.name}</div>
            <div className="text-3xl font-display font-medium text-[var(--color-accent)]">
              Rp {(selectedTier.price * quantity).toLocaleString("id-ID")}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Counter Kuantitas */}
            <div className="flex items-center gap-2 bg-[var(--color-paper)] border border-[var(--color-rule)] p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 bg-[var(--color-paper-2)] text-[var(--color-ink)] font-display hover:bg-[var(--color-paper-3)] transition-colors"
              >
                -
              </button>
              <span className="w-8 text-center font-display text-base text-[var(--color-ink)]">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(5, selectedTier.availableQuota, quantity + 1))}
                className="w-8 h-8 bg-[var(--color-paper-2)] text-[var(--color-ink)] font-display hover:bg-[var(--color-paper-3)] transition-colors"
              >
                +
              </button>
            </div>

            {/* Tombol Eksekusi Order */}
            <button
              type="button"
              onClick={handleCheckout}
              disabled={orderMutation.isPending}
              className="px-6 py-2.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-deep)] text-[var(--color-accent-ink)] font-bold font-display text-sm uppercase transition-colors disabled:opacity-50"
            >
              {orderMutation.isPending ? "Memproses…" : "Konfirmasi & bayar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
