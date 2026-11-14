/**
 * ============================================================================
 * [ADMIN ORDERS MONITORING PAGE] - src/pages/admin/AdminOrdersPage.tsx
 * ============================================================================
 * 
 * Tabel pemantauan seluruh riwayat transaksi tiket pengguna festival.
 */

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../services/api";
import { Search, ShieldCheck, Clock } from "lucide-react";

export const AdminOrdersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: orders, isLoading } = useQuery({
    queryKey: ["adminOrders"],
    queryFn: async () => {
      const res = await api.get("/admin/orders");
      return res.data.data;
    },
  });

  const filteredOrders = orders?.filter((o: any) => {
    const username = o.userId?.username?.toLowerCase() || "";
    const tier = o.tierName?.toLowerCase() || "";
    const code = (o.ticketCodes || []).join(" ").toLowerCase();
    const q = searchQuery.toLowerCase();
    return username.includes(q) || tier.includes(q) || code.includes(q);
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Audit Transaksi Tiket</h1>
          <p className="text-zinc-400 text-sm">Daftar seluruh tiket yang diterbitkan oleh sistem BRF22.</p>
        </div>

        {/* Input Pencarian */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari username, tier, barcode..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-zinc-500">Memuat riwayat transaksi...</div>
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="text-xs uppercase bg-zinc-950 text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-4">Pengguna</th>
                  <th className="py-3 px-4">Tier Tiket</th>
                  <th className="py-3 px-4">Jumlah</th>
                  <th className="py-3 px-4">Total Bayar</th>
                  <th className="py-3 px-4">Kode Tiket</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Waktu Order</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders?.map((order: any) => (
                  <tr key={order._id} className="border-b border-zinc-800/60 hover:bg-zinc-800/30">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{order.userId?.username || "Unknown"}</div>
                      <div className="text-xs text-zinc-500">{order.userId?.email || "-"}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-amber-400">{order.tierName}</td>
                    <td className="py-3 px-4 font-mono">{order.quantity} Tiket</td>
                    <td className="py-3 px-4 font-bold text-white">
                      Rp {order.totalAmount.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        {order.ticketCodes?.map((code: string, i: number) => (
                          <div key={i} className="font-mono text-xs text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800 inline-block mr-1">
                            {code}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-bold ${
                          order.status === "checked-in"
                            ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                            : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        }`}
                      >
                        {order.status === "checked-in" ? (
                          <>
                            <ShieldCheck className="w-3 h-3" />
                            CHECKED-IN
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            PAID
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-zinc-500">
                      {new Date(order.createdAt).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
