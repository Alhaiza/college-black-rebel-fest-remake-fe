import React from "react";
import { Link } from "react-router-dom";
import { Flame, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export const HomePage: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 pt-16 pb-20 text-center">
        <h1 className="text-6xl sm:text-8xl font-display font-light uppercase tracking-tight text-[var(--color-ink)] mb-6">
          Black Rebel <span className="text-[var(--color-accent)] font-normal">Festival 2022</span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-[var(--color-ink-2)] mb-10 leading-relaxed font-body">
          Three days of heavy music, independent sound, and collective energy.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/tickets"
            className="flex items-center gap-2 px-7 py-3 bg-[var(--color-accent)] hover:bg-[var(--color-accent-deep)] text-[var(--color-accent-ink)] font-bold text-sm tracking-wide transition-colors"
          >
            Get tickets now
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/lineup"
            className="flex items-center gap-2 px-7 py-3 bg-[var(--color-paper-2)] hover:bg-[var(--color-paper-3)] text-[var(--color-ink)] border border-[var(--color-rule)] font-medium text-sm transition-colors"
          >
            Explore lineup
          </Link>
        </div>

        {/* Highlight Perks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left border-t border-[var(--color-rule)] pt-12">
          <div className="p-6 border border-[var(--color-rule)] bg-[var(--color-paper-2)]">
            <Flame className="w-6 h-6 text-[var(--color-accent)] mb-4" />
            <h3 className="text-xl font-display font-medium text-[var(--color-ink)] mb-2 uppercase">9+ Iconic Artists</h3>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              Slipknot, Twice, Yoasobi, Dream Theater, Neck Deep, and top tier national headliners.
            </p>
          </div>
          <div className="p-6 border border-[var(--color-rule)] bg-[var(--color-paper-2)]">
            <Zap className="w-6 h-6 text-[var(--color-accent)] mb-4" />
            <h3 className="text-xl font-display font-medium text-[var(--color-ink)] mb-2 uppercase">Real-time Digital Ticketing</h3>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              Zero paper waste. Instant digital ticket issuance with secure cryptographic QR barcodes.
            </p>
          </div>
          <div className="p-6 border border-[var(--color-rule)] bg-[var(--color-paper-2)]">
            <ShieldCheck className="w-6 h-6 text-[var(--color-accent)] mb-4" />
            <h3 className="text-xl font-display font-medium text-[var(--color-ink)] mb-2 uppercase">Atomic Reservation</h3>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              Zero overselling guarantee powered by race-condition resilient atomic transactions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

