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

const CHOICES: ChoiceItem[] = [
  { key: 'A', bgClass: 'bg-red-600 active:bg-red-700' },
  { key: 'B', bgClass: 'bg-amber-400 text-slate-950 active:bg-amber-500' },
  { key: 'C', bgClass: 'bg-blue-600 active:bg-blue-700' },
  { key: 'D', bgClass: 'bg-emerald-600 active:bg-emerald-700' },
];

const AVATAR_COLORS: string[] = [
  '#10b981',
  '#3b82f6',
  '#f59e0b',
  '#ec4899',
  '#8b5cf6',
  '#ef4444',
  '#06b6d4',
  '#f97316',
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

export default function PlayerPage() {
  const [roomCode, setRoomCode] = useState<string>('');
  const [clientId, setClientId] = useState<string>('');
  const [player, setPlayer] = useState<PlayerRow | null>(null);
  const [room, setRoom] = useState<RoomRow | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<ChoiceKey | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [pseudoInput, setPseudoInput] = useState<string>('');
  const [roomInput, setRoomInput] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>(AVATAR_COLORS[0]);
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

  // Verrouillage strict du zoom (gestes iOS Safari + double-tap + molette Ctrl)
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

  // Résolution initiale du room_code, client_id et pseudo enregistré
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const urlCode = (params.get('code') || params.get('room') || params.get('room_code') || '')
      .trim()
      .toUpperCase();
    const urlClient = (params.get('client') || params.get('client_id') || '').trim();

    const storedCode = (window.localStorage.getItem('party_room_code') || '').trim().toUpperCase();
    let storedClient = (window.localStorage.getItem('party_client_id') || '').trim();
    const storedPseudo = (window.localStorage.getItem('party_player_pseudo') || '').trim();
    const storedColor = (window.localStorage.getItem('party_player_color') || '').trim();

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
    if (storedColor) {
      setSelectedColor(storedColor);
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
        window.localStorage.setItem('party_player_color', selectedColor);
      }
      setClientId(activeClientId);
      setRoomCode(cleanCode);

      // Vérifier si ce téléphone (client_id) existe déjà dans ce salon
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
            avatar: selectedColor,
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
            avatar: selectedColor,
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

  // Signaler la déconnexion quand le joueur quitte ou ferme l'onglet
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

  const handleLeaveRoom = async () => {
    if (player?.id) {
      await supabase.from('players').update({ is_connected: false }).eq('id', player.id);
    } else if (roomCode && clientId) {
      await supabase
        .from('players')
        .update({ is_connected: false })
        .eq('room_code', roomCode)
        .eq('client_id', clientId);
    }
    setIsJoined(false);
  };

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

    const { data: playerData } = await supabase
      .from('players')
      .select('id, pseudo, avatar, score, is_connected, answer, room_code, client_id')
      .eq('room_code', roomCode)
      .eq('client_id', clientId)
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (playerData) {
      const row = playerData as PlayerRow;
      setPlayer(row);
      if (isChoiceKey(row.answer)) {
        setSelectedChoice(row.answer);
      } else if (row.answer === null) {
        setSelectedChoice(null);
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
  const playerColor = player?.avatar?.trim() || selectedColor;
  const score = typeof player?.score === 'number' ? player.score : 0;
  const activeChoice: ChoiceKey | null =
    selectedChoice ?? (isChoiceKey(player?.answer) ? player.answer : null);
  const hasAnswered =
    activeChoice !== null || Boolean(player?.answer && player.answer.trim().length > 0);

  return (
    <main className="fixed inset-0 h-[100dvh] w-full overflow-hidden overscroll-none bg-slate-950 text-white flex flex-col justify-between px-3 py-2.5 select-none touch-none">
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
        }
      `}</style>

      {!isJoined ? (
        <div className="flex-1 flex flex-col items-center justify-center px-3">
          <form
            onSubmit={(e) => void handleJoinRoom(e)}
            className="w-full max-w-sm rounded-3xl bg-slate-900 border border-white/15 p-5 flex flex-col gap-4 shadow-2xl"
          >
            <div className="text-center">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-400">
                Rejoindre la partie
              </span>
              <h1 className="text-2xl font-extrabold tracking-tight text-white mt-1">
                Ton profil joueur
              </h1>
            </div>

            {!roomCode && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Code du salon
                </label>
                <input
                  type="text"
                  value={roomInput}
                  onChange={(e) => setRoomInput(e.target.value.toUpperCase())}
                  placeholder="Ex: ABC123"
                  maxLength={10}
                  autoCapitalize="characters"
                  className="w-full rounded-2xl bg-slate-950 border border-white/15 px-4 py-3 text-base font-bold uppercase tracking-widest text-white outline-none focus:border-sky-400 touch-auto"
                />
              </div>
            )}

            {roomCode && (
              <div className="rounded-2xl bg-slate-950/80 border border-white/10 px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Salon
                </span>
                <span className="text-sm font-black tracking-widest text-sky-300">
                  {roomCode}
                </span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Pseudo
              </label>
              <input
                type="text"
                value={pseudoInput}
                onChange={(e) => setPseudoInput(e.target.value)}
                placeholder="Entre ton pseudo"
                maxLength={18}
                autoComplete="off"
                className="w-full rounded-2xl bg-slate-950 border border-white/15 px-4 py-3 text-base font-bold text-white outline-none focus:border-sky-400 touch-auto"
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Couleur
              </span>
              <div className="grid grid-cols-8 gap-2">
                {AVATAR_COLORS.map((color) => {
                  const isCurrent = selectedColor === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: color }}
                      className={`h-8 w-8 rounded-full transition-transform ${
                        isCurrent ? 'scale-110 ring-2 ring-white' : 'opacity-75'
                      }`}
                      aria-label={`Couleur ${color}`}
                    />
                  );
                })}
              </div>
            </div>

            {joinError && (
              <p className="text-xs font-semibold text-red-400 text-center">
                {joinError}
              </p>
            )}

            <button
              type="submit"
              disabled={isJoining}
              className="mt-1 w-full rounded-2xl bg-gradient-to-r from-sky-400 to-cyan-400 py-3.5 text-base font-extrabold text-slate-950 transition active:scale-[0.99] disabled:opacity-50"
            >
              {isJoining ? 'Connexion...' : 'Entrer dans le salon'}
            </button>
          </form>
        </div>
      ) : (
        <>
          {/* Bandeau supérieur : Pastille joueur + État + Score */}
          <header className="flex items-center justify-between gap-2 rounded-2xl bg-slate-900/95 border border-white/10 px-3 py-2 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="h-4 w-4 rounded-full shrink-0 ring-2 ring-white/40"
                style={{ backgroundColor: playerColor }}
                aria-hidden="true"
              />
              <span className="font-bold text-base truncate">{playerName}</span>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${
                  hasAnswered
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                    : 'bg-white/10 text-slate-300'
                }`}
              >
                {hasAnswered
                  ? activeChoice
                    ? `Répondu (${activeChoice})`
                    : 'Répondu'
                  : 'En attente'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="bg-emerald-600 text-white font-extrabold text-sm px-3 py-1 rounded-xl">
                {score} pts
              </span>
              <button
                type="button"
                onClick={() => void handleLeaveRoom()}
                className="rounded-xl bg-white/10 px-2.5 py-1 text-xs font-semibold text-slate-300 active:bg-white/20"
                title="Changer de pseudo ou quitter"
              >
                Quitter
              </button>
            </div>
          </header>

          {/* Infos question + chrono */}
          <div className="flex items-center justify-between px-1 py-1 shrink-0">
            <span className="text-xs font-bold tracking-widest uppercase text-slate-400">
              Question {currentQuestionIndex + 1}
              {roomCode ? ` • ${roomCode}` : ''}
            </span>
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-slate-800 text-slate-100">
              {timeLeft}s
            </span>
          </div>

          {/* Grille compacte A / B / C / D */}
          <section className="grid grid-cols-2 gap-2.5 flex-1 min-h-0 max-h-[58dvh]">
            {CHOICES.map((item) => {
              const isSelected = activeChoice === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  disabled={hasAnswered || isSubmitting || timeLeft <= 0}
                  onClick={() => void handleSelectChoice(item.key)}
                  className={`rounded-2xl border-2 flex flex-col items-center justify-center font-black text-3xl sm:text-4xl transition-transform ${
                    item.bgClass
                  } ${
                    isSelected
                      ? 'border-white scale-[0.98] ring-4 ring-white/40'
                      : 'border-white/25'
                  } disabled:opacity-80`}
                >
                  <span>{item.key}</span>
                  {isSelected && (
                    <span className="mt-1 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/35 text-white">
                      Choisi
                    </span>
                  )}
                </button>
              );
            })}
          </section>

          {/* Pastille joueur bien visible en bas */}
          <footer className="mt-2 rounded-2xl bg-slate-900 border border-white/10 px-3.5 py-2 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="h-4 w-4 rounded-full shrink-0 ring-2 ring-white/30"
                style={{ backgroundColor: playerColor }}
                aria-hidden="true"
              />
              <span className="text-sm font-semibold text-slate-200 truncate">
                {hasAnswered
                  ? `${playerName} — Réponse ${activeChoice ?? player?.answer} envoyée`
                  : `${playerName} — Touchez une case`}
              </span>
            </div>
          </footer>
        </>
      )}
    </main>
  );
}
