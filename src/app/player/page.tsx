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

const CHOICES: { key: ChoiceKey; label: string; style: string }[] = [
  {
    key: 'A',
    label: 'A',
    style: 'bg-rose-600 border-rose-300 text-white shadow-[0_0_24px_rgba(225,29,72,0.45)]',
  },
  {
    key: 'B',
    label: 'B',
    style: 'bg-blue-600 border-blue-300 text-white shadow-[0_0_24px_rgba(37,99,235,0.45)]',
  },
  {
    key: 'C',
    label: 'C',
    style: 'bg-amber-400 border-amber-200 text-slate-950 shadow-[0_0_24px_rgba(251,191,36,0.45)]',
  },
  {
    key: 'D',
    label: 'D',
    style: 'bg-emerald-600 border-emerald-300 text-white shadow-[0_0_24px_rgba(5,150,105,0.45)]',
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

function PlayerContent() {
  const searchParams = useSearchParams()
  const initialPin = (searchParams.get('pin') || '').replace(/\D/g, '').slice(0, 4)

  const [pin, setPin] = useState<string>(initialPin)
  const [pseudo, setPseudo] = useState<string>('')
  const [joined, setJoined] = useState<boolean>(false)
  const [playerId, setPlayerId] = useState<number | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<ChoiceKey | null>(null)
  const [score, setScore] = useState<number>(0)
  const [roomStatus, setRoomStatus] = useState<string>('waiting')
  const [lastOutcome, setLastOutcome] = useState<'correct' | 'wrong' | null>(null)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const audioCtxRef = useRef<AudioContext | null>(null)
  const wakeLockRef = useRef<{ release: () => Promise<void> } | null>(null)
  const selectedAnswerRef = useRef<ChoiceKey | null>(null)
  const lastPlayedRevealKeyRef = useRef<string>('')

  useEffect(() => {
    selectedAnswerRef.current = selectedAnswer
  }, [selectedAnswer])

  useEffect(() => {
    if (initialPin && !pin) {
      setPin(initialPin)
    }
  }, [initialPin, pin])

  // Empêche le défilement et le pincement/zoom sur l'écran joueur
  useEffect(() => {
    if (typeof window === 'undefined') return

    const preventTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1 || e.cancelable) {
        e.preventDefault()
      }
    }

    const preventGesture = (e: Event) => {
      e.preventDefault()
    }

    document.addEventListener('touchmove', preventTouchMove, { passive: false })
    document.addEventListener('gesturestart', preventGesture, { passive: false })
    document.addEventListener('gesturechange', preventGesture, { passive: false })

    return () => {
      document.removeEventListener('touchmove', preventTouchMove)
      document.removeEventListener('gesturestart', preventGesture)
      document.removeEventListener('gesturechange', preventGesture)
    }
  }, [])

  // Maintien de l'écran allumé pendant la session joueur
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

  const ensureAudioReady = useCallback(() => {
    if (typeof window === 'undefined') return null
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return null

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContextClass()
    }
    if (audioCtxRef.current.state === 'suspended') {
      void audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }, [])

  const playOutcomeSound = useCallback(
    (isCorrect: boolean) => {
      const ctx = ensureAudioReady()
      if (!ctx) return

      const now = ctx.currentTime

      if (isCorrect) {
        // Double note claire et ascendante (validation)
        const notes = [587.33, 880] // D5 -> A5
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          const startAt = now + i * 0.11
          osc.type = 'triangle'
          osc.frequency.setValueAtTime(freq, startAt)
          gain.gain.setValueAtTime(0.001, startAt)
          gain.gain.linearRampToValueAtTime(0.18, startAt + 0.02)
          gain.gain.exponentialRampToValueAtTime(0.001, startAt + 0.24)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(startAt)
          osc.stop(startAt + 0.25)
        })
      } else {
        // Son grave descendant (erreur)
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(220, now)
        osc.frequency.linearRampToValueAtTime(135, now + 0.28)
        gain.gain.setValueAtTime(0.001, now)
        gain.gain.linearRampToValueAtTime(0.14, now + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.31)
      }
    },
    [ensureAudioReady]
  )

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        void audioCtxRef.current.close()
        audioCtxRef.current = null
      }
    }
  }, [])

  // Écoute des changements de statut du salon (révélation, question suivante, fin)
  useEffect(() => {
    if (!joined || !pin) return

    async function syncInitialRoom() {
      const { data } = await supabase
        .from('rooms')
        .select('status')
        .eq('room_code', pin)
        .maybeSingle()

      if (data?.status) {
        setRoomStatus(data.status)
      }
    }
    void syncInitialRoom()

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
          const nextStatus = String((payload.new as { status?: string })?.status || '')
          setRoomStatus(nextStatus)

          if (nextStatus.startsWith('playing:')) {
            setSelectedAnswer(null)
            setLastOutcome(null)
          } else if (nextStatus === 'waiting') {
            setSelectedAnswer(null)
            setLastOutcome(null)
            setScore(0)
            lastPlayedRevealKeyRef.current = ''
          } else if (nextStatus.startsWith('revealed:')) {
            const parts = nextStatus.split(':')
            const qIdx = parts[1] || '0'
            const correctLetter = (parts[2] || '') as ChoiceKey | ''
            const revealKey = `${qIdx}:${correctLetter}`
            const chosen = selectedAnswerRef.current

            if (chosen && correctLetter && lastPlayedRevealKeyRef.current !== revealKey) {
              lastPlayedRevealKeyRef.current = revealKey
              const isCorrect = chosen === correctLetter
              setLastOutcome(isCorrect ? 'correct' : 'wrong')
              playOutcomeSound(isCorrect)
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [joined, pin, playerId, playOutcomeSound])

  // Écoute des mises à jour du joueur (score / réinitialisation réponse)
  useEffect(() => {
    if (!joined || !playerId) return

    const channel = supabase
      .channel('player-self-' + playerId)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'players',
          filter: `id=eq.${playerId}`,
        },
        (payload) => {
          const row = payload.new as { score?: number | null; answer?: string | null }
          if (typeof row.score === 'number') {
            setScore(row.score)
          }
          if (row.answer === null) {
            setSelectedAnswer(null)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [joined, playerId])

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')
    ensureAudioReady()
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
      .select('room_code, status')
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

      setPlayerId(existingPlayer.id)
      setScore(existingPlayer.score ?? 0)
      setSelectedAnswer((existingPlayer.answer as ChoiceKey | null) ?? null)
      setRoomStatus(room.status || 'waiting')
      setJoined(true)
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

    setPlayerId(inserted.id)
    setScore(inserted.score ?? 0)
    setSelectedAnswer(null)
    setRoomStatus(room.status || 'waiting')
    setJoined(true)
  }

  async function handleSelectAnswer(choice: ChoiceKey) {
    if (!playerId) return
    ensureAudioReady()
    void requestScreenWakeLock()

    setSelectedAnswer(choice)

    const { error } = await supabase
      .from('players')
      .update({ answer: choice })
      .eq('id', playerId)

    if (error) {
      setErrorMsg(error.message)
    }
  }

  const isRevealed = roomStatus.startsWith('revealed:')

  return (
    <main className="h-dvh w-screen overflow-hidden overscroll-none select-none touch-none bg-slate-950 text-white flex flex-col justify-between p-5">
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
            className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black text-xl transition-colors"
          >
            {loading ? 'Connexion...' : '🎮 Entrer dans le salon'}
          </button>
        </form>
      ) : (
        <>
          {/* En-tête joueur */}
          <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 px-4 py-3 rounded-2xl">
            <div className="min-w-0">
              <p className="text-xs text-slate-400 font-bold">PIN {pin}</p>
              <p className="text-lg font-black truncate">{pseudo}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-slate-400 font-bold">Score</p>
              <p className="text-2xl font-black text-indigo-300">{score} pts</p>
            </div>
          </div>

          {/* Zone centrale : boutons A, B, C, D */}
          <div className="flex-1 grid grid-cols-2 gap-4 my-4">
            {CHOICES.map((item) => {
              const isSelected = selectedAnswer === item.key
              const dimOther = Boolean(selectedAnswer) && !isSelected

              return (
                <button
                  key={item.key}
                  type="button"
                  disabled={isRevealed || roomStatus === 'waiting' || roomStatus === 'finished'}
                  onClick={() => void handleSelectAnswer(item.key)}
                  className={`rounded-3xl border-4 flex items-center justify-center text-6xl font-black transition-all ${
                    item.style
                  } ${
                    isSelected
                      ? 'ring-4 ring-white scale-[0.98] brightness-110'
                      : dimOther
                      ? 'opacity-40 scale-[0.96]'
                      : 'active:scale-95'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </div>

          {/* Pied d'écran : statut */}
          <div className="bg-slate-900/90 border border-slate-800 px-4 py-3 rounded-2xl text-center">
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
                  ? `Choix ${selectedAnswer} enregistré — tu peux changer tant que le chrono tourne`
                  : 'Choisis A, B, C ou D avant la fin du chrono'}
              </p>
            )}
          </div>
        </>
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
