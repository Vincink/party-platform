'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type GameMode = 'quiz' | 'petit-bac';

interface RoomConfig {
  game_mode?: GameMode;
  question_index?: number;
  time_left?: number;
}

interface RoomRow {
  id: number;
  room_code: string;
  status: string | null;
  config: RoomConfig | string | null;
}

interface PlayerRow {
  id: number;
  pseudo: string | null;
  avatar: string | null;
  score: number | null;
  is_connected: boolean | null;
  answer: string | null;
  room_code: string | null;
  client_id: string | null;
}

const FALLBACK_COLORS = [
  '#38bdf8',
  '#34d399',
  '#fbbf24',
  '#f472b6',
  '#a78bfa',
  '#fb923c',
  '#22d3ee',
  '#4ade80',
];

function parseConfig(raw: RoomRow['config'] | undefined): RoomConfig {
  if (!raw) return {};
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as RoomConfig;
    } catch {
      return {};
    }
  }
  return raw;
}

function resolvePlayerColor(avatar: string | null, index: number): string {
  const trimmed = (avatar || '').trim();
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(trimmed)) {
    return trimmed;
  }
  if (/^(rgb|rgba|hsl|hsla)\(/i.test(trimmed)) {
    return trimmed;
  }
  if (/^[a-zA-Z]{3,20}$/.test(trimmed)) {
    return trimmed.toLowerCase();
  }
  return FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

export default function TvPage() {
  const [roomCode, setRoomCode] = useState<string>('');
  const [room, setRoom] = useState<RoomRow | null>(null);
  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameMode>('quiz');
  const [originUrl, setOriginUrl] = useState<string>('');
  const [qrError, setQrError] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setOriginUrl(window.location.origin);

    const params = new URLSearchParams(window.location.search);
    const urlCode = (
      params.get('code') ||
      params.get('room') ||
      params.get('room_code') ||
      ''
    )
      .trim()
      .toUpperCase();

    const storedCode = (
      window.localStorage.getItem('party_tv_room_code') ||
      window.localStorage.getItem('party_room_code') ||
      ''
    )
      .trim()
      .toUpperCase();

    const active = urlCode || storedCode;
    if (active) {
      window.localStorage.setItem('party_tv_room_code', active);
      setRoomCode(active);
    }
  }, []);

  const refreshTvData = useCallback(async () => {
    let targetRoom: RoomRow | null = null;

    if (roomCode) {
      const { data: byCode } = await supabase
        .from('rooms')
        .select('id, room_code, status, config')
        .eq('room_code', roomCode)
        .order('id', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (byCode) {
        targetRoom = byCode as RoomRow;
      }
    }

    if (!targetRoom) {
      const { data: latest } = await supabase
        .from('rooms')
        .select('id, room_code, status, config')
        .order('id', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latest) {
        targetRoom = latest as RoomRow;
        if (!roomCode && targetRoom.room_code) {
          setRoomCode(targetRoom.room_code);
        }
      }
    }

    if (targetRoom) {
      setRoom(targetRoom);
      const cfg = parseConfig(targetRoom.config);
      if (cfg.game_mode === 'quiz' || cfg.game_mode === 'petit-bac') {
        setSelectedGame(cfg.game_mode);
      }

      const { data: roomPlayers } = await supabase
        .from('players')
        .select('id, pseudo, avatar, score, is_connected, answer, room_code, client_id')
        .eq('room_code', targetRoom.room_code)
        .order('id', { ascending: true });

      if (Array.isArray(roomPlayers)) {
        setPlayers(roomPlayers as PlayerRow[]);
      }
    } else {
      const { data: allPlayers } = await supabase
        .from('players')
        .select('id, pseudo, avatar, score, is_connected, answer, room_code, client_id')
        .order('id', { ascending: true });

      if (Array.isArray(allPlayers)) {
        setPlayers(allPlayers as PlayerRow[]);
      }
    }
  }, [roomCode]);

  useEffect(() => {
    void refreshTvData();

    const channel = supabase.channel(`tv-tvos-${roomCode || 'latest'}`);

    if (roomCode) {
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'players', filter: `room_code=eq.${roomCode}` },
        () => {
          void refreshTvData();
        }
      );
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rooms', filter: `room_code=eq.${roomCode}` },
        () => {
          void refreshTvData();
        }
      );
    } else {
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'players' },
        () => {
          void refreshTvData();
        }
      );
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rooms' },
        () => {
          void refreshTvData();
        }
      );
    }

    channel.subscribe();

    const pollId = window.setInterval(() => {
      void refreshTvData();
    }, 2500);

    return () => {
      window.clearInterval(pollId);
      void supabase.removeChannel(channel);
    };
  }, [roomCode, refreshTvData]);

  const handleSelectGame = async (mode: GameMode) => {
    setSelectedGame(mode);
    const activeCode = room?.room_code || roomCode;
    if (!activeCode) return;

    const currentCfg = parseConfig(room?.config);
    const nextCfg: RoomConfig = {
      ...currentCfg,
      game_mode: mode,
    };

    await supabase
      .from('rooms')
      .update({ config: nextCfg })
      .eq('room_code', activeCode);
  };

  const activeRoomCode = room?.room_code || roomCode || 'SALON';
  const joinUrl = originUrl
    ? `${originUrl}/player?code=${encodeURIComponent(activeRoomCode)}`
    : `/player?code=${encodeURIComponent(activeRoomCode)}`;

  useEffect(() => {
    setQrError(false);
  }, [joinUrl]);

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=10&data=${encodeURIComponent(
    joinUrl
  )}`;

  return (
    <main className="relative min-h-screen w-full bg-[#0e172a] text-white select-none font-sans antialiased flex flex-col justify-between px-6 py-6 md:px-10 md:py-8">
      <style>{`
        html, body {
          overscroll-behavior: none;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
        }
        .tvos-card {
          transition:
            transform 320ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 320ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 240ms ease,
            background 240ms ease;
        }
        .tvos-card:hover,
        .tvos-card:focus-visible {
          transform: scale(1.02) translateY(-2px);
          box-shadow:
            0 24px 55px -12px rgba(2, 6, 23, 0.75),
            0 0 0 2px rgba(255, 255, 255, 0.7);
          outline: none;
        }
      `}</style>

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_85%_60%_at_50%_0%,rgba(59,130,246,0.34),rgba(14,23,42,0))]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(56,189,248,0.16),transparent_50%)]"
      />

      <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 max-w-7xl w-full mx-auto mb-6">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-300">
            tvOS • Salon {activeRoomCode}
          </span>
          <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white">
            Prépare ta partie
          </h1>
        </div>

        <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.16em] bg-white/[0.12] border border-white/20 text-sky-200 backdrop-blur-xl">
          {players.length} joueur{players.length > 1 ? 's' : ''} connecté{players.length > 1 ? 's' : ''}
        </span>
      </header>

      <section className="relative z-10 max-w-7xl w-full mx-auto my-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Colonne 1 : QR Code */}
        <div className="tvos-card p-6 md:p-7 rounded-[32px] bg-gradient-to-b from-white/[0.16] via-white/[0.08] to-slate-900/65 backdrop-blur-2xl border border-white/25 flex flex-col items-center justify-center text-center gap-4">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
            Connexion rapide
          </span>
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Scanne le QR code
          </h2>

          {!qrError ? (
            <div className="p-3 rounded-2xl bg-white shadow-[0_14px_30px_-8px_rgba(2,6,23,0.75)]">
              <img
                src={qrSrc}
                alt={`QR code pour rejoindre le salon ${activeRoomCode}`}
                className="w-40 h-40 sm:w-44 sm:h-44 block rounded-lg"
                onError={() => setQrError(true)}
              />
            </div>
          ) : (
            <div className="w-44 h-44 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center p-4 text-xs text-slate-300">
              Code salon : {activeRoomCode}
            </div>
          )}

          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Code du salon
            </p>
            <p className="text-2xl font-semibold tracking-[0.2em] text-white">
              {activeRoomCode}
            </p>
          </div>
        </div>

        {/* Colonne 2 : Choix du jeu (Quiz / Petit Bac) */}
        <div className="p-6 md:p-7 rounded-[32px] bg-gradient-to-b from-white/[0.16] via-white/[0.08] to-slate-900/65 backdrop-blur-2xl border border-white/25 flex flex-col justify-between gap-5">
          <div className="text-center space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
              Modes de jeu
            </span>
            <h2 className="text-xl font-semibold tracking-tight text-white">
              Choisis ton jeu
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 flex-1">
            <button
              type="button"
              onClick={() => void handleSelectGame('quiz')}
              className={`tvos-card p-5 rounded-[26px] border text-left flex items-center gap-4 cursor-pointer transition-colors ${
                selectedGame === 'quiz'
                  ? 'bg-sky-400/20 border-sky-300 shadow-[0_14px_32px_-10px_rgba(56,189,248,0.5)]'
                  : 'bg-white/[0.07] border-white/15 hover:border-white/35'
              }`}
            >
              <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-sky-400 to-blue-600 shadow-[0_10px_24px_-6px_rgba(56,189,248,0.65)] ring-2 ring-white/75 flex items-center justify-center shrink-0">
                <svg
                  viewBox="0 0 48 48"
                  fill="none"
                  className="w-7 h-7 text-white"
                  aria-hidden="true"
                >
                  <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2.8" />
                  <path
                    d="M19.5 19a4.8 4.8 0 0 1 9.2 1.8c0 3.2-4.7 4.2-4.7 7.2"
                    stroke="currentColor"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                  />
                  <circle cx="24" cy="33.5" r="1.7" fill="currentColor" />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold tracking-tight text-white">
                    Quiz
                  </h3>
                  {selectedGame === 'quiz' && (
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] px-2.5 py-0.5 rounded-full bg-sky-300 text-slate-950">
                      Actif
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Questions rapides et points en direct
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => void handleSelectGame('petit-bac')}
              className={`tvos-card p-5 rounded-[26px] border text-left flex items-center gap-4 cursor-pointer transition-colors ${
                selectedGame === 'petit-bac'
                  ? 'bg-indigo-400/20 border-cyan-300 shadow-[0_14px_32px_-10px_rgba(99,102,241,0.5)]'
                  : 'bg-white/[0.07] border-white/15 hover:border-white/35'
              }`}
            >
              <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-indigo-400 to-cyan-500 shadow-[0_10px_24px_-6px_rgba(99,102,241,0.65)] ring-2 ring-white/75 flex items-center justify-center shrink-0">
                <svg
                  viewBox="0 0 48 48"
                  fill="none"
                  className="w-7 h-7 text-white"
                  aria-hidden="true"
                >
                  <path
                    d="M12 13h24M24 13v22M13 38h22"
                    stroke="currentColor"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M32 23l5 5M37 23l-5 5"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold tracking-tight text-white">
                    Petit Bac
                  </h3>
                  {selectedGame === 'petit-bac' && (
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] px-2.5 py-0.5 rounded-full bg-cyan-300 text-slate-950">
                      Actif
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Trouve les bons mots par lettre et thème
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Colonne 3 : Joueurs connectés */}
        <div className="p-6 md:p-7 rounded-[32px] bg-gradient-to-b from-white/[0.16] via-white/[0.08] to-slate-900/65 backdrop-blur-2xl border border-white/25 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
                Salon
              </span>
              <h2 className="text-xl font-semibold tracking-tight text-white">
                Joueurs connectés
              </h2>
            </div>
            <span className="inline-flex items-center justify-center min-w-8 h-8 px-2.5 rounded-full text-xs font-semibold bg-white/[0.14] border border-white/20 text-white">
              {players.length}
            </span>
          </div>

          {players.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center px-4 py-8">
              <p className="text-sm text-slate-300">
                Aucun joueur connecté pour l’instant. Scanne le QR code pour rejoindre.
              </p>
            </div>
          ) : (
            <ul className="space-y-2.5 flex-1 overflow-y-auto pr-1">
              {players.map((p, index) => {
                const name = p.pseudo?.trim() || 'Joueur';
                const dotColor = resolvePlayerColor(p.avatar, index);
                const score = typeof p.score === 'number' ? p.score : 0;
                const answered = Boolean(p.answer && p.answer.trim().length > 0);

                return (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-slate-950/55 border border-white/15 px-3.5 py-2.5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="h-4 w-4 rounded-full shrink-0 ring-2 ring-white/50"
                        style={{ backgroundColor: dotColor }}
                        aria-hidden="true"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-white truncate">
                          {name}
                        </p>
                        <p className="text-[11px] text-slate-300">
                          {answered ? 'Réponse envoyée' : 'Connecté'}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-xl bg-white/15 px-2.5 py-1 text-xs font-semibold text-white shrink-0">
                      {score} pts
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <footer className="relative z-10 max-w-7xl w-full mx-auto text-center mt-6">
        <p className="text-xs tracking-wide text-slate-400">
          Synchronisation temps réel • Salon multijoueur
        </p>
      </footer>
    </main>
  );
}
