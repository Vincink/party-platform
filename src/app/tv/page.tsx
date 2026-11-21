'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

function parseConfig(raw: RoomRow['config']): RoomConfig {
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

function buildQrMatrix(text: string): boolean[][] {
  const size = 25; // Version 2-L
  const matrix: boolean[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false)
  );
  const reserved: boolean[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false)
  );

  const placeFinder = (top: number, left: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = top + r;
        const cc = left + c;
        if (rr < 0 || rr >= size || cc < 0 || cc >= size) continue;
        reserved[rr][cc] = true;
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isCore = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        matrix[rr][cc] = r >= 0 && r <= 6 && c >= 0 && c <= 6 && (isBorder || isCore);
      }
    }
  };

  placeFinder(0, 0);
  placeFinder(0, size - 7);
  placeFinder(size - 7, 0);

  // Motif d'alignement Version 2 à (18, 18)
  for (let r = 16; r <= 20; r++) {
    for (let c = 16; c <= 20; c++) {
      reserved[r][c] = true;
      const distR = Math.abs(r - 18);
      const distC = Math.abs(c - 18);
      matrix[r][c] = distR === 2 || distC === 2 || (r === 18 && c === 18);
    }
  }

  // Lignes de synchronisation (timing)
  for (let i = 0; i < size; i++) {
    if (!reserved[6][i]) {
      reserved[6][i] = true;
      matrix[6][i] = i % 2 === 0;
    }
    if (!reserved[i][6]) {
      reserved[i][6] = true;
      matrix[i][6] = i % 2 === 0;
    }
  }

  // Point sombre fixe Version 2
  reserved[17][8] = true;
  matrix[17][8] = true;

  // Réserver les zones d'information de format
  const formatCoords: Array<[number, number]> = [
    [0, 8],
    [1, 8],
    [2, 8],
    [3, 8],
    [4, 8],
    [5, 8],
    [7, 8],
    [8, 8],
    [8, 7],
    [8, 5],
    [8, 4],
    [8, 3],
    [8, 2],
    [8, 1],
    [8, 0],
  ];
  const secondaryFormatCoords: Array<[number, number]> = [
    [24, 8],
    [23, 8],
    [22, 8],
    [21, 8],
    [20, 8],
    [19, 8],
    [18, 8],
    [8, 17],
    [8, 18],
    [8, 19],
    [8, 20],
    [8, 21],
    [8, 22],
    [8, 23],
    [8, 24],
  ];

  for (const [r, c] of formatCoords) reserved[r][c] = true;
  for (const [r, c] of secondaryFormatCoords) reserved[r][c] = true;

  // Encodage mode octet (0100) + longueur sur 8 bits + données (max 42 octets pour 2-L)
  const payload = text.slice(0, 42);
  const bits: number[] = [0, 1, 0, 0];
  const len = payload.length;
  for (let b = 7; b >= 0; b--) bits.push((len >> b) & 1);
  for (let i = 0; i < len; i++) {
    const code = payload.charCodeAt(i) & 0xff;
    for (let b = 7; b >= 0; b--) bits.push((code >> b) & 1);
  }

  const totalDataCodewords = 44;
  const maxDataBits = totalDataCodewords * 8;
  for (let i = 0; i < 4 && bits.length < maxDataBits; i++) bits.push(0);
  while (bits.length % 8 !== 0) bits.push(0);

  const dataBytes: number[] = [];
  for (let i = 0; i < bits.length && dataBytes.length < totalDataCodewords; i += 8) {
    let val = 0;
    for (let b = 0; b < 8; b++) val = (val << 1) | (bits[i + b] ?? 0);
    dataBytes.push(val);
  }

  const pads = [0xec, 0x11];
  let padIdx = 0;
  while (dataBytes.length < totalDataCodewords) {
    dataBytes.push(pads[padIdx % 2]);
    padIdx++;
  }

  // Reed-Solomon GF(256) sur 10 octets de correction
  const exp = new Array<number>(512).fill(0);
  const log = new Array<number>(256).fill(0);
  let x = 1;
  for (let i = 0; i < 255; i++) {
    exp[i] = x;
    log[x] = i;
    x <<= 1;
    if ((x & 0x100) !== 0) x ^= 0x11d;
  }
  for (let i = 0; i < 255; i++) exp[i + 255] = exp[i];

  const ecLen = 10;
  let gen = [1];
  for (let i = 0; i < ecLen; i++) {
    const next = new Array<number>(gen.length + 1).fill(0);
    for (let a = 0; a < gen.length; a++) {
      next[a] ^= gen[a];
      if (gen[a] !== 0) {
        next[a + 1] ^= exp[(log[gen[a]] + i) % 255];
      }
    }
    gen = next;
  }

  const msg = [...dataBytes, ...new Array<number>(ecLen).fill(0)];
  for (let i = 0; i < dataBytes.length; i++) {
    const coef = msg[i];
    if (coef !== 0) {
      for (let j = 0; j < gen.length; j++) {
        msg[i + j] ^= exp[(log[coef] + log[gen[j]]) % 255];
      }
    }
  }
  const eccBytes = msg.slice(dataBytes.length);

  const allBits: number[] = [];
  for (const byte of [...dataBytes, ...eccBytes]) {
    for (let b = 7; b >= 0; b--) allBits.push((byte >> b) & 1);
  }

  let bitPtr = 0;
  let goingUp = true;
  for (let col = size - 1; col >= 1; col -= 2) {
    if (col === 6) col = 5;
    for (let step = 0; step < size; step++) {
      const r = goingUp ? size - 1 - step : step;
      for (let offset = 0; offset <= 1; offset++) {
        const c = col - offset;
        if (c < 0 || reserved[r][c]) continue;
        const rawBit = allBits[bitPtr] ?? 0;
        bitPtr++;
        const masked = (r + c) % 2 === 0 ? rawBit ^ 1 : rawBit;
        matrix[r][c] = masked === 1;
      }
    }
    goingUp = !goingUp;
  }

  // Format ECC L (01) + Masque 0 (000) -> 0x77c4
  const formatBits = 0x77c4;
  for (let i = 0; i < 15; i++) {
    const bit = ((formatBits >> (14 - i)) & 1) === 1;
    const [r1, c1] = formatCoords[i];
    const [r2, c2] = secondaryFormatCoords[i];
    matrix[r1][c1] = bit;
    matrix[r2][c2] = bit;
  }

  return matrix;
}

