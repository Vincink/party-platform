'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

interface QuizQuestion {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
}

interface CardPalette {
  bg: string;
  border: string;
  text: string;
  badgeBg: string;
  badgeText: string;
}

interface OptionColorStyle {
  bg: string;
  border: string;
  letterBadgeBg: string;
}

const OPTION_STYLES: OptionColorStyle[] = [
  {
    bg: '#dc2626',
    border: '#fca5a5',
    letterBadgeBg: 'rgba(15, 23, 42, 0.35)',
  },
  {
    bg: '#eab308',
    border: '#fde047',
    letterBadgeBg: 'rgba(15, 23, 42, 0.35)',
  },
  {
    bg: '#2563eb',
    border: '#93c5fd',
    letterBadgeBg: 'rgba(15, 23, 42, 0.35)',
  },
  {
    bg: '#16a34a',
    border: '#86efac',
    letterBadgeBg: 'rgba(15, 23, 42, 0.35)',
  },
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

const BASE_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: 'Culture Générale',
    question: 'Quelle est la capitale de la Belgique ?',
    options: ['Anvers', 'Bruxelles', 'Liège', 'Gand'],
    correctIndex: 1,
  },
  {
    id: 2,
    category: 'Sciences',
    question: 'Quelle planète est la plus proche du Soleil ?',
    options: ['Vénus', 'Mars', 'Mercure', 'Jupiter'],
    correctIndex: 2,
  },
  {
    id: 3,
    category: 'Musique & Cinéma',
    question: 'Combien de notes comporte une gamme diatonique majeure ?',
    options: ['5 notes', '6 notes', '7 notes', '8 notes'],
    correctIndex: 2,
  },
];

const QUIZ_DURATION = 12;

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
      badgeBg: 'rgba(15, 23, 42, 0.35)',
      badgeText: '#ffffff',
    };
  }

  usedIndices.add(idx);
  return CARD_PALETTES[idx];
}

