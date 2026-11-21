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

interface CardPalette {
  bg: string;
  border: string;
  text: string;
  subtext: string;
  badgeBg: string;
  badgeText: string;
}

const CARD_PALETTES: CardPalette[] = [
  {
    bg: '#2563eb',
    border: '#93c5fd',
    text: '#ffffff',
    subtext: '#dbeafe',
    badgeBg: 'rgba(15, 23, 42, 0.35)',
    badgeText: '#ffffff',
  },
  {
    bg: '#059669',
    border: '#6ee7b7',
    text: '#ffffff',
    subtext: '#d1fae5',
    badgeBg: 'rgba(15, 23, 42, 0.35)',
    badgeText: '#ffffff',
  },
  {
    bg: '#d97706',
    border: '#fcd34d',
    text: '#ffffff',
    subtext: '#fef3c7',
    badgeBg: 'rgba(15, 23, 42, 0.35)',
    badgeText: '#ffffff',
  },
  {
    bg: '#db2777',
    border: '#f9a8d4',
    text: '#ffffff',
    subtext: '#fce7f3',
    badgeBg: 'rgba(15, 23, 42, 0.35)',
    badgeText: '#ffffff',
  },
  {
    bg: '#7c3aed',
    border: '#c4b5fd',
    text: '#ffffff',
    subtext: '#ede9fe',
    badgeBg: 'rgba(15, 23, 42, 0.35)',
    badgeText: '#ffffff',
  },
  {
    bg: '#ea580c',
    border: '#fdba74',
    text: '#ffffff',
    subtext: '#ffedd5',
    badgeBg: 'rgba(15, 23, 42, 0.35)',
    badgeText: '#ffffff',
  },
  {
    bg: '#0891b2',
    border: '#67e8f9',
    text: '#ffffff',
    subtext: '#cffafe',
    badgeBg: 'rgba(15, 23, 42, 0.35)',
    badgeText: '#ffffff',
  },
  {
    bg: '#e11d48',
    border: '#fda4af',
    text: '#ffffff',
    subtext: '#ffe4e6',
    badgeBg: 'rgba(15, 23, 42, 0.35)',
    badgeText: '#ffffff',
  },
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

function getUniquePlayerPalette(player: PlayerRow, usedIndices: Set<number>): CardPalette {
  const seed = `${player.id}-${player.client_id || ''}-${player.pseudo || ''}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  let idx = hash % CARD_PALETTES.length;
  let attempts = 0;
  while (usedIndices.has(idx) && attempts < CARD_PALETTES.length) {
    idx = (idx + 1) % CARD_PALETTES.length;
    attempts++;
  }

  if (usedIndices.has(idx)) {
    const hue = (hash * 137) % 360;
    return {
      bg: `hsl(${hue} 78% 46%)`,
      border: `hsl(${hue} 90% 78%)`,
      text: '#ffffff',
      subtext: 'rgba(255,255,255,0.88)',
      badgeBg: 'rgba(15, 23, 42, 0.35)',
      badgeText: '#ffffff',
    };
  }

  usedIndices.add(idx);
  return CARD_PALETTES[idx];
}

export default function TvPage() {
  const [roomCode, setRoomCode] = useState<string>('');
  const [room, setRoom] = useState<RoomRow | null>(null);
  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameMode>('quiz');
  const [originUrl, setOriginUrl] = useState<string>('');
  const [qrError, setQrError] = useState<boolean>(false);
  const [isLaunching, setIsLaunching] = useState<boolean>(false);

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

  const handleStartGame = async () => {
    const activeCode = room?.room_code || roomCode;
    if (!activeCode || isLaunching) return;

    setIsLaunching(true);
    try {
      const currentCfg = parseConfig(room?.config);
      const nextCfg: RoomConfig = {
        ...currentCfg,
        game_mode: selectedGame,
        question_index: 0,
      };

      const { data } = await supabase
        .from('rooms')
        .update({ status: 'playing', config: nextCfg })
        .eq('room_code', activeCode)
        .select('id, room_code, status, config')
        .order('id', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        setRoom(data as RoomRow);
      } else {
        setRoom((prev) => (prev ? { ...prev, status: 'playing', config: nextCfg } : prev));
      }
    } finally {
      setIsLaunching(false);
    }
  };

  const activeRoomCode = room?.room_code || roomCode || 'SALON';
  const joinUrl = originUrl
    ? `${originUrl}/player?code=${encodeURIComponent(activeRoomCode)}`
    : `/player?code=${encodeURIComponent(activeRoomCode)}`;

  useEffect(() => {
    setQrError(false);
  }, [joinUrl]);

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=460x460&margin=12&data=${encodeURIComponent(
    joinUrl
  )}`;

  const usedPaletteIndices = new Set<number>();

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#0e172a] text-white select-none font-sans antialiased flex flex-col justify-between px-6 py-5 md:px-10 md:py-6">
      <style>{`
        html, body {
          overflow: hidden;
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

      <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 max-w-7xl w-full mx-auto mb-4 shrink-0">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-300">
          tvOS • Salon {activeRoomCode}
        </span>

        <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.16em] bg-white/[0.12] border border-white/20 text-sky-200 backdrop-blur-xl">
          {players.length} joueur{players.length > 1 ? 's' : ''} connecté{players.length > 1 ? 's' : ''}
        </span>
      </header>

      <section className="relative z-10 max-w-7xl w-full mx-auto flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Colonne 1 : QR Code agrandi au maximum de la colonne */}
        <div className="tvos-card h-full min-h-0 p-5 md:p-6 rounded-[32px] bg-gradient-to-b from-white/[0.16] via-white/[0.08] to-slate-900/65 backdrop-blur-2xl border border-white/25 flex flex-col items-center justify-between text-center gap-3">
          <div className="shrink-0">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
              Connexion rapide
            </span>
            <h2 className="text-xl font-semibold tracking-tight text-white">
              Scanne le QR code
            </h2>
          </div>

          <div className="flex-1 min-h-0 w-full flex items-center justify-center">
            {!qrError ? (
              <div className="h-full max-h-[340px] aspect-square p-3 rounded-3xl bg-white shadow-[0_14px_30px_-8px_rgba(2,6,23,0.75)] flex items-center justify-center">
                <img
                  src={qrSrc}
                  alt={`QR code pour rejoindre le salon ${activeRoomCode}`}
                  className="w-full h-full object-contain block rounded-xl"
                  onError={() => setQrError(true)}
                />
              </div>
            ) : (
              <div className="h-full max-h-[340px] aspect-square rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center p-4 text-sm text-slate-300">
                Code salon : {activeRoomCode}
              </div>
            )}
          </div>

          <div className="shrink-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Code du salon
            </p>
            <p className="text-2xl font-semibold tracking-[0.2em] text-white">
              {activeRoomCode}
            </p>
          </div>
        </div>

        {/* Colonne 2 : Choix du jeu (icônes type iPhone) + bouton Lancer le jeu */}
        <div className="h-full min-h-0 p-5 md:p-6 rounded-[32px] bg-gradient-to-b from-white/[0.16] via-white/[0.08] to-slate-900/65 backdrop-blur-2xl border border-white/25 flex flex-col justify-between gap-4">
          <div className="text-center shrink-0">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
              Modes de jeu
            </span>
            <h2 className="text-xl font-semibold tracking-tight text-white">
              Choisis ton jeu
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3.5 flex-1 min-h-0">
            <button
              type="button"
              onClick={() => void handleSelectGame('quiz')}
              className={`tvos-card h-full px-5 py-4 rounded-[26px] border text-left flex items-center gap-4 cursor-pointer transition-colors ${
                selectedGame === 'quiz'
                  ? 'bg-sky-400/20 border-sky-300 shadow-[0_14px_32px_-10px_rgba(56,189,248,0.5)]'
                  : 'bg-white/[0.07] border-white/15 hover:border-white/35'
              }`}
            >
              <div className="w-14 h-14 rounded-[18px] bg-gradient-to-br from-sky-400 to-blue-600 shadow-[0_8px_20px_-4px_rgba(56,189,248,0.65)] ring-1 ring-white/40 flex items-center justify-center shrink-0">
                <svg
                  viewBox="0 0 32 32"
                  fill="none"
                  className="w-7 h-7 text-white"
                  aria-hidden="true"
                >
                  <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="2.3" />
                  <path
                    d="M12.8 12.6a3.3 3.3 0 0 1 6.4 1.1c0 2.2-3.2 2.9-3.2 5"
                    stroke="currentColor"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                  />
                  <circle cx="16" cy="22.8" r="1.4" fill="currentColor" />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xl font-semibold tracking-tight text-white">
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
              className={`tvos-card h-full px-5 py-4 rounded-[26px] border text-left flex items-center gap-4 cursor-pointer transition-colors ${
                selectedGame === 'petit-bac'
                  ? 'bg-indigo-400/20 border-cyan-300 shadow-[0_14px_32px_-10px_rgba(99,102,241,0.5)]'
                  : 'bg-white/[0.07] border-white/15 hover:border-white/35'
              }`}
            >
              <div className="w-14 h-14 rounded-[18px] bg-gradient-to-br from-indigo-400 to-cyan-500 shadow-[0_8px_20px_-4px_rgba(99,102,241,0.65)] ring-1 ring-white/40 flex items-center justify-center shrink-0">
                <svg
                  viewBox="0 0 32 32"
                  fill="none"
                  className="w-7 h-7 text-white"
                  aria-hidden="true"
                >
                  <path
                    d="M8.5 9h15M16 9v14.5M9.5 24.5h13"
                    stroke="currentColor"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20.5 14.5l3 3M23.5 14.5l-3 3"
                    stroke="currentColor"
                    strokeWidth="2.1"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xl font-semibold tracking-tight text-white">
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

          <button
            type="button"
            disabled={isLaunching}
            onClick={() => void handleStartGame()}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 font-semibold text-base tracking-wide shadow-[0_12px_28px_-8px_rgba(56,189,248,0.65)] hover:brightness-105 active:scale-[0.99] transition cursor-pointer shrink-0 disabled:opacity-60"
          >
            {isLaunching
              ? 'Lancement...'
              : room?.status === 'playing'
                ? `Partie en cours (${selectedGame === 'quiz' ? 'Quiz' : 'Petit Bac'})`
                : `Lancer le jeu (${selectedGame === 'quiz' ? 'Quiz' : 'Petit Bac'})`}
          </button>
        </div>

        {/* Colonne 3 : Joueurs connectés */}
        <div className="h-full min-h-0 p-5 md:p-6 rounded-[32px] bg-gradient-to-b from-white/[0.16] via-white/[0.08] to-slate-900/65 backdrop-blur-2xl border border-white/25 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between gap-2 shrink-0">
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
            <ul className="space-y-3 flex-1 min-h-0 overflow-y-auto pr-1">
              {players.map((p, index) => {
                const name = p.pseudo?.trim() || 'Joueur';
                const palette = getUniquePlayerPalette(p, usedPaletteIndices);
                const score = typeof p.score === 'number' ? p.score : 0;

                return (
                  <li
                    key={p.id}
                    style={{
                      backgroundColor: palette.bg,
                      borderColor: palette.border,
                      color: palette.text,
                    }}
                    className="flex items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3.5 shadow-md"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        style={{
                          backgroundColor: palette.badgeBg,
                          color: palette.badgeText,
                        }}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-base font-bold shrink-0"
                      >
                        {index + 1}
                      </span>
                      <p
                        className="font-bold text-xl truncate"
                        style={{ color: palette.text }}
                      >
                        {name}
                      </p>
                    </div>

                    <span
                      style={{
                        backgroundColor: palette.badgeBg,
                        color: palette.badgeText,
                      }}
                      className="rounded-xl px-3.5 py-1.5 text-lg font-extrabold shrink-0"
                    >
                      {score} pts
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <footer className="relative z-10 max-w-7xl w-full mx-auto text-center mt-4 shrink-0">
        <p className="text-xs tracking-wide text-slate-400">
          Synchronisation temps réel • Salon multijoueur
        </p>
      </footer>
    </main>
  );
}