function QrCodeSvg({ value }: { value: string }) {
  const matrix = useMemo(() => buildQrMatrix(value), [value]);
  const count = matrix.length;

  return (
    <svg
      viewBox={`0 0 ${count} ${count}`}
      className="w-44 h-44 rounded-xl bg-white p-2.5 shadow-inner shrink-0"
      role="img"
      aria-label={`QR Code : ${value}`}
    >
      <rect x={0} y={0} width={count} height={count} fill="#ffffff" />
      {matrix.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={c}
              y={r}
              width={1}
              height={1}
              fill="#090d16"
            />
          ) : null
        )
      )}
    </svg>
  );
}

export default function TvPage() {
  const [roomCode, setRoomCode] = useState<string>('');
  const [room, setRoom] = useState<RoomRow | null>(null);
  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameMode>('quiz');
  const [originUrl, setOriginUrl] = useState<string>('');

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

    const channel = supabase.channel(`tv-lobby-${roomCode || 'latest'}`);

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

  return (
    <main className="min-h-screen w-full bg-slate-950 text-white p-5 lg:p-7 flex flex-col">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-sky-400">
            Salon TV • {activeRoomCode}
          </p>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight">
            Choisissez un jeu pour lancer la partie
          </h1>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-white/10 px-4 py-2 text-sm font-bold text-slate-200">
          {players.length} joueur{players.length > 1 ? 's' : ''} connecté
          {players.length > 1 ? 's' : ''}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_340px] gap-6 flex-1 items-stretch">
        {/* Colonne 1 (Gauche) : QR Code */}
        <section className="rounded-3xl bg-slate-900/90 border border-white/10 p-6 flex flex-col items-center justify-center text-center gap-4">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Rejoindre avec le téléphone
          </span>

          <QrCodeSvg value={joinUrl} />

          <div className="space-y-1">
            <p className="text-xs text-slate-400">Code du salon</p>
            <p className="text-2xl font-black tracking-widest text-white">
              {activeRoomCode}
            </p>
          </div>

          <p className="text-xs text-slate-400 break-all max-w-full">
            {joinUrl}
          </p>
        </section>

        {/* Colonne 2 (Centre) : Choix du jeu (Quiz / Petit Bac) avec icônes SVG */}
        <section className="rounded-3xl bg-slate-900/70 border border-white/10 p-6 flex flex-col justify-center gap-5">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Choix du jeu
            </p>
            <h2 className="text-xl lg:text-2xl font-extrabold mt-1">
              Sélectionnez votre mode
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <button
              type="button"
              onClick={() => void handleSelectGame('quiz')}
              className={`group rounded-3xl p-6 border-2 text-left flex flex-col items-center justify-center gap-4 transition-all ${
                selectedGame === 'quiz'
                  ? 'bg-sky-500/15 border-sky-400 shadow-lg shadow-sky-950/60'
                  : 'bg-slate-900 border-white/10 hover:border-white/30'
              }`}
            >
              <svg
                viewBox="0 0 64 64"
                className="w-16 h-16 text-sky-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="10" y="10" width="44" height="44" rx="12" />
                <path d="M25 24.5a7 7 0 0 1 13.5 2.5c0 4.5-6.5 6-6.5 10.5" />
                <circle cx="32" cy="44" r="2" fill="currentColor" stroke="none" />
              </svg>

              <div className="text-center">
                <span className="block text-xl font-black text-white">Quiz</span>
                <span className="block text-xs text-slate-300 mt-1">
                  Questions rapides & points
                </span>
              </div>

              <span
                className={`text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${
                  selectedGame === 'quiz'
                    ? 'bg-sky-400 text-slate-950'
                    : 'bg-white/10 text-slate-300'
                }`}
              >
                {selectedGame === 'quiz' ? 'Sélectionné' : 'Choisir'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => void handleSelectGame('petit-bac')}
              className={`group rounded-3xl p-6 border-2 text-left flex flex-col items-center justify-center gap-4 transition-all ${
                selectedGame === 'petit-bac'
                  ? 'bg-amber-400/15 border-amber-300 shadow-lg shadow-amber-950/60'
                  : 'bg-slate-900 border-white/10 hover:border-white/30'
              }`}
            >
              <svg
                viewBox="0 0 64 64"
                className="w-16 h-16 text-amber-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="10" y="12" width="44" height="40" rx="10" />
                <path d="M10 24h44" />
                <path d="M26 24v28" />
                <path d="M16 18h6" />
                <path d="M32 34h16" />
                <path d="M32 43h12" />
              </svg>

              <div className="text-center">
                <span className="block text-xl font-black text-white">
                  Petit Bac
                </span>
                <span className="block text-xs text-slate-300 mt-1">
                  Lettres & catégories
                </span>
              </div>

              <span
                className={`text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${
                  selectedGame === 'petit-bac'
                    ? 'bg-amber-300 text-slate-950'
                    : 'bg-white/10 text-slate-300'
                }`}
              >
                {selectedGame === 'petit-bac' ? 'Sélectionné' : 'Choisir'}
              </span>
            </button>
          </div>
        </section>

        {/* Colonne 3 (Droite) : Joueurs connectés */}
        <section className="rounded-3xl bg-slate-900/90 border border-white/10 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold">Joueurs connectés</h2>
            <span className="text-xs font-bold text-slate-400">
              {players.length}
            </span>
          </div>

          {players.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center text-sm text-slate-400 px-3">
              En attente de joueurs dans le salon…
            </div>
          ) : (
            <ul className="space-y-2.5 overflow-y-auto pr-1">
              {players.map((p) => {
                const name = p.pseudo?.trim() || 'Joueur';
                const color = p.avatar?.trim() || '#38bdf8';
                const score = typeof p.score === 'number' ? p.score : 0;
                const answered = Boolean(p.answer && p.answer.trim().length > 0);

                return (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-slate-950/80 border border-white/10 px-3.5 py-2.5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="h-4 w-4 rounded-full shrink-0 ring-2 ring-white/25"
                        style={{ backgroundColor: color }}
                        aria-hidden="true"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-white truncate">
                          {name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {answered ? 'Réponse envoyée' : 'Connecté'}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-xl bg-white/10 px-2.5 py-1 text-xs font-extrabold text-white shrink-0">
                      {score} pts
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
