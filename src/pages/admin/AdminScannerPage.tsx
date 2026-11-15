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
        <h1 className="text-4xl font-display font-light text-[var(--color-ink)] mb-2 uppercase">
          Gate Inspection & <span className="text-[var(--color-accent)] font-normal">QR Scanner</span>
        </h1>
        <p className="text-[var(--color-muted)] text-sm">
          Masukkan kode tiket atau gunakan barcode scanner genggam untuk memverifikasi keabsahan tiket.
        </p>
      </div>

      {/* Input Barcode Scanner Form */}
      <div className="p-6 bg-[var(--color-paper-2)] border border-[var(--color-rule)] mb-8">
        <form onSubmit={handleScanSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <QrCode className="w-5 h-5 text-[var(--color-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value.toUpperCase())}
              placeholder="Contoh: BRF22-A1B2C3D4"
              className="w-full pl-11 pr-4 py-3 bg-[var(--color-paper)] border border-[var(--color-rule)] text-[var(--color-ink)] font-mono text-sm focus:border-[var(--color-accent)] transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={scanMutation.isPending}
            className="px-6 py-3 bg-[var(--color-accent)] hover:bg-[var(--color-accent-deep)] text-[var(--color-accent-ink)] font-bold font-display text-sm uppercase transition-colors disabled:opacity-50"
          >
            {scanMutation.isPending ? "Memverifikasi…" : "Validasi tiket"}
          </button>
        </form>
      </div>

      {/* Tampilan Error / Anomaly Scan Ganda */}
      {errorMessage && (
        <div className="p-6 bg-[var(--color-paper-2)] border border-[var(--color-error)] flex items-start gap-4 text-[var(--color-error)]">
          <ShieldAlert className="w-8 h-8 flex-shrink-0" />
          <div>
            <h3 className="text-2xl font-display font-medium mb-1 uppercase">Akses ditolak</h3>
            <p className="text-sm">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Tampilan Berhasil / Tiket Valid */}
      {scanResult && (
        <div className="p-6 bg-[var(--color-paper-2)] border border-[var(--color-success)] flex items-start gap-4 text-[var(--color-success)]">
          <CheckCircle className="w-8 h-8 flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <h3 className="text-2xl font-display font-medium uppercase">Tiket valid: akses masuk disetujui</h3>
            <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t border-[var(--color-rule)] text-[var(--color-ink-2)]">
              <div>
                <span className="text-[var(--color-muted)] text-xs block">Pemegang tiket</span>
                <span className="font-bold text-[var(--color-ink)]">{scanResult.user?.username || "Unknown"}</span>
              </div>
              <div>
                <span className="text-[var(--color-muted)] text-xs block">Kategori tier</span>
                <span className="font-bold text-[var(--color-accent)] font-display uppercase text-base">{scanResult.tierName}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
