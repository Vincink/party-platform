'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

type ChoiceKey = 'A' | 'B' | 'C' | 'D';

interface ChoiceItem {
  key: ChoiceKey;
  bgClass: string;
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

interface RoomConfig {
  question_index?: number;
  quiz_started?: boolean;
  time_left?: number;
}

interface RoomRow {
  id: number;
  room_code: string;
  status: string | null;
  config: RoomConfig | string | null;
}

interface CardPalette {
  bg: string;
  border: string;
  text: string;
  badgeBg: string;
  badgeText: string;
}

const CHOICES: ChoiceItem[] = [
  { key: 'A', bgClass: 'bg-red-600 active:bg-red-700' },
  { key: 'B', bgClass: 'bg-amber-400 text-slate-950 active:bg-amber-500' },
  { key: 'C', bgClass: 'bg-blue-600 active:bg-blue-700' },
  { key: 'D', bgClass: 'bg-emerald-600 active:bg-emerald-700' },
];

const CARD_PALETTES: CardPalette[] = [
  {
    bg: '#2563eb',
    border: '#93c5fd',
    text: '#ffffff',
    badgeBg: 'rgba(15, 23, 42, 0.35)',
    badgeText: '#ffffff',
  },
  {
    bg: '#059669',
    border: '#6ee7b7',
    text: '#ffffff',
    badgeBg: 'rgba(15, 23, 42, 0.35)',
    badgeText: '#ffffff',
  },
  {
    bg: '#d97706',
    border: '#fcd34d',
    text: '#ffffff',
    badgeBg: 'rgba(15, 23, 42, 0.35)',
    badgeText: '#ffffff',
  },
  {
    bg: '#db2777',
    border: '#f9a8d4',
    text: '#ffffff',
    badgeBg: 'rgba(15, 23, 42, 0.35)',
    badgeText: '#ffffff',
  },
  {
    bg: '#7c3aed',
    border: '#c4b5fd',
    text: '#ffffff',
    badgeBg: 'rgba(15, 23, 42, 0.35)',
    badgeText: '#ffffff',
  },
  {
    bg: '#ea580c',
    border: '#fdba74',
    text: '#ffffff',
    badgeBg: 'rgba(15, 23, 42, 0.35)',
    badgeText: '#ffffff',
  },
  {
    bg: '#0891b2',
    border: '#67e8f9',
    text: '#ffffff',
    badgeBg: 'rgba(15, 23, 42, 0.35)',
    badgeText: '#ffffff',
  },
  {
    bg: '#e11d48',
    border: '#fda4af',
    text: '#ffffff',
    badgeBg: 'rgba(15, 23, 42, 0.35)',
    badgeText: '#ffffff',
  },
];

function generateClientId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `client_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function parseRoomConfig(raw: RoomRow['config'] | undefined): RoomConfig {
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

function getQuestionIndex(room: RoomRow | null): number {
  if (!room) return 0;
  const cfg = parseRoomConfig(room.config);
  if (typeof cfg.question_index === 'number') return cfg.question_index;
  if (room.status && room.status.startsWith('playing:')) {
    const parsed = Number(room.status.split(':')[1]);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return 0;
}

function isChoiceKey(value: string | null | undefined): value is ChoiceKey {
  return value === 'A' || value === 'B' || value === 'C' || value === 'D';
}

function getUniquePlayerPalette(player: PlayerRow, usedIndices: Set<number>): CardPalette {
  const seed = `${player.client_id || player.id}-${player.pseudo || ''}`;
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
      badgeBg: 'rgba(15, 23, 42, 0.35)',
      badgeText: '#ffffff',
    };
  }

  usedIndices.add(idx);
  return CARD_PALETTES[idx];
}

export default function PlayerPage() {
  const [roomCode, setRoomCode] = useState<string>('');
  const [clientId, setClientId] = useState<string>('');
  const [player, setPlayer] = useState<PlayerRow | null>(null);
  const [room, setRoom] = useState<RoomRow | null>(null);
  const [allPlayers, setAllPlayers] = useState<PlayerRow[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<ChoiceKey | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [pseudoInput, setPseudoInput] = useState<string>('');
  const [roomInput, setRoomInput] = useState<string>('');
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [joinError, setJoinError] = useState<string>('');

  const prevQuestionIndexRef = useRef<number | null>(null);
  const playerIdRef = useRef<number | null>(null);
  const roomCodeRef = useRef<string>('');
  const clientIdRef = useRef<string>('');

  useEffect(() => {
    playerIdRef.current = player?.id ?? null;
  }, [player?.id]);

  useEffect(() => {
    roomCodeRef.current = roomCode;
  }, [roomCode]);

  useEffect(() => {
    clientIdRef.current = clientId;
  }, [clientId]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.setAttribute('name', 'viewport');
      document.head.appendChild(viewportMeta);
    }
    viewportMeta.setAttribute(
      'content',
      'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'
    );

    const preventGesture = (e: Event) => {
      e.preventDefault();
    };

    const preventMultiTouch = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    let lastTouchEnd = 0;
    const preventDoubleTapZoom = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    const preventWheelZoom = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    document.addEventListener('gesturestart', preventGesture, { passive: false });
    document.addEventListener('gesturechange', preventGesture, { passive: false });
    document.addEventListener('gestureend', preventGesture, { passive: false });
    document.addEventListener('touchmove', preventMultiTouch, { passive: false });
    document.addEventListener('touchend', preventDoubleTapZoom, { passive: false });
    window.addEventListener('wheel', preventWheelZoom, { passive: false });

    return () => {
      document.removeEventListener('gesturestart', preventGesture);
      document.removeEventListener('gesturechange', preventGesture);
      document.removeEventListener('gestureend', preventGesture);
      document.removeEventListener('touchmove', preventMultiTouch);
      document.removeEventListener('touchend', preventDoubleTapZoom);
      window.removeEventListener('wheel', preventWheelZoom);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const urlCode = (params.get('code') || params.get('room') || params.get('room_code') || '')
      .trim()
      .toUpperCase();
    const urlClient = (params.get('client') || params.get('client_id') || '').trim();

    const storedCode = (window.localStorage.getItem('party_room_code') || '').trim().toUpperCase();
    const storedClient = (window.localStorage.getItem('party_client_id') || '').trim();
    const storedPseudo = (window.localStorage.getItem('party_player_pseudo') || '').trim();

    const resolvedCode = urlCode || storedCode;
    const resolvedClient = urlClient || storedClient || generateClientId();

    window.localStorage.setItem('party_client_id', resolvedClient);
    setClientId(resolvedClient);

    if (resolvedCode) {
      window.localStorage.setItem('party_room_code', resolvedCode);
      setRoomCode(resolvedCode);
      setRoomInput(resolvedCode);
    }

    if (storedPseudo) {
      setPseudoInput(storedPseudo);
    }
  }, []);

  const currentQuestionIndex = useMemo(() => getQuestionIndex(room), [room]);

  const timeLeft = useMemo(() => {
    const cfg = parseRoomConfig(room?.config);
    return typeof cfg.time_left === 'number' ? cfg.time_left : 15;
  }, [room]);

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isJoining) return;

    const cleanPseudo = pseudoInput.trim();
    const cleanCode = (roomCode || roomInput).trim().toUpperCase();

    if (!cleanCode) {
      setJoinError('Entre le code du salon.');
      return;
    }
    if (!cleanPseudo) {
      setJoinError('Entre ton pseudo pour jouer.');
      return;
    }

    setJoinError('');
    setIsJoining(true);

    try {
      const activeClientId = clientId || generateClientId();

      if (typeof window !== 'undefined') {
        window.localStorage.setItem('party_client_id', activeClientId);
        window.localStorage.setItem('party_room_code', cleanCode);
        window.localStorage.setItem('party_player_pseudo', cleanPseudo);
      }
      setClientId(activeClientId);
      setRoomCode(cleanCode);

      const { data: existingRows } = await supabase
        .from('players')
        .select('id, pseudo, avatar, score, is_connected, answer, room_code, client_id')
        .eq('room_code', cleanCode)
        .eq('client_id', activeClientId)
        .order('id', { ascending: false });

      if (Array.isArray(existingRows) && existingRows.length > 0) {
        const latestRow = existingRows[0] as PlayerRow;
        const duplicateIds = existingRows.slice(1).map((r) => r.id);

        if (duplicateIds.length > 0) {
          await supabase.from('players').delete().in('id', duplicateIds);
        }

        const { data: updated } = await supabase
          .from('players')
          .update({
            pseudo: cleanPseudo,
            is_connected: true,
          })
          .eq('id', latestRow.id)
          .select('id, pseudo, avatar, score, is_connected, answer, room_code, client_id')
          .single();

        if (updated) {
          setPlayer(updated as PlayerRow);
        }
      } else {
        const { data: inserted, error: insertError } = await supabase
          .from('players')
          .insert({
            room_code: cleanCode,
            client_id: activeClientId,
            pseudo: cleanPseudo,
            score: 0,
            is_connected: true,
            answer: null,
          })
          .select('id, pseudo, avatar, score, is_connected, answer, room_code, client_id')
          .single();

        if (insertError) {
          setJoinError('Impossible de rejoindre le salon.');
          return;
        }

        if (inserted) {
          setPlayer(inserted as PlayerRow);
        }
      }

      setIsJoined(true);
    } finally {
      setIsJoining(false);
    }
  };

  useEffect(() => {
    if (!isJoined || !roomCode || !clientId) return;

    const markDisconnected = () => {
      const pid = playerIdRef.current;
      const rCode = roomCodeRef.current;
      const cId = clientIdRef.current;
      if (!rCode) return;

      if (pid) {
        void supabase.from('players').update({ is_connected: false }).eq('id', pid);
      } else if (cId) {
        void supabase
          .from('players')
          .update({ is_connected: false })
          .eq('room_code', rCode)
          .eq('client_id', cId);
      }
    };

    window.addEventListener('pagehide', markDisconnected);
    window.addEventListener('beforeunload', markDisconnected);

    return () => {
      window.removeEventListener('pagehide', markDisconnected);
      window.removeEventListener('beforeunload', markDisconnected);
    };
  }, [isJoined, roomCode, clientId]);

  const syncData = useCallback(async () => {
    if (!roomCode || !clientId) return;

    const { data: roomData } = await supabase
      .from('rooms')
      .select('id, room_code, status, config')
      .eq('room_code', roomCode)
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (roomData) {
      setRoom(roomData as RoomRow);
    }

    const { data: roomPlayers } = await supabase
      .from('players')
      .select('id, pseudo, avatar, score, is_connected, answer, room_code, client_id')
      .eq('room_code', roomCode)
      .order('id', { ascending: false });

    if (Array.isArray(roomPlayers)) {
      const sortedByNewest = (roomPlayers as PlayerRow[]).sort((a, b) => b.id - a.id);
      const seenClients = new Set<string>();
      const uniqueActive: PlayerRow[] = [];

      for (const row of sortedByNewest) {
        const cid = row.client_id?.trim() || '';
        if (cid) {
          if (seenClients.has(cid)) continue;
          seenClients.add(cid);
        }
        if (row.is_connected !== false) {
          uniqueActive.push(row);
        }
      }

      uniqueActive.sort(
        (a, b) =>
          (typeof b.score === 'number' ? b.score : 0) -
          (typeof a.score === 'number' ? a.score : 0)
      );
      setAllPlayers(uniqueActive);

      const me = uniqueActive.find((p) => p.client_id?.trim() === clientId) || null;
      if (me) {
        setPlayer(me);
        if (isChoiceKey(me.answer)) {
          setSelectedChoice(me.answer);
        } else if (me.answer === null) {
          setSelectedChoice(null);
        }
      }
    }
  }, [roomCode, clientId]);

  useEffect(() => {
    if (!isJoined) return;

    if (prevQuestionIndexRef.current === null) {
      prevQuestionIndexRef.current = currentQuestionIndex;
      return;
    }

    if (prevQuestionIndexRef.current !== currentQuestionIndex) {
      prevQuestionIndexRef.current = currentQuestionIndex;
      setSelectedChoice(null);

      if (roomCode && (player?.id || clientId)) {
        const resetAnswer = async () => {
          let query = supabase.from('players').update({ answer: null, is_connected: true });
          if (player?.id) {
            query = query.eq('id', player.id);
          } else {
            query = query.eq('room_code', roomCode).eq('client_id', clientId);
          }
          await query;
        };
        void resetAnswer();
      }
    }
  }, [isJoined, currentQuestionIndex, roomCode, player?.id, clientId]);

  useEffect(() => {
    if (!roomCode || !clientId || !isJoined) return;

    void syncData();

    const channel = supabase
      .channel(`player-page-${roomCode}-${clientId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'players', filter: `room_code=eq.${roomCode}` },
        () => {
          void syncData();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rooms', filter: `room_code=eq.${roomCode}` },
        () => {
          void syncData();
        }
      )
      .subscribe();

