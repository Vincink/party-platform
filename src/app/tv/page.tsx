'use client';

import React from 'react';

interface TvPlayerState {
  id: string;
  name: string;
  color?: string;
  score: number;
  hasAnswered: boolean;
  lastPointsEarned?: number;
}

interface TvPlayersBarProps {
  players: TvPlayerState[];
  showEarnedPoints?: boolean;
}

function TvPlayersBar({
  players,
  showEarnedPoints = false,
}: TvPlayersBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {players.map((player) => (
        <div
          key={player.id}
          className={`flex items-center gap-3 rounded-2xl px-4 py-2.5 border transition-all ${
            player.hasAnswered
              ? 'bg-emerald-950/80 border-emerald-400 shadow-lg shadow-emerald-950/50'
              : 'bg-slate-900/80 border-white/15'
          }`}
        >
          {/* Pastille couleur joueur */}
          <span
            className="h-4 w-4 rounded-full shrink-0"
            style={{ backgroundColor: player.color || '#38bdf8' }}
          />

          {/* Nom + statut de réponse */}
          <div className="flex flex-col">
            <span className="font-bold text-base text-white leading-tight">
              {player.name}
            </span>
            <span
              className={`text-xs font-semibold ${
                player.hasAnswered ? 'text-emerald-300' : 'text-slate-400'
              }`}
            >
              {player.hasAnswered ? '✓ A répondu' : 'Réfléchit…'}
            </span>
          </div>

          {/* Score */}
          <div className="ml-2 flex items-center gap-1.5">
            <span className="rounded-xl bg-white/10 px-3 py-1 text-sm font-extrabold text-white">
              {player.score} pts
            </span>
            {showEarnedPoints && (player.lastPointsEarned ?? 0) > 0 && (
              <span className="rounded-xl bg-emerald-500 px-2 py-1 text-xs font-black text-slate-950">
                +{player.lastPointsEarned}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
