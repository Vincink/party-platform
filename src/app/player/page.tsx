'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface Player {
  id: string | number
  room_code: string
  pseudo: string
  score: number
  is_connected?: boolean | null
  client_id?: string | null
  avatar?: string | null
}

interface Room {
  id: string | number
  room_code: string
  status: string
  game_type: string | null
  current_game?: string | null
  current_round?: number | null
  config?: {
    quiz_started?: boolean
    question_index?: number
    time_left?: number
    [key: string]: unknown
  } | null
}

type ChoiceLetter = 'A' | 'B' | 'C' | 'D'

const CHOICE_BUTTONS: { letter: ChoiceLetter; bg: string; border: string }[] = [
  { letter: 'A', bg: '#dc2626', border: '#fca5a5' },
  { letter: 'B', bg: '#eab308', border: '#fef08a' },
  { letter: 'C', bg: '#2563eb', border: '#93c5fd' },
  { letter: 'D', bg: '#16a34a', border: '#86efac' },
]

const RANDOM_PLAYER_COLORS = [
  '#2563eb',
  '#059669',
  '#d97706',
  '#7c3aed',
  '#e11d48',
  '#0891b2',
  '#c026d3',
  '#ea580c',
  '#4f46e5',
  '#16a34a',
  '#db2777',
  '#0d9488',
]

function pickRandomColor(): string {
  return RANDOM_PLAYER_COLORS[Math.floor(Math.random() * RANDOM_PLAYER_COLORS.length)]
}

function getOrCreateClientId(): string {
  if (typeof window === 'undefined') return ''
  const key = 'tvos_party_client_id'
  let id = window.localStorage.getItem(key)
  if (!id) {
    id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `client_${Math.random().toString(36).slice(2, 11)}`
    window.localStorage.setItem(key, id)
  }
  return id
}

