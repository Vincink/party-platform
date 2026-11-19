'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const CHOICES = [
  { key: 'A', label: 'A', color: 'bg-rose-600 hover:bg-rose-500 border-rose-400' },
  { key: 'B', label: 'B', color: 'bg-blue-600 hover:bg-blue-500 border-blue-400' },
  { key: 'C', label: 'C', color: 'bg-amber-500 hover:bg-amber-400 border-amber-300 text-slate-950' },
  { key: 'D', label: 'D', color: 'bg-emerald-600 hover:bg-emerald-500 border-emerald-400' },
]

function getOrCreateClientId(): string {
  if (typeof window === 'undefined') return ''
  const key = 'quiz_client_id'
  let id = window.localStorage.getItem(key)
  if (!id) {
    id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
    window.localStorage.setItem(key, id)
  }
  return id
}

export default function PlayerPage() {
  const [clientId, setClientId] = useState('')
  const [roomCode, setRoomCode] = useState('')
  const [pseudo, setPseudo] = useState('')
  const [playerId, setPlayerId] = useState<number | null>(null)
  const [score, setScore] = useState<number>(0)
  const [joined, setJoined] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    setClientId(getOrCreateClientId())
  }, [])

  // Rejoindre ou reprendre la session de ce smartphone
  async function joinRoom(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')

    const cleanCode = roomCode.trim()
    const cleanPseudo = pseudo.trim()

    if (!cleanCode || !cleanPseudo) {
      setErrorMsg('Entre un code PIN et un pseudo.')
      return
    }

    const activeClientId = clientId || getOrCreateClientId()

    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('room_code, status')
      .eq('room_code', cleanCode)
      .single()

    if (roomError || !room) {
      setErrorMsg('Salon introuvable avec ce code PIN.')
      return
    }

    // 1. Vérifie si CE smartphone a déjà une ligne dans ce salon
    const { data: existingDevicePlayer, error: findError } = await supabase
      .from('players')
      .select('id, pseudo, score, answer')
      .eq('session_id', cleanCode)
      .eq('client_id', activeClientId)
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (findError) {
      setErrorMsg(findError.message)
      return
    }

    if (existingDevicePlayer) {
      // Si l'utilisateur a changé de pseudo sur le même téléphone, on met à jour son pseudo
      if (existingDevicePlayer.pseudo !== cleanPseudo) {
        await supabase
          .from('players')
          .update({ pseudo: cleanPseudo })
          .eq('id', existingDevicePlayer.id)
      }

      setPlayerId(existingDevicePlayer.id)
      setPseudo(cleanPseudo)
      setScore(existingDevicePlayer.score ?? 0)
      setSelectedAnswer(existingDevicePlayer.answer ?? null)
      setJoined(true)
      if (room.status === 'playing') {
        setGameStarted(true)
      }
      return
    }

    // 2. Sinon, c'est un nouveau joueur (même si un autre smartphone a déjà pris ce prénom)
    const { data: player, error: playerError } = await supabase
      .from('players')
      .insert([
        {
          room_code: cleanCode,
          session_id: cleanCode,
          client_id: activeClientId,
          pseudo: cleanPseudo,
          score: 0,
        },
      ])
      .select()
      .single()

    if (playerError || !player) {
      setErrorMsg(playerError?.message || 'Erreur inconnue')
      return
    }

    setPlayerId(player.id)
    setScore(player.score ?? 0)
    setSelectedAnswer(null)
    setJoined(true)
    if (room.status === 'playing') {
      setGameStarted(true)
    }
  }

  // Écouter l'état de la partie et les mises à jour du joueur (dont le score)
  useEffect(() => {
    if (!joined || !roomCode || !playerId) return

    const channel = supabase
      .channel('player-room-' + roomCode + '-' + playerId)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rooms',
          filter: `room_code=eq.${roomCode}`,
        },
        (payload) => {
          if (payload.new.status === 'playing') {
            setGameStarted(true)
            setSelectedAnswer(null)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'players',
          filter: `id=eq.${playerId}`,
        },
        (payload) => {
          if (typeof payload.new.score === 'number') {
            setScore(payload.new.score)
          }
          if ('answer' in payload.new && payload.new.answer === null) {
            setSelectedAnswer(null)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [joined, roomCode, playerId])

  // Envoyer la réponse (A, B, C ou D)
  async function sendAnswer(choiceKey: string) {
    if (!playerId || selectedAnswer) return

    setSelectedAnswer(choiceKey)

    const { error } = await supabase
      .from('players')
      .update({ answer: choiceKey })
      .eq('id', playerId)

    if (error) {
      console.error('Erreur envoi réponse:', error)
      setSelectedAnswer(null)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-950 text-white">
      {!joined ? (
        <form onSubmit={joinRoom} className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-5 shadow-2xl">
          <h1 className="text-2xl font-bold text-center">Rejoindre la Partie</h1>

          {errorMsg && (
            <div className="p-3 bg-red-500/20 border border-red-500 text-red-300 rounded-xl text-sm text-center font-semibold">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
              Code PIN à 4 chiffres
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-center text-2xl font-bold tracking-widest"
              placeholder="1234"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
              Ton pseudo
            </label>
            <input
              type="text"
              maxLength={20}
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-lg"
              placeholder="Pseudo"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-lg rounded-2xl transition-all cursor-pointer"
          >
            C'est parti !
          </button>
        </form>
      ) : !gameStarted ? (
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center space-y-4">
          <p className="text-sm uppercase tracking-widest text-indigo-400 font-bold">Connecté • Salon {roomCode}</p>
          <h2 className="text-3xl font-black">{pseudo}</h2>
          <p className="text-emerald-400 font-bold text-lg">{score} pts</p>
          <p className="text-slate-400 animate-pulse">En attente du lancement par l'animateur...</p>
        </div>
      ) : (
        <div className="w-full max-w-md space-y-5">
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 px-5 py-3 rounded-2xl">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400">Joueur</p>
              <p className="font-bold text-base">{pseudo}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wider text-slate-400">Score</p>
              <p className="font-black text-xl text-emerald-400">{score} pts</p>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-black">Choisis ta réponse !</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {CHOICES.map((btn) => {
              const isSelected = selectedAnswer === btn.key
              const isDisabled = selectedAnswer !== null

              return (
                <button
                  key={btn.key}
                  disabled={isDisabled}
                  onClick={() => sendAnswer(btn.key)}
                  className={`h-32 rounded-3xl border-2 font-black text-5xl flex items-center justify-center transition-all shadow-xl ${btn.color} ${
                    isSelected
                      ? 'scale-105 ring-4 ring-white'
                      : isDisabled
                      ? 'opacity-35 cursor-not-allowed'
                      : 'active:scale-95 cursor-pointer'
                  }`}
                >
                  {btn.label}
                </button>
              )
            })}
          </div>

          {selectedAnswer && (
            <div className="p-4 bg-indigo-500/20 border border-indigo-400 text-indigo-200 rounded-2xl text-center font-bold">
              Réponse <span className="text-white underline">{selectedAnswer}</span> envoyée ! Regarde la TV.
            </div>
          )}
        </div>
      )}
    </main>
  )
}
