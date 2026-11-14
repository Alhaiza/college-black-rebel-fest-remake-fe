/**
 * ============================================================================
 * [ADMIN GATE SCANNER PAGE] - src/pages/admin/AdminScannerPage.tsx
 * ============================================================================
 * 
 * Terminal pemindai barcode / check-in tiket di pintu masuk festival.
 * Mengatasi anomaly case: scan ganda (double-entry attempt) secara instan.
 */

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";
import { QrCode, CheckCircle, ShieldAlert } from "lucide-react";

export const AdminScannerPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [ticketInput, setTicketInput] = useState("");
  const [scanResult, setScanResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const scanMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await api.post("/admin/scan-ticket", { ticketCode: code });
      return res.data;
    },
    onSuccess: (data) => {
      setScanResult(data.data);
      setErrorMessage("");
      setTicketInput("");
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
      queryClient.invalidateQueries({ queryKey: ["adminAnalytics"] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Validasi tiket gagal.";
      setErrorMessage(msg);
      setScanResult(null);
    },
  });

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;
    setErrorMessage("");
    setScanResult(null);
    scanMutation.mutate(ticketInput.trim());
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Gate Inspection & QR Scanner</h1>
        <p className="text-zinc-400 text-sm">
          Masukkan kode tiket atau gunakan barcode scanner genggam untuk memverifikasi keabsahan tiket.
        </p>
      </div>

      {/* Input Barcode Scanner Form */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 mb-8">
        <form onSubmit={handleScanSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <QrCode className="w-5 h-5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value.toUpperCase())}
              placeholder="Contoh: BRF22-A1B2C3D4"
              className="w-full pl-11 pr-4 py-3 bg-zinc-950 border border-zinc-700 rounded-xl text-white font-mono uppercase tracking-wider text-base focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            type="submit"
            disabled={scanMutation.isPending}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
          >
            {scanMutation.isPending ? "Memverifikasi..." : "Validasi Tiket"}
          </button>
        </form>
      </div>

      {/* Tampilan Error / Anomaly Scan Ganda */}
      {errorMessage && (
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-4 text-red-400">
          <ShieldAlert className="w-8 h-8 flex-shrink-0 text-red-500" />
          <div>
            <h3 className="text-lg font-bold mb-1">Akses Ditolak!</h3>
            <p className="text-sm text-red-300">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Tampilan Berhasil / Tiket Valid */}
      {scanResult && (
        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-4 text-emerald-400">
          <CheckCircle className="w-8 h-8 flex-shrink-0 text-emerald-500" />
          <div className="space-y-2 flex-1">
            <h3 className="text-lg font-bold">Tiket Valid - Akses Masuk Disetujui!</h3>
            <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t border-emerald-500/20 text-zinc-300">
              <div>
                <span className="text-zinc-500 text-xs">Pemegang Tiket:</span>
                <div className="font-bold text-white">{scanResult.holder?.username}</div>
              </div>
              <div>
                <span className="text-zinc-500 text-xs">Kategori Tiket:</span>
                <div className="font-bold text-amber-400">{scanResult.tierName}</div>
              </div>
              <div>
                <span className="text-zinc-500 text-xs">Jumlah Orang:</span>
                <div className="font-bold text-white">{scanResult.quantity} Orang</div>
              </div>
              <div>
                <span className="text-zinc-500 text-xs">Waktu Check-in:</span>
                <div className="font-bold text-zinc-200">
                  {new Date(scanResult.checkedInAt).toLocaleTimeString("id-ID")}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
