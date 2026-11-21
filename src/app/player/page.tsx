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

function parseRoomConfig(raw: RoomRow['config']): RoomConfig {
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

  const prevQuestionIndexRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const urlCode = (params.get('code') || params.get('room') || params.get('room_code') || '')
      .trim()
      .toUpperCase();
    const urlClient = (params.get('client') || params.get('client_id') || '').trim();

    const storedCode = (window.localStorage.getItem('party_room_code') || '').trim().toUpperCase();
    const storedClient = (window.localStorage.getItem('party_client_id') || '').trim();

    const resolvedCode = urlCode || storedCode;
    const resolvedClient = urlClient || storedClient;

    if (resolvedCode) {
      window.localStorage.setItem('party_room_code', resolvedCode);
      setRoomCode(resolvedCode);
    }

    if (resolvedClient) {
      window.localStorage.setItem('party_client_id', resolvedClient);
      setClientId(resolvedClient);
    }
  }, []);

  const currentQuestionIndex = useMemo(() => getQuestionIndex(room), [room]);

  const timeLeft = useMemo(() => {
    const cfg = parseRoomConfig(room?.config);
    return typeof cfg.time_left === 'number' ? cfg.time_left : 15;
  }, [room]);

  const syncData = useCallback(async () => {
    if (!roomCode) return;

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

    let playerQuery = supabase
      .from('players')
      .select('id, pseudo, avatar, score, is_connected, answer, room_code, client_id')
      .eq('room_code', roomCode)
      .order('id', { ascending: false })
      .limit(1);

    if (clientId) {
      playerQuery = playerQuery.eq('client_id', clientId);
    }

    let { data: playerData } = await playerQuery.maybeSingle();

    if (!playerData && clientId) {
      const fallback = await supabase
        .from('players')
        .select('id, pseudo, avatar, score, is_connected, answer, room_code, client_id')
        .eq('room_code', roomCode)
        .order('id', { ascending: false })
        .limit(1)
        .maybeSingle();
      playerData = fallback.data;
    }

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
    if (prevQuestionIndexRef.current === null) {
      prevQuestionIndexRef.current = currentQuestionIndex;
      return;
    }

    if (prevQuestionIndexRef.current !== currentQuestionIndex) {
      prevQuestionIndexRef.current = currentQuestionIndex;
      setSelectedChoice(null);

      if (roomCode && (player?.id || clientId)) {
        let query = supabase.from('players').update({ answer: null });
        if (player?.id) {
          query = query.eq('id', player.id);
        } else {
          query = query.eq('room_code', roomCode).eq('client_id', clientId);
        }
        void query;
      }
    }
  }, [currentQuestionIndex, roomCode, player?.id, clientId]);

  useEffect(() => {
    if (!roomCode) return;

    void syncData();

    const channel = supabase
      .channel(`player-page-${roomCode}-${clientId || 'default'}`)
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
  }, [roomCode, clientId, syncData]);

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

  const playerName = player?.pseudo?.trim() || 'Joueur';
  const playerColor = player?.avatar?.trim() || '#10b981';
  const score = typeof player?.score === 'number' ? player.score : 0;
  const activeChoice: ChoiceKey | null =
    selectedChoice ?? (isChoiceKey(player?.answer) ? player.answer : null);
  const hasAnswered =
    activeChoice !== null || Boolean(player?.answer && player.answer.trim().length > 0);

  return (
    <main className="h-[100dvh] w-full overflow-hidden bg-slate-950 text-white flex flex-col justify-between px-3 py-2.5 select-none touch-manipulation">
      {/* Bandeau supérieur : Pastille joueur + État + Score */}
      <header className="flex items-center justify-between gap-2 rounded-2xl bg-slate-900/95 border border-white/10 px-3 py-2 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
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

        <span className="bg-emerald-600 text-white font-extrabold text-sm px-3 py-1 rounded-xl shrink-0">
          {score} pts
        </span>
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
    </main>
  );
}
