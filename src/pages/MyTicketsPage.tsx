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
        <h1 className="text-3xl font-extrabold text-white mb-2">MY PURCHASED TICKETS</h1>
        <p className="text-zinc-400 text-sm">
          Present these digital QR codes at the gate inspection for immediate entry wristband exchange.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-zinc-500">Retrieving tickets...</div>
      ) : orders?.length === 0 ? (
        <div className="text-center py-20 border border-zinc-800 rounded-xl bg-zinc-900/30">
          <Ticket className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-1">No Tickets Found</h3>
          <p className="text-zinc-400 text-xs">You haven't placed any ticket orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders?.map((order) => (
            <div
              key={order._id}
              className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 flex flex-col md:flex-row items-center justify-between gap-8"
            >
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full font-bold text-xs uppercase tracking-wider">
                    {order.tierName} TIER
                  </span>
                  <span className="text-xs text-zinc-500">
                    Ordered on {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <div className="text-sm text-zinc-400">Total Quantity</div>
                  <div className="text-2xl font-black text-white">{order.quantity} Person(s)</div>
                </div>

                <div className="text-xs text-zinc-400">
                  Total Paid:{" "}
                  <span className="text-zinc-200 font-bold">
                    Rp {order.totalAmount.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified & Confirmed</span>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="flex flex-col items-center gap-3 p-4 bg-white rounded-xl shadow-lg">
                <QRCode
                  value={order.ticketCodes[0] || order._id}
                  size={128}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  viewBox={`0 0 128 128`}
                />
                <span className="font-mono text-[10px] text-zinc-700 tracking-wider font-bold">
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