    const intervalId = window.setInterval(() => {
      void syncData();
    }, 2500);

    return () => {
      window.clearInterval(intervalId);
      void supabase.removeChannel(channel);
    };
  }, [roomCode, clientId, isJoined, syncData]);

  const handleSelectChoice = async (choice: ChoiceKey) => {
    if (isSubmitting || selectedChoice !== null || timeLeft <= 0) return;

    setSelectedChoice(choice);
    setIsSubmitting(true);

    try {
      if (roomCode && (player?.id || clientId)) {
        let query = supabase
          .from('players')
          .update({ answer: choice, is_connected: true });

        if (player?.id) {
          query = query.eq('id', player.id);
        } else {
          query = query.eq('room_code', roomCode).eq('client_id', clientId);
        }

        const { error } = await query;
        if (error) {
          setSelectedChoice(null);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const playerName = player?.pseudo?.trim() || pseudoInput.trim() || 'Joueur';
  const score = typeof player?.score === 'number' ? player.score : 0;

  const { playerPalette, playerRank } = useMemo(() => {
    const used = new Set<number>();
    let foundPalette: CardPalette | null = null;
    let foundRank = 1;

    allPlayers.forEach((p, idx) => {
      const pal = getUniquePlayerPalette(p, used);
      if (p.client_id?.trim() === clientId || (player?.id && p.id === player.id)) {
        foundPalette = pal;
        foundRank = idx + 1;
      }
    });

    if (!foundPalette) {
      const fallbackRow: PlayerRow = player || {
        id: 0,
        pseudo: playerName,
        avatar: null,
        score,
        is_connected: true,
        answer: null,
        room_code: roomCode || null,
        client_id: clientId || null,
      };
      foundPalette = getUniquePlayerPalette(fallbackRow, used);
    }

    return {
      playerPalette: foundPalette,
      playerRank: foundRank,
    };
  }, [allPlayers, clientId, player, playerName, score, roomCode]);

  const activeChoice: ChoiceKey | null =
    selectedChoice ?? (isChoiceKey(player?.answer) ? player.answer : null);
  const hasAnswered =
    activeChoice !== null || Boolean(player?.answer && player.answer.trim().length > 0);

  return (
    <main className="fixed inset-0 h-[100dvh] w-full overflow-hidden overscroll-none bg-[#0e172a] text-white flex flex-col justify-between px-3.5 py-3 select-none touch-none antialiased">
      <style>{`
        html, body {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden !important;
          overscroll-behavior: none !important;
          touch-action: none !important;
          -webkit-text-size-adjust: 100%;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
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

      {!isJoined ? (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-2">
          <form
            onSubmit={(e) => void handleJoinRoom(e)}
            className="w-full max-w-sm rounded-[28px] bg-gradient-to-b from-white/[0.16] via-white/[0.08] to-slate-900/65 backdrop-blur-2xl border border-white/25 p-6 flex flex-col gap-5 shadow-2xl"
          >
            <div className="text-center">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-300">
                Quiz • Salon {roomCode || 'Partie'}
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-white mt-1.5">
                Entre ton pseudo
              </h1>
            </div>

            {!roomCode && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-200">
                  Code du salon
                </label>
                <input
                  type="text"
                  value={roomInput}
                  onChange={(e) => setRoomInput(e.target.value.toUpperCase())}
                  placeholder="Ex: ABC123"
                  maxLength={10}
                  autoCapitalize="characters"
                  className="w-full rounded-2xl bg-white/[0.1] border border-white/20 px-4 py-3 text-base font-bold uppercase tracking-widest text-white placeholder:text-slate-400 outline-none focus:border-sky-400 touch-auto"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-200">
                Pseudo
              </label>
              <input
                type="text"
                value={pseudoInput}
                onChange={(e) => setPseudoInput(e.target.value)}
                placeholder="Ton prénom ou pseudo"
                maxLength={18}
                autoComplete="off"
                className="w-full rounded-2xl bg-white/[0.1] border border-white/20 px-4 py-3.5 text-base font-bold text-white placeholder:text-slate-400 outline-none focus:border-sky-400 touch-auto"
              />
            </div>

            {joinError && (
              <p className="text-xs font-semibold text-red-300 text-center">
                {joinError}
              </p>
            )}

            <button
              type="submit"
              disabled={isJoining}
              className="w-full rounded-2xl bg-gradient-to-r from-sky-400 to-cyan-400 py-3.5 text-base font-bold text-slate-950 shadow-lg transition hover:brightness-105 active:scale-[0.99] disabled:opacity-50"
            >
              {isJoining ? 'Connexion...' : 'Rejoindre le salon'}
            </button>
          </form>
        </div>
      ) : (
        <>
          {/* Pastille joueur aux couleurs exactes du classement TV (Rang + Nom + Points) */}
          <header
            style={{
              backgroundColor: playerPalette.bg,
              borderColor: playerPalette.border,
              color: playerPalette.text,
            }}
            className="relative z-10 flex items-center justify-between gap-2.5 rounded-2xl border-2 px-3.5 py-2.5 shadow-lg shrink-0"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                style={{
                  backgroundColor: playerPalette.badgeBg,
                  color: playerPalette.badgeText,
                }}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-extrabold shrink-0"
              >
                {playerRank}
              </span>
              <span className="font-bold text-lg truncate">{playerName}</span>
            </div>

            <span
              style={{
                backgroundColor: playerPalette.badgeBg,
                color: playerPalette.badgeText,
              }}
              className="rounded-xl px-3.5 py-1 text-base font-extrabold shrink-0"
            >
              {score} pts
            </span>
          </header>

          {/* Infos question + chrono */}
          <div className="relative z-10 flex items-center justify-between px-1 py-1.5 shrink-0">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-300">
              Question {currentQuestionIndex + 1}
              {roomCode ? ` • Salon ${roomCode}` : ''}
            </span>
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-white/[0.12] border border-white/20 text-white tabular-nums">
              {timeLeft}s
            </span>
          </div>

          {/* Grille compacte A / B / C / D */}
          <section className="relative z-10 grid grid-cols-2 gap-3 flex-1 min-h-0 max-h-[58dvh]">
            {CHOICES.map((item) => {
              const isSelected = activeChoice === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  disabled={hasAnswered || isSubmitting || timeLeft <= 0}
                  onClick={() => void handleSelectChoice(item.key)}
                  className={`rounded-[24px] border-2 flex flex-col items-center justify-center font-black text-3xl sm:text-4xl transition-transform ${
                    item.bgClass
                  } ${
                    isSelected
                      ? 'border-white scale-[0.98] ring-4 ring-white/45'
                      : 'border-white/25'
                  } disabled:opacity-80`}
                >
                  <span>{item.key}</span>
                  {isSelected && (
                    <span className="mt-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/35 text-white">
                      Choisi
                    </span>
                  )}
                </button>
              );
            })}
          </section>

          {/* Bandeau statut en bas dans le thème vitré */}
          <footer className="relative z-10 mt-2 rounded-2xl bg-white/[0.1] backdrop-blur-xl border border-white/20 px-4 py-2.5 flex items-center justify-between shrink-0">
            <span className="text-sm font-semibold text-sky-100 truncate">
              {hasAnswered
                ? `Réponse ${activeChoice ?? player?.answer} envoyée`
                : 'Touchez une case pour répondre'}
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${
                hasAnswered
                  ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/40'
                  : 'bg-white/[0.12] text-slate-200'
              }`}
            >
              {hasAnswered ? 'Validé' : 'En attente'}
            </span>
          </footer>
        </>
      )}
    </main>
  );
}
