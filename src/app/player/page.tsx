'use client'

export const dynamic = 'force-dynamic'

import { Suspense, useEffect, useState, useRef, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import type { Viewport } from 'next'
import { supabase } from '@/lib/supabase'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

type ChoiceKey = 'A' | 'B' | 'C' | 'D'
type GameType = 'quiz'

interface PlayerRow {
  id: number
  score?: number | null
}

const CHOICES: { key: ChoiceKey; label: string; style: string }[] = [
  {
    key: 'A',
    label: 'A',
    style: 'bg-rose-600 border-rose-300 text-white shadow-[0_0_20px_rgba(225,29,72,0.4)]',
  },
  {
    key: 'B',
    label: 'B',
    style: 'bg-blue-600 border-blue-300 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]',
  },
  {
    key: 'C',
    label: 'C',
    style: 'bg-amber-400 border-amber-200 text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.4)]',
  },
  {
    key: 'D',
    label: 'D',
    style: 'bg-emerald-600 border-emerald-300 text-white shadow-[0_0_20px_rgba(5,150,105,0.4)]',
  },
]

const CLIENT_ID_STORAGE_KEY = 'quiz_player_client_id'

function getOrCreateClientId(): string {
  if (typeof window === 'undefined') return ''
  let existing = window.localStorage.getItem(CLIENT_ID_STORAGE_KEY)
  if (!existing) {
    existing = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
    window.localStorage.setItem(CLIENT_ID_STORAGE_KEY, existing)
  }
  return existing
}

function computeDenseRankForPlayer(players: PlayerRow[], targetId: number | null): number {
  if (!targetId || players.length === 0) return 1
  const sorted = [...players].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

  let currentRank = 1
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0) {
      const prevScore = sorted[i - 1].score ?? 0
      const currScore = sorted[i].score ?? 0
      if (currScore < prevScore) {
        currentRank += 1
      }
    }
    if (sorted[i].id === targetId) {
      return currentRank
    }
  }
  return 1
}

