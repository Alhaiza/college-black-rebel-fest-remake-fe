import React from "react";
import { Link } from "react-router-dom";
import { Flame, ArrowRight, ShieldCheck, Zap, Sparkles } from "lucide-react";

export const HomePage: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[130px] -z-10 rounded-full" />

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          The Most Anticipated Festival Experience
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white mb-6">
          BLACK REBEL <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500">
            FESTIVAL IS BACK
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-zinc-400 mb-10 leading-relaxed">
          Wanna feel an electrifying experience? Join thousands of passionate music lovers for 3 legendary days of rock, metal, indie, and unstoppable energy.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/tickets"
            className="flex items-center gap-2 px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-lg transition-all shadow-lg shadow-amber-500/20 hover:scale-105"
          >
            Get Tickets Now
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/lineup"
            className="flex items-center gap-2 px-7 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold rounded-lg transition-all"
          >
            Explore Line Up
          </Link>
        </div>

        {/* Highlight Perks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 text-left">
          <div className="p-6 rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur">
            <Flame className="w-8 h-8 text-amber-500 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">9+ Iconic Artists</h3>
            <p className="text-sm text-zinc-400">
              Slipknot, Twice, Yoasobi, Dream Theater, Neck Deep, and top tier national headliners.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur">
            <Zap className="w-8 h-8 text-amber-500 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Real-time Digital Ticketing</h3>
            <p className="text-sm text-zinc-400">
              Zero paper waste. Instant digital ticket issuance with secure cryptographic QR barcodes.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur">
            <ShieldCheck className="w-8 h-8 text-amber-500 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Atomic Reservation</h3>
            <p className="text-sm text-zinc-400">
              Zero overselling guarantee powered by race-condition resilient atomic transactions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

