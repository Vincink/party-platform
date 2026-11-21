'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

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

interface RoomRow {
  id: number;
  room_code: string;
  status: string | null;
  config: unknown;
}

interface TvPlayerState {
  id: string;
  name: string;
  color?: string;
  score: number;
  hasAnswered: boolean;
  answerValue?: string | null;
}

interface TvPlayersBarProps {
  players: TvPlayerState[];
}

function TvPlayersBar({ players }: TvPlayersBarProps) {
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
          <span
            className="h-4 w-4 rounded-full shrink-0 ring-2 ring-white/30"
            style={{ backgroundColor: player.color || '#38bdf8' }}
            aria-hidden="true"
          />

          <div className="flex flex-col min-w-0">
            <span className="font-bold text-base text-white leading-tight truncate">
              {player.name}
            </span>
            <span
              className={`text-xs font-semibold ${
                player.hasAnswered ? 'text-emerald-300' : 'text-slate-400'
              }`}
            >
              {player.hasAnswered ? '✓ A répondu' : 'En attente…'}
            </span>
          </div>

          <div className="ml-2 flex items-center gap-1.5">
            <span className="rounded-xl bg-white/10 px-3 py-1 text-sm font-extrabold text-white">
              {player.score} pts
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TvPage() {
  const [roomCode, setRoomCode] = useState<string>('');
  const [room, setRoom] = useState<RoomRow | null>(null);
  const [players, setPlayers] = useState<PlayerRow[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

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

    const activeCode = urlCode || storedCode;

    if (activeCode) {
      window.localStorage.setItem('party_tv_room_code', activeCode);
      setRoomCode(activeCode);
    }
  }, []);

  const refreshTvData = useCallback(async () => {
    let targetRoom: RoomRow | null = null;

    if (roomCode) {
      const { data: specificRoom } = await supabase
        .from('rooms')
        .select('id, room_code, status, config')
        .eq('room_code', roomCode)
        .order('id', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (specificRoom) {
        targetRoom = specificRoom as RoomRow;
      }
    }

    if (!targetRoom) {
      const { data: latestRoom } = await supabase
        .from('rooms')
        .select('id, room_code, status, config')
        .order('id', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latestRoom) {
        targetRoom = latestRoom as RoomRow;
        if (!roomCode && targetRoom.room_code) {
          setRoomCode(targetRoom.room_code);
        }
      }
    }

    if (targetRoom) {
      setRoom(targetRoom);

      const { data: playersData } = await supabase
        .from('players')
        .select('id, pseudo, avatar, score, is_connected, answer, room_code, client_id')
        .eq('room_code', targetRoom.room_code)
        .order('id', { ascending: true });

      if (Array.isArray(playersData)) {
        setPlayers(playersData as PlayerRow[]);
      }
    } else {
      const { data: fallbackPlayers } = await supabase
        .from('players')
        .select('id, pseudo, avatar, score, is_connected, answer, room_code, client_id')
        .order('id', { ascending: true });

      if (Array.isArray(fallbackPlayers)) {
        setPlayers(fallbackPlayers as PlayerRow[]);
      }
    }
  }, [roomCode]);

  useEffect(() => {
    void refreshTvData();

    const channel = supabase.channel(`tv-sync-${roomCode || 'latest'}`);

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

  const tvPlayers: TvPlayerState[] = players.map((p) => ({
    id: String(p.id),
    name: p.pseudo?.trim() || 'Joueur',
    color: p.avatar?.trim() || '#38bdf8',
    score: typeof p.score === 'number' ? p.score : 0,
    hasAnswered: typeof p.answer === 'string' && p.answer.trim().length > 0,
    answerValue: p.answer,
  }));

  const answeredCount = tvPlayers.filter((p) => p.hasAnswered).length;
  const activeRoomLabel = room?.room_code || roomCode;

  return (
    <main className="min-h-screen w-full bg-slate-950 text-white flex flex-col justify-between px-6 py-5">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Écran TV {activeRoomLabel ? `• Salon ${activeRoomLabel}` : ''}
          </p>
          <h1 className="text-2xl sm:text-3xl font-black truncate">
            {room?.status ? `État : ${room.status}` : 'En attente de la partie'}
          </h1>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-white/10 px-4 py-2 text-sm font-bold text-emerald-300 shrink-0">
          Réponses : {answeredCount} / {tvPlayers.length}
        </div>
      </header>

      <section className="my-auto py-6">
        {tvPlayers.length === 0 ? (
          <p className="text-center text-slate-400 text-lg">
            Aucun joueur connecté pour le moment.
          </p>
        ) : (
          <TvPlayersBar players={tvPlayers} />
        )}
      </section>

      <footer className="text-xs text-slate-500 text-center">
        Affichage synchronisé en direct avec la table joueurs.
      </footer>
    </main>
  );
}
