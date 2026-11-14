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
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
          ARTIST <span className="text-amber-500">LINE UP</span>
        </h1>
        <p className="text-zinc-400 max-w-xl mx-auto text-sm">
          Select a day to preview the headliners, supporting acts, and stage breakdown.
        </p>

        {/* Day Selector Tabs */}
        <div className="inline-flex p-1 mt-8 bg-zinc-900 border border-zinc-800 rounded-lg">
          {[1, 2, 3].map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-6 py-2.5 rounded-md font-bold text-sm transition-all ${
                selectedDay === day
                  ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              DAY {day}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-24 text-zinc-500">
          Loading festival schedule...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLineups.map((artist) => (
            <div
              key={artist._id}
              className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-amber-500/50 transition-all duration-300"
            >
              <div className="relative aspect-video overflow-hidden bg-zinc-950">
                <img
                  src={artist.imageUrl}
                  alt={artist.artistName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback if image fails
                    (e.target as HTMLImageElement).src = "/img/Background.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                <span className="absolute bottom-3 left-3 px-2.5 py-1 text-xs font-bold rounded bg-amber-500 text-black">
                  DAY {artist.day}
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-black text-white mb-2 group-hover:text-amber-400 transition-colors">
                  {artist.artistName}
                </h3>
                <p className="text-zinc-400 text-xs mb-4 line-clamp-2">
                  {artist.description}
                </p>

                <div className="space-y-1.5 text-xs text-zinc-400 border-t border-zinc-800 pt-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span>{artist.stage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
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