function PlayerContent() {
  const searchParams = useSearchParams()
  const initialPin = (searchParams.get('pin') || '').replace(/\D/g, '').slice(0, 4)

  const [pin, setPin] = useState<string>(initialPin)
  const [pseudo, setPseudo] = useState<string>('')
  const [joined, setJoined] = useState<boolean>(false)
  const [playerId, setPlayerId] = useState<number | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<ChoiceKey | null>(null)
  const [score, setScore] = useState<number>(0)
  const [rank, setRank] = useState<number>(1)
  const [gameType, setGameType] = useState<GameType>('quiz')
  const [roomStatus, setRoomStatus] = useState<string>('waiting')
  const [lastOutcome, setLastOutcome] = useState<'correct' | 'wrong' | null>(null)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const wakeLockRef = useRef<{ release: () => Promise<void> } | null>(null)
  const lockedAnswerRef = useRef<ChoiceKey | null>(null)
  const submittingAnswerRef = useRef<boolean>(false)
  const scoreRef = useRef<number>(0)

  useEffect(() => {
    scoreRef.current = score
  }, [score])

  useEffect(() => {
    if (initialPin && !pin) {
      setPin(initialPin)
    }
  }, [initialPin, pin])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const preventPinchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    }

    const preventGesture = (e: Event) => {
      e.preventDefault()
    }

    document.addEventListener('touchmove', preventPinchMove, { passive: false })
    document.addEventListener('gesturestart', preventGesture, { passive: false })
    document.addEventListener('gesturechange', preventGesture, { passive: false })

    return () => {
      document.removeEventListener('touchmove', preventPinchMove)
      document.removeEventListener('gesturestart', preventGesture)
      document.removeEventListener('gesturechange', preventGesture)
    }
  }, [])

  const requestScreenWakeLock = useCallback(async () => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return
    if (document.visibilityState !== 'visible') return

    const nav = navigator as Navigator & {
      wakeLock?: {
        request: (type: 'screen') => Promise<{ release: () => Promise<void> }>
      }
    }

    if (!nav.wakeLock) return

    try {
      if (wakeLockRef.current) return
      wakeLockRef.current = await nav.wakeLock.request('screen')
    } catch {
      // Ignoré si le navigateur ou le mode économie d'énergie refuse le verrou
    }
  }, [])

  useEffect(() => {
    if (!joined) return

    void requestScreenWakeLock()

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void requestScreenWakeLock()
      } else if (wakeLockRef.current) {
        void wakeLockRef.current.release().catch(() => {})
        wakeLockRef.current = null
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (wakeLockRef.current) {
        void wakeLockRef.current.release().catch(() => {})
        wakeLockRef.current = null
      }
    }
  }, [joined, requestScreenWakeLock])

  const refreshRank = useCallback(async (roomPin: string, currentPlayerId: number | null) => {
    if (!roomPin || !currentPlayerId) return
    const { data } = await supabase
      .from('players')
      .select('id, score')
      .eq('session_id', roomPin)

    if (data && data.length > 0) {
      setRank(computeDenseRankForPlayer(data, currentPlayerId))
    }
  }, [])

  const unlockQuestionChoice = useCallback(() => {
    lockedAnswerRef.current = null
    submittingAnswerRef.current = false
    setSelectedAnswer(null)
    setLastOutcome(null)
  }, [])

  const applyRoomStatus = useCallback(
    (nextStatus: string, roomPin: string, currentPlayerId: number | null) => {
      setRoomStatus(nextStatus)

      if (nextStatus.startsWith('playing')) {
        unlockQuestionChoice()
      } else if (nextStatus === 'waiting') {
        unlockQuestionChoice()
      } else if (nextStatus.startsWith('revealed:')) {
        void refreshRank(roomPin, currentPlayerId)
        const parts = nextStatus.split(':')
        const correctLetter = (parts[2] || '') as ChoiceKey | ''
        const chosen = lockedAnswerRef.current

        if (chosen && correctLetter) {
          setLastOutcome(chosen === correctLetter ? 'correct' : 'wrong')
        }
      }
    },
    [refreshRank, unlockQuestionChoice]
  )

  useEffect(() => {
    if (!joined || !pin) return

    async function syncRoom() {
      const { data } = await supabase
        .from('rooms')
        .select('status, game_type')
        .eq('room_code', pin)
        .maybeSingle()

      if (data?.game_type === 'quiz') {
        setGameType('quiz')
      }
      if (data?.status) {
        applyRoomStatus(String(data.status), pin, playerId)
      }
      await refreshRank(pin, playerId)
    }
    void syncRoom()

    const pollInterval = window.setInterval(() => {
      void syncRoom()
    }, 1500)

    const channel = supabase
      .channel('player-room-' + pin + '-' + (playerId ?? 'anon'))
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rooms',
          filter: `room_code=eq.${pin}`,
        },
        (payload) => {
          const row = payload.new as { status?: string; game_type?: string }
          if (row?.game_type === 'quiz') {
            setGameType('quiz')
          }
          if (row?.status) {
            applyRoomStatus(String(row.status), pin, playerId)
          }
        }
      )
      .subscribe()

    return () => {
      window.clearInterval(pollInterval)
      supabase.removeChannel(channel)
    }
  }, [joined, pin, playerId, applyRoomStatus, refreshRank])

  useEffect(() => {
    if (!joined || !pin || !playerId) return

    const channel = supabase
      .channel('player-scores-' + pin + '-' + playerId)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
          filter: `session_id=eq.${pin}`,
        },
        (payload) => {
          const row = payload.new as { id?: number; score?: number | null; answer?: string | null }
          if (row?.id === playerId) {
            if (typeof row.score === 'number') {
              const prevScore = scoreRef.current
              const nextScore = row.score
              if (lockedAnswerRef.current && nextScore !== prevScore) {
                setLastOutcome(nextScore > prevScore ? 'correct' : 'wrong')
              }
              setScore(nextScore)
            }
            // Si une réponse est déjà verrouillée localement, on ne l'écrase jamais
            if (!lockedAnswerRef.current && (row.answer === 'A' || row.answer === 'B' || row.answer === 'C' || row.answer === 'D')) {
              lockedAnswerRef.current = row.answer
              setSelectedAnswer(row.answer)
            }
          }
          void refreshRank(pin, playerId)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [joined, pin, playerId, refreshRank])

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')
    void requestScreenWakeLock()

    const cleanPin = pin.trim()
    const cleanPseudo = pseudo.trim()

    if (cleanPin.length !== 4) {
      setErrorMsg('Entre un code PIN à 4 chiffres.')
      return
    }
    if (!cleanPseudo) {
      setErrorMsg('Entre ton prénom ou pseudo.')
      return
    }

    setLoading(true)

    const { data: room, error: roomErr } = await supabase
      .from('rooms')
      .select('room_code, status, game_type')
      .eq('room_code', cleanPin)
      .maybeSingle()

    if (roomErr || !room) {
      setLoading(false)
      setErrorMsg('Salon introuvable. Vérifie le PIN.')
      return
    }

    const clientId = getOrCreateClientId()

    const { data: existingPlayer } = await supabase
      .from('players')
      .select('id, score, answer')
      .eq('session_id', cleanPin)
      .eq('client_id', clientId)
      .maybeSingle()

    if (existingPlayer) {
      const { error: updErr } = await supabase
        .from('players')
        .update({ pseudo: cleanPseudo })
        .eq('id', existingPlayer.id)

      setLoading(false)
      if (updErr) {
        setErrorMsg(updErr.message)
        return
      }

      const restoredAnswer =
        existingPlayer.answer === 'A' ||
        existingPlayer.answer === 'B' ||
        existingPlayer.answer === 'C' ||
        existingPlayer.answer === 'D'
          ? existingPlayer.answer
          : null

      lockedAnswerRef.current = restoredAnswer
      submittingAnswerRef.current = false
      setPlayerId(existingPlayer.id)
      setScore(existingPlayer.score ?? 0)
      setSelectedAnswer(restoredAnswer)
      setRoomStatus(room.status || 'waiting')
      if (room.game_type === 'quiz') {
        setGameType('quiz')
      }
      setJoined(true)
      void refreshRank(cleanPin, existingPlayer.id)
      return
    }

    const { data: inserted, error: insErr } = await supabase
      .from('players')
      .insert([
        {
          session_id: cleanPin,
          pseudo: cleanPseudo,
          client_id: clientId,
          score: 0,
          answer: null,
        },
      ])
      .select('id, score')
      .single()

    setLoading(false)
    if (insErr || !inserted) {
      setErrorMsg(insErr?.message || 'Impossible de rejoindre le salon.')
      return
    }

    lockedAnswerRef.current = null
    submittingAnswerRef.current = false
    setPlayerId(inserted.id)
    setScore(inserted.score ?? 0)
    setSelectedAnswer(null)
    setRoomStatus(room.status || 'waiting')
    if (room.game_type === 'quiz') {
      setGameType('quiz')
    }
    setJoined(true)
    void refreshRank(cleanPin, inserted.id)
  }

  async function handleSelectAnswer(choice: ChoiceKey) {
    if (!playerId || lockedAnswerRef.current || submittingAnswerRef.current) return
    submittingAnswerRef.current = true
    lockedAnswerRef.current = choice
    setSelectedAnswer(choice)
    void requestScreenWakeLock()

    const { error } = await supabase
      .from('players')
      .update({ answer: choice })
      .eq('id', playerId)
      .is('answer', null)

    submittingAnswerRef.current = false
    if (error) {
      setErrorMsg(error.message)
    }
  }

  const isRevealed = roomStatus.startsWith('revealed:') || Boolean(lastOutcome)
  const isLocked = Boolean(selectedAnswer) || isRevealed || roomStatus === 'finished'

  return (
    <main className="h-dvh w-screen overflow-hidden overscroll-none select-none bg-slate-950 text-white flex flex-col px-4 pt-12 pb-5">
      {!joined ? (
        <form
          onSubmit={handleJoin}
          className="max-w-md w-full mx-auto my-auto bg-slate-900 border border-slate-800 p-7 rounded-3xl shadow-2xl space-y-5"
        >
          <div className="text-center space-y-1">
            <p className="text-xs uppercase tracking-widest text-indigo-400 font-bold">
              Manette Joueur
            </p>
            <h1 className="text-3xl font-black">Rejoindre la partie</h1>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500 text-rose-200 text-sm font-semibold text-center">
              {errorMsg}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold">
              Code PIN (4 chiffres)
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="1234"
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-950 border-2 border-slate-700 focus:border-indigo-400 outline-none text-center text-3xl font-black tracking-widest"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold">
              Ton prénom
            </label>
            <input
              type="text"
              maxLength={24}
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              placeholder="Ex : Thomas"
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-950 border-2 border-slate-700 focus:border-indigo-400 outline-none text-xl font-bold"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black text-xl transition-colors touch-manipulation"
          >
            {loading ? 'Connexion...' : '🎮 Entrer dans le salon'}
          </button>
        </form>
      ) : (
        <div className="max-w-lg w-full mx-auto flex-1 flex flex-col justify-between gap-4">
          {/* Pastille joueur positionnée sous la Dynamic Island */}
          <div className="bg-slate-900 border-2 border-cyan-400/80 shadow-[0_0_20px_rgba(34,211,238,0.25)] px-4 py-3 rounded-3xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="px-3 py-1 rounded-2xl bg-cyan-400/15 border border-cyan-400/50 text-cyan-300 text-xl font-black shrink-0">
                #{rank}
              </span>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                  PIN {pin}
                </p>
                <p className="text-xl font-black truncate">{pseudo}</p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                Score
              </p>
              <p className="text-2xl font-black text-white">{score} pts</p>
            </div>
          </div>

          {/* Zone des 4 boutons du Quiz */}
          {gameType === 'quiz' && (
            <div className="grid grid-cols-2 gap-3">
              {CHOICES.map((item) => {
                const isSelected = selectedAnswer === item.key
                const dimOther = Boolean(selectedAnswer) && !isSelected

                return (
                  <button
                    key={item.key}
                    type="button"
                    disabled={isLocked}
                    onClick={() => void handleSelectAnswer(item.key)}
                    className={`h-28 sm:h-32 rounded-3xl border-4 flex items-center justify-center text-4xl sm:text-5xl font-black transition-all touch-manipulation ${
                      item.style
                    } ${
                      isSelected
                        ? 'ring-4 ring-white scale-[0.98] brightness-110'
                        : dimOther
                        ? 'opacity-35 scale-[0.96]'
                        : 'active:scale-95'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          )}

          {/* Message d'état discret en bas */}
          <div className="bg-slate-900/90 border border-slate-800 px-4 py-2.5 rounded-2xl text-center">
            {roomStatus === 'waiting' && (
              <p className="text-sm font-bold text-slate-300">
                En attente du lancement sur la TV...
              </p>
            )}
            {roomStatus === 'finished' && (
              <p className="text-sm font-black text-amber-300">
                Partie terminée — regarde le podium sur la TV !
              </p>
            )}
            {isRevealed && lastOutcome === 'correct' && (
              <p className="text-base font-black text-emerald-400">
                Bonne réponse (+10 pts)
              </p>
            )}
            {isRevealed && lastOutcome === 'wrong' && (
              <p className="text-base font-black text-rose-400">
                Mauvaise réponse (-5 pts)
              </p>
            )}
            {isRevealed && !lastOutcome && (
              <p className="text-sm font-bold text-slate-400">
                Réponse révélée sur la TV
              </p>
            )}
            {!isRevealed && roomStatus !== 'waiting' && roomStatus !== 'finished' && (
              <p className="text-sm font-bold text-indigo-300">
                {selectedAnswer
                  ? `Choix ${selectedAnswer} verrouillé`
                  : 'Choisis A, B, C ou D avant la fin du chrono'}
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  )
}

export default function PlayerPage() {
  return (
    <Suspense
      fallback={
        <main className="h-dvh w-screen overflow-hidden bg-slate-950 text-white flex items-center justify-center font-bold">
          Chargement...
        </main>
      }
    >
      <PlayerContent />
    </Suspense>
  )
}