export default function TvQuizPage() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState<string>('');
  const [room, setRoom] = useState<RoomRow | null>(null);
  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(QUIZ_DURATION);

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

    const active = urlCode || storedCode;
    if (active) {
      window.localStorage.setItem('party_tv_room_code', active);
      setRoomCode(active);
    }
  }, []);

  const refreshQuizData = useCallback(async () => {
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
      if (typeof cfg.question_index === 'number' && cfg.question_index >= 0) {
        const normalizedIdx = cfg.question_index % BASE_QUESTIONS.length;
        setQuestionIndex((prev) => {
          if (prev !== normalizedIdx) {
            setTimeLeft(QUIZ_DURATION);
          }
          return normalizedIdx;
        });
      }

      const { data: roomPlayers } = await supabase
        .from('players')
        .select('id, pseudo, avatar, score, is_connected, answer, room_code, client_id')
        .eq('room_code', targetRoom.room_code)
        .order('score', { ascending: false });

      if (Array.isArray(roomPlayers)) {
        setPlayers(roomPlayers as PlayerRow[]);
      }
    }
  }, [roomCode]);

  useEffect(() => {
    void refreshQuizData();

    const channel = supabase.channel(`tv-quiz-${roomCode || 'latest'}`);

    if (roomCode) {
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'players', filter: `room_code=eq.${roomCode}` },
        () => {
          void refreshQuizData();
        }
      );
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rooms', filter: `room_code=eq.${roomCode}` },
        () => {
          void refreshQuizData();
        }
      );
    } else {
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'players' },
        () => {
          void refreshQuizData();
        }
      );
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rooms' },
        () => {
          void refreshQuizData();
        }
      );
    }

    channel.subscribe();

    const pollId = window.setInterval(() => {
      void refreshQuizData();
    }, 2500);

    return () => {
      window.clearInterval(pollId);
      void supabase.removeChannel(channel);
    };
  }, [roomCode, refreshQuizData]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerId = window.setInterval(() => {
      setTimeLeft((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [questionIndex, timeLeft]);

  const syncQuestionIndex = async (nextIdx: number) => {
    if (timeLeft > 0) return;

    const normalized =
      ((nextIdx % BASE_QUESTIONS.length) + BASE_QUESTIONS.length) % BASE_QUESTIONS.length;
    setQuestionIndex(normalized);
    setTimeLeft(QUIZ_DURATION);

    const activeCode = room?.room_code || roomCode;
    if (!activeCode) return;

    const currentCfg = parseConfig(room?.config);
    const nextCfg: RoomConfig = {
      ...currentCfg,
      game_mode: 'quiz',
      question_index: normalized,
      time_left: QUIZ_DURATION,
    };

    await supabase
      .from('rooms')
      .update({ config: nextCfg })
      .eq('room_code', activeCode);
  };

  const handleBackToLobby = async () => {
    const activeCode = room?.room_code || roomCode;
    if (activeCode) {
      await supabase
        .from('rooms')
        .update({ status: 'lobby' })
        .eq('room_code', activeCode);
    }
    const query = activeCode ? `?code=${encodeURIComponent(activeCode)}` : '';
    router.push(`/tv${query}`);
  };

  const activeRoomCode = room?.room_code || roomCode || 'SALON';
  const currentQuestion = BASE_QUESTIONS[questionIndex] || BASE_QUESTIONS[0];
  const isTimeOver = timeLeft <= 0;
  const isDangerBlink = timeLeft > 0 && timeLeft <= 5;
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
        @keyframes redChronoBlink {
          0%, 100% {
            background-color: #dc2626;
            border-color: #fca5a5;
            color: #ffffff;
            transform: scale(1);
          }
          50% {
            background-color: rgba(220, 38, 38, 0.25);
            border-color: #ef4444;
            color: #fecaca;
            transform: scale(1.06);
          }
        }
        .chrono-blink-red {
          animation: redChronoBlink 0.7s ease-in-out infinite;
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
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => void handleBackToLobby()}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.12] hover:bg-white/[0.2] border border-white/20 text-white cursor-pointer transition"
          >
            ← Salon
          </button>
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-300">
            Quiz TV • Salon {activeRoomCode}
          </span>
        </div>

        <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.16em] bg-white/[0.12] border border-white/20 text-sky-200 backdrop-blur-xl">
          Question {questionIndex + 1} / {BASE_QUESTIONS.length}
        </span>
      </header>

      <section className="relative z-10 max-w-7xl w-full mx-auto flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-stretch">
        {/* Zone principale : Chrono en haut à droite + Question plus grande et plus basse + Cases réponse remontées */}
        <div className="relative h-full min-h-0 p-6 md:p-8 rounded-[32px] bg-gradient-to-b from-white/[0.16] via-white/[0.08] to-slate-900/65 backdrop-blur-2xl border border-white/25 flex flex-col justify-between gap-4">
          <div className="flex items-start justify-end shrink-0">
            <span
              className={`inline-flex items-center px-5 py-2.5 rounded-2xl text-2xl sm:text-3xl font-black uppercase tracking-[0.1em] border tabular-nums shrink-0 ${
                isDangerBlink
                  ? 'chrono-blink-red shadow-[0_0_24px_rgba(239,68,68,0.75)]'
                  : 'bg-white/[0.14] border-white/25 text-white'
              }`}
            >
              {timeLeft}s
            </span>
          </div>

          <div className="mt-6 mb-3 px-4 sm:px-10 text-center flex flex-col items-center justify-center gap-2 shrink-0">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
              {currentQuestion.category}
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight max-w-4xl">
              {currentQuestion.question}
            </h1>
          </div>

          <div className="mt-auto mb-6 flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQuestion.options.map((opt, idx) => {
                const colorStyle = OPTION_STYLES[idx] || OPTION_STYLES[0];
                const isCorrect = isTimeOver && idx === currentQuestion.correctIndex;
                const isDimmed = isTimeOver && idx !== currentQuestion.correctIndex;

                return (
                  <div
                    key={opt}
                    style={{
                      backgroundColor: colorStyle.bg,
                      borderColor: isCorrect ? '#ffffff' : colorStyle.border,
                      opacity: isDimmed ? 0.45 : 1,
                    }}
                    className={`h-28 sm:h-32 rounded-[24px] border-2 px-5 flex items-center justify-between gap-3 transition-all duration-300 ${
                      isCorrect
                        ? 'ring-4 ring-white shadow-[0_16px_36px_-6px_rgba(255,255,255,0.55)] scale-[1.02]'
                        : 'shadow-md'
                    }`}
                  >
                    <span
                      style={{ backgroundColor: colorStyle.letterBadgeBg }}
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl font-black text-white shrink-0"
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>

                    <span className="flex-1 text-center text-3xl sm:text-4xl font-bold text-white truncate">
                      {opt}
                    </span>

                    <span className="w-14 shrink-0" aria-hidden="true" />
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 shrink-0 pt-2">
              <button
                type="button"
                disabled={timeLeft > 0}
                onClick={() => void syncQuestionIndex(questionIndex - 1)}
                className="px-4 py-3 rounded-2xl bg-white/[0.12] hover:bg-white/[0.2] border border-white/20 text-sm font-semibold text-white cursor-pointer transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Précédente
              </button>

              <button
                type="button"
                disabled={timeLeft > 0}
                onClick={() => void syncQuestionIndex(questionIndex + 1)}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 text-sm font-bold cursor-pointer transition hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Question suivante
              </button>
            </div>
          </div>
        </div>

        {/* Classement des joueurs */}
        <div className="h-full min-h-0 p-5 md:p-6 rounded-[32px] bg-gradient-to-b from-white/[0.16] via-white/[0.08] to-slate-900/65 backdrop-blur-2xl border border-white/25 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between gap-2 shrink-0">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
                Classement
              </span>
              <h2 className="text-xl font-semibold tracking-tight text-white">
                Joueurs
              </h2>
            </div>
            <span className="inline-flex items-center justify-center min-w-8 h-8 px-2.5 rounded-full text-xs font-semibold bg-white/[0.14] border border-white/20 text-white">
              {players.length}
            </span>
          </div>

          {players.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center px-4">
              <p className="text-sm text-slate-300">
                Aucun joueur dans le salon.
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
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold shrink-0"
                      >
                        {index + 1}
                      </span>
                      <p
                        className="font-bold text-2xl truncate"
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
                      className="rounded-xl px-4 py-1.5 text-xl sm:text-2xl font-extrabold shrink-0"
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
          Synchronisation temps réel • Mode Quiz
        </p>
      </footer>
    </main>
  );
}
