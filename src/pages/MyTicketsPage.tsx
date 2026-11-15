import React from "react";
import { useQuery } from "@tanstack/react-query";
import QRCode from "react-qr-code";
import { api } from "../services/api";
import type { Order } from "../types";
import { Ticket, ShieldCheck } from "lucide-react";

export const MyTicketsPage: React.FC = () => {
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["myTickets"],
    queryFn: async () => {
      const res = await api.get("/orders/my-tickets");
      return res.data.data;
    },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl sm:text-6xl font-display font-light text-[var(--color-ink)] mb-2 uppercase">
          My Purchased <span className="text-[var(--color-accent)] font-normal">Tickets</span>
        </h1>
        <p className="text-[var(--color-muted)] text-sm">
          Present these digital QR codes at the gate inspection for immediate entry wristband exchange.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-[var(--color-muted)]">Retrieving tickets…</div>
      ) : orders?.length === 0 ? (
        <div className="text-center py-20 border border-[var(--color-rule)] bg-[var(--color-paper-2)]">
          <Ticket className="w-12 h-12 text-[var(--color-muted)] mx-auto mb-4" />
          <h3 className="text-2xl font-display font-medium text-[var(--color-ink)] mb-1 uppercase">No tickets found</h3>
          <p className="text-[var(--color-muted)] text-xs">You haven’t placed any ticket orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders?.map((order) => (
            <div
              key={order._id}
              className="p-6 border border-[var(--color-rule)] bg-[var(--color-paper-2)] flex flex-col md:flex-row items-center justify-between gap-8"
            >
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-0.5 bg-[var(--color-paper-3)] text-[var(--color-accent)] border border-[var(--color-rule)] text-xs font-medium">
                    {order.tierName} tier
                  </span>
                  <span className="text-xs text-[var(--color-muted)]">
                    Ordered on {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <div className="text-xs text-[var(--color-muted)]">Total quantity</div>
                  <div className="text-3xl font-display font-light text-[var(--color-ink)]">{order.quantity} Person(s)</div>
                </div>

                <div className="text-xs text-[var(--color-muted)]">
                  Total paid:{" "}
                  <span className="text-[var(--color-ink)] font-bold">
                    Rp {order.totalAmount.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-[var(--color-success)]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified and confirmed</span>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="flex flex-col items-center gap-3 p-4 bg-white border border-[var(--color-rule)]">
                <QRCode
                  value={order.ticketCodes[0] || order._id}
                  size={128}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  viewBox={`0 0 128 128`}
                />
                <span className="font-mono text-xs text-zinc-900 font-bold">
                  {order.ticketCodes[0] || order._id}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