function PlayerContent() {
  const searchParams = useSearchParams()
  const initialCode = (searchParams.get('code') || '').trim().toUpperCase()

  const [roomCode, setRoomCode] = useState(initialCode)
  const [pseudo, setPseudo] = useState('')
  const [playerColor, setPlayerColor] = useState<string>(pickRandomColor)
  const [player, setPlayer] = useState<Player | null>(null)
  const [room, setRoom] = useState<Room | null>(null)
  const [joining, setJoining] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [selectedChoice, setSelectedChoice] = useState<ChoiceLetter | null>(null)
  const [answeredQuestionIdx, setAnsweredQuestionIdx] = useState<number | null>(null)

  useEffect(() => {
    if (initialCode) {
      setRoomCode(initialCode)
    }
  }, [initialCode])

  const refreshRoomAndPlayer = useCallback(async (code: string, playerId?: string | number) => {
    const cleanCode = code.trim().toUpperCase()
    if (!cleanCode) return

    const { data: roomData } = await supabase
      .from('rooms')
      .select('*')
      .ilike('room_code', cleanCode)
      .maybeSingle()

    if (roomData) {
      setRoom(roomData)
    }

    if (playerId !== undefined) {
      const { data: playerData } = await supabase
        .from('players')
        .select('*')
        .eq('id', playerId)
        .maybeSingle()

      if (playerData) {
        setPlayer(playerData)
        if (playerData.avatar && playerData.avatar.startsWith('#')) {
          setPlayerColor(playerData.avatar)
        }
      }
    }
  }, [])

  useEffect(() => {
    const activeCode = (player?.room_code || roomCode).trim().toUpperCase()
    if (!activeCode) return

    void refreshRoomAndPlayer(activeCode, player?.id)

    const channel = supabase
      .channel(`player-sync-${activeCode}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rooms' },
        (payload) => {
          const updated = payload.new as Room | undefined
          if (updated && String(updated.room_code || '').toUpperCase() === activeCode) {
            setRoom(updated)
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'players' },
        (payload) => {
          const updated = payload.new as Player | undefined
          if (player?.id && updated && String(updated.id) === String(player.id)) {
            setPlayer(updated)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [player?.id, player?.room_code, roomCode, refreshRoomAndPlayer])

  const quizStarted = Boolean(room?.config?.quiz_started)
  const questionIndex =
    typeof room?.config?.question_index === 'number' ? room.config.question_index : 0
  const timeLeft = typeof room?.config?.time_left === 'number' ? room.config.time_left : 15
  const activeGameType = room?.game_type || room?.current_game || 'quiz'

  useEffect(() => {
    if (!quizStarted || answeredQuestionIdx !== questionIndex) {
      setSelectedChoice(null)
    }
  }, [quizStarted, questionIndex, answeredQuestionIdx])

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanCode = roomCode.trim().toUpperCase()
    const cleanPseudo = pseudo.trim()

    if (!cleanCode || !cleanPseudo) {
      setErrorMsg('Entre un code salon et un pseudo.')
      return
    }

    setJoining(true)
    setErrorMsg(null)

    const { data: roomData, error: roomErr } = await supabase
      .from('rooms')
      .select('*')
      .ilike('room_code', cleanCode)
      .maybeSingle()

    if (roomErr || !roomData) {
      setErrorMsg('Salon introuvable.')
      setJoining(false)
      return
    }

    const clientId = getOrCreateClientId()
    const chosenColor = playerColor || pickRandomColor()

    const { data: inserted, error: insertErr } = await supabase
      .from('players')
      .insert([
        {
          room_code: roomData.room_code,
          pseudo: cleanPseudo,
          score: 0,
          is_connected: true,
          client_id: clientId,
          avatar: chosenColor,
        },
      ])
      .select()
      .single()

    if (insertErr || !inserted) {
      setErrorMsg(insertErr?.message || 'Connexion impossible.')
      setJoining(false)
      return
    }

    setPlayer(inserted)
    setPlayerColor(chosenColor)
    setRoom(roomData)
    setJoining(false)
  }

  const handleSelectChoice = (letter: ChoiceLetter) => {
    if (!quizStarted || timeLeft <= 0) return
    setSelectedChoice(letter)
    setAnsweredQuestionIdx(questionIndex)
  }

  const badgeBg = player?.avatar && player.avatar.startsWith('#') ? player.avatar : playerColor

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#0e172a] text-white select-none font-sans antialiased flex flex-col justify-between p-5">
      <style>{`
        html, body {
          overflow: hidden;
          overscroll-behavior: none;
          touch-action: manipulation;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
        }
      `}</style>

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_85%_60%_at_50%_0%,rgba(59,130,246,0.34),rgba(14,23,42,0))]"
      />

      {!player ? (
        <form
          onSubmit={handleJoin}
          className="relative z-10 m-auto w-full max-w-sm p-6 rounded-[28px] bg-gradient-to-b from-white/[0.18] via-white/[0.09] to-slate-900/75 backdrop-blur-2xl border border-white/25 space-y-4"
        >
          <div className="text-center space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-300">
              tvOS • Joueur
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Rejoindre
            </h1>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="CODE SALON"
              maxLength={8}
              className="w-full px-4 py-3.5 rounded-2xl bg-white/15 border border-white/25 text-white placeholder:text-slate-400 text-center text-xl font-bold tracking-[0.2em] uppercase focus:outline-none focus:border-sky-300"
            />
            <input
              type="text"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              placeholder="Ton pseudo"
              maxLength={18}
              className="w-full px-4 py-3.5 rounded-2xl bg-white/15 border border-white/25 text-white placeholder:text-slate-400 text-center text-lg font-semibold focus:outline-none focus:border-sky-300"
            />
          </div>

          {errorMsg && (
            <p className="text-center text-xs font-semibold text-rose-300">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={joining}
            className="w-full py-4 rounded-2xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white font-bold text-base tracking-tight shadow-lg cursor-pointer"
          >
            {joining ? 'Connexion...' : 'Entrer'}
          </button>
        </form>
      ) : (
        <div className="relative z-10 h-full w-full max-w-md mx-auto flex flex-col justify-between gap-4">
          <div
            style={{ backgroundColor: badgeBg }}
            className="px-4 py-3 rounded-2xl border-2 border-white/45 flex items-center justify-between text-white shadow-md shrink-0"
          >
            <span className="font-extrabold text-base truncate">{player.pseudo}</span>
            <span className="font-extrabold text-sm bg-black/25 px-3 py-1 rounded-full shrink-0">
              {player.score} pts
            </span>
          </div>

          {room?.status === 'playing' && activeGameType === 'quiz' && quizStarted ? (
            <div className="flex-1 min-h-0 flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between px-1 shrink-0">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-sky-200">
                  Question {questionIndex + 1}
                </span>
                <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-white bg-white/15 px-3 py-1 rounded-full">
                  {timeLeft > 0 ? `${timeLeft}s` : 'Terminé'}
                </span>
              </div>

              <div className="flex-1 min-h-0 grid grid-cols-2 grid-rows-2 gap-3.5">
                {CHOICE_BUTTONS.map((btn) => {
                  const isPicked = selectedChoice === btn.letter
                  const isLocked = timeLeft <= 0

                  return (
                    <button
                      key={btn.letter}
                      type="button"
                      disabled={isLocked}
                      onClick={() => handleSelectChoice(btn.letter)}
                      style={{
                        backgroundColor: btn.bg,
                        borderColor: isPicked ? '#ffffff' : btn.border,
                      }}
                      className={`h-full w-full rounded-[26px] flex items-center justify-center text-5xl font-black text-white transition-all duration-150 cursor-pointer disabled:cursor-not-allowed ${
                        isPicked
                          ? 'border-4 ring-4 ring-white/80 scale-[0.98] shadow-[0_0_28px_rgba(255,255,255,0.55)]'
                          : isLocked
                          ? 'border-2 opacity-40'
                          : 'border-2 opacity-100 active:scale-95 shadow-lg'
                      }`}
                    >
                      {btn.letter}
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="flex-1 min-h-0 rounded-[28px] bg-gradient-to-b from-white/[0.16] via-white/[0.08] to-slate-900/70 backdrop-blur-2xl border border-white/25 flex flex-col items-center justify-center p-6 text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-sky-300">
                Salon {player.room_code}
              </span>
              <p className="text-2xl font-bold text-white">
                {room?.status === 'playing' && activeGameType === 'quiz'
                  ? 'En attente du démarrage...'
                  : 'Prêt sur la TV'}
              </p>
            </div>
          )}
        </div>
      )}
    </main>
  )
}

export default function PlayerPage() {
  return (
    <Suspense
      fallback={
        <main className="h-screen w-screen overflow-hidden bg-[#0e172a] text-white flex items-center justify-center">
          <p className="text-lg font-semibold">Chargement...</p>
        </main>
      }
    >
      <PlayerContent />
    </Suspense>
  )
}
