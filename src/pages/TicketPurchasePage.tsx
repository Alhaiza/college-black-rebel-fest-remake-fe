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
      const msg = err.response?.data?.message || "Order submission failed.";
      setErrorMessage(msg);
    },
  });

  const handleCheckout = () => {
    setErrorMessage("");
    if (!user) {
      navigate("/login");
      return;
    }
    if (!selectedTier) return;
    orderMutation.mutate();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">
          SECURE YOUR <span className="text-amber-500">TICKETS</span>
        </h1>
        <p className="text-zinc-400 text-sm max-w-lg mx-auto">
          Choose your festival experience tier. All tickets include multi-day access and valid electronic barcodes.
        </p>
      </div>

      {errorMessage && (
        <div className="max-w-xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-20 text-zinc-500">Loading ticket inventory...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {tiers?.map((tier) => {
            const isSelected = selectedTier?._id === tier._id;
            const isSoldOut = tier.availableQuota <= 0;

            return (
              <div
                key={tier._id}
                onClick={() => !isSoldOut && setSelectedTier(tier)}
                className={`relative flex flex-col justify-between p-6 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? "border-amber-500 bg-amber-500/5 shadow-xl shadow-amber-500/10 scale-105"
                    : isSoldOut
                    ? "opacity-50 border-zinc-800 bg-zinc-900/20 cursor-not-allowed"
                    : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        isSoldOut
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      {isSoldOut ? "SOLD OUT" : `${tier.availableQuota} left`}
                    </span>
                  </div>

                  <div className="mb-6">
                    <span className="text-3xl font-extrabold text-white">
                      Rp {tier.price.toLocaleString("id-ID")}
                    </span>
                    <span className="text-zinc-500 text-xs ml-1">/ person</span>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {tier.perks.map((perk, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                        <Check className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  disabled={isSoldOut}
                  className={`w-full py-2.5 rounded-lg font-bold text-xs transition-colors ${
                    isSelected
                      ? "bg-amber-500 text-black"
                      : isSoldOut
                      ? "bg-zinc-800 text-zinc-500"
                      : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                  }`}
                >
                  {isSoldOut ? "Unavailable" : isSelected ? "Tier Selected" : "Select Tier"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Checkout Bar */}
      {selectedTier && (
        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/90 backdrop-blur max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-xs text-zinc-400 mb-1">Selected: {selectedTier.name}</div>
            <div className="text-2xl font-black text-amber-500">
              Rp {(selectedTier.price * quantity).toLocaleString("id-ID")}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded bg-zinc-900 text-white font-bold hover:bg-zinc-800"
              >
                -
              </button>
              <span className="w-8 text-center font-bold text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(5, selectedTier.availableQuota, quantity + 1))}
                className="w-8 h-8 rounded bg-zinc-900 text-white font-bold hover:bg-zinc-800"
              >
                +
              </button>
            </div>

            <button
              onClick={handleCheckout}
              disabled={orderMutation.isPending}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm rounded-lg transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
            >
              {orderMutation.isPending ? "Processing..." : "Confirm & Pay"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
