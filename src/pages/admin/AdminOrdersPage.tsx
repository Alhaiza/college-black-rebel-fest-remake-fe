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
          <h1 className="text-4xl font-display font-light text-[var(--color-ink)] mb-2 uppercase">
            Audit Transaksi <span className="text-[var(--color-accent)] font-normal">Tiket</span>
          </h1>
          <p className="text-[var(--color-muted)] text-sm">Daftar seluruh tiket yang diterbitkan oleh sistem BRF22.</p>
        </div>

        {/* Input Pencarian */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[var(--color-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari username, tier, barcode…"
            className="w-full pl-9 pr-4 py-2 bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-sm text-[var(--color-ink)] focus:border-[var(--color-accent)] transition-colors"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-[var(--color-muted)]">Memuat riwayat transaksi…</div>
      ) : (
        <div className="border border-[var(--color-rule)] bg-[var(--color-paper-2)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[var(--color-ink-2)]">
              <thead className="text-xs bg-[var(--color-paper)] text-[var(--color-muted)] border-b border-[var(--color-rule)]">
                <tr>
                  <th className="py-3 px-4 font-normal">Pengguna</th>
                  <th className="py-3 px-4 font-normal">Tier tiket</th>
                  <th className="py-3 px-4 font-normal">Jumlah</th>
                  <th className="py-3 px-4 font-normal">Total bayar</th>
                  <th className="py-3 px-4 font-normal">Kode tiket</th>
                  <th className="py-3 px-4 font-normal">Status</th>
                  <th className="py-3 px-4 font-normal">Waktu order</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders?.map((order: any) => (
                  <tr key={order._id} className="border-b border-[var(--color-rule)] hover:bg-[var(--color-paper-3)] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-[var(--color-ink)]">{order.userId?.username || "Unknown"}</div>
                      <div className="text-xs text-[var(--color-muted)]">{order.userId?.email || "-"}</div>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-[var(--color-accent)]">{order.tierName}</td>
                    <td className="py-3 px-4 text-sm">{order.quantity} Tiket</td>
                    <td className="py-3 px-4 font-medium text-[var(--color-ink)]">
                      Rp {order.totalAmount.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        {order.ticketCodes?.map((code: string, i: number) => (
                          <div key={i} className="font-mono text-xs text-[var(--color-ink-2)] bg-[var(--color-paper)] px-2 py-0.5 border border-[var(--color-rule)] inline-block mr-1">
                            {code}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 border font-medium ${
                          order.status === "checked-in"
                            ? "border-[var(--color-muted)] text-[var(--color-muted)]"
                            : "border-[var(--color-success)] text-[var(--color-success)]"
                        }`}
                      >
                        {order.status === "checked-in" ? (
                          <>
                            <Clock className="w-3 h-3" />
                            Checked in
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-3 h-3" />
                            Active
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-[var(--color-muted)]">
                      {new Date(order.createdAt).toLocaleString()}
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
