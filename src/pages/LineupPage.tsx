import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Lineup } from "../types";
import { MapPin, Clock } from "lucide-react";

export const LineupPage: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<number>(1);

  const { data: lineups, isLoading } = useQuery<Lineup[]>({
    queryKey: ["lineups"],
    queryFn: async () => {
      const res = await api.get("/lineups");
      return res.data.data;
    },
  });

  const filteredLineups = lineups?.filter((item) => item.day === selectedDay) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl sm:text-7xl font-display font-light text-[var(--color-ink)] mb-4 uppercase">
          Artist <span className="text-[var(--color-accent)] font-normal">Lineup</span>
        </h1>
        <p className="text-[var(--color-muted)] max-w-xl mx-auto text-sm">
          Select a day to preview the headliners, supporting acts, and stage breakdown.
        </p>

        {/* Day Selector Tabs */}
        <div className="inline-flex p-1 mt-8 bg-[var(--color-paper-2)] border border-[var(--color-rule)]">
          {[1, 2, 3].map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-6 py-2 font-display text-sm uppercase transition-colors ${
                selectedDay === day
                  ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-bold"
                  : "text-[var(--color-muted)] hover:text-[var(--color-ink)] font-medium"
              }`}
            >
              Day {day}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-24 text-[var(--color-muted)]">
          Loading festival schedule…
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLineups.map((artist) => (
            <div
              key={artist._id}
              className="border border-[var(--color-rule)] bg-[var(--color-paper-2)] hover:border-[var(--color-accent)] transition-colors"
            >
              <div className="relative aspect-video overflow-hidden bg-[var(--color-paper-3)]">
                <img
                  src={artist.imageUrl}
                  alt={artist.artistName}
                  className="w-full h-full object-cover filter grayscale contrast-110"
                  onError={(e) => {
                    // Fallback if image fails
                    (e.target as HTMLImageElement).src = "/img/Background.jpg";
                  }}
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 text-xs font-medium bg-[var(--color-paper)] text-[var(--color-accent)] border border-[var(--color-rule)]">
                  Day {artist.day}
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-display font-medium text-[var(--color-ink)] mb-2 uppercase">
                  {artist.artistName}
                </h3>
                <p className="text-[var(--color-muted)] text-xs mb-4 line-clamp-2 leading-relaxed">
                  {artist.description}
                </p>

                <div className="space-y-1.5 text-xs text-[var(--color-muted)] border-t border-[var(--color-rule)] pt-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                    <span>{artist.stage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                    <span>{artist.timeSlot}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
