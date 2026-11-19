'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { QUESTIONS } from '@/data/questions'

interface Player {
  id: number
  pseudo: string
  answer?: string | null
  score?: number | null
}

interface RankedPlayer {
  player: Player
  rank: number
}

const QUESTION_DURATION = 15
const CORRECT_POINTS = 10
const WRONG_ANSWER_PENALTY = 5
const SCORE_LIMIT_OPTIONS = [100, 150, 200] as const

const OPTION_STYLES: Record<string, string> = {
  A: 'bg-rose-600/90 border-rose-400',
  B: 'bg-blue-600/90 border-blue-400',
  C: 'bg-amber-500/90 border-amber-300 text-slate-950',
  D: 'bg-emerald-600/90 border-emerald-400',
}

// Bulles colorées associées à chaque lettre de choix
const ANSWER_BUBBLE_STYLES: Record<string, string> = {
  A: 'bg-rose-600 border-rose-300 text-white shadow-[0_0_14px_rgba(225,29,72,0.7)]',
  B: 'bg-blue-600 border-blue-300 text-white shadow-[0_0_14px_rgba(37,99,235,0.7)]',
  C: 'bg-amber-400 border-amber-200 text-slate-950 shadow-[0_0_14px_rgba(251,191,36,0.7)]',
  D: 'bg-emerald-600 border-emerald-300 text-white shadow-[0_0_14px_rgba(5,150,105,0.7)]',
}

// Couleurs flashy distinctes pour les bordures des pastilles joueurs
const FLASHY_BORDERS = [
  { border: 'border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.45)]', badge: 'text-cyan-300' },
  { border: 'border-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,0.45)]', badge: 'text-fuchsia-300' },
  { border: 'border-lime-400 shadow-[0_0_20px_rgba(163,230,53,0.45)]', badge: 'text-lime-300' },
  { border: 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.45)]', badge: 'text-yellow-300' },
  { border: 'border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.45)]', badge: 'text-orange-300' },
  { border: 'border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.45)]', badge: 'text-rose-300' },
  { border: 'border-violet-400 shadow-[0_0_20px_rgba(167,139,250,0.45)]', badge: 'text-violet-300' },
  { border: 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.45)]', badge: 'text-emerald-300' },
]

function getDisplayName(player: Player, allPlayers: Player[]) {
  const sameNamePlayers = [...allPlayers]
    .filter((p) => p.pseudo.trim().toLowerCase() === player.pseudo.trim().toLowerCase())
    .sort((a, b) => a.id - b.id)

  if (sameNamePlayers.length <= 1) return player.pseudo
  const rank = sameNamePlayers.findIndex((p) => p.id === player.id) + 1
  return rank === 1 ? player.pseudo : `${player.pseudo} (${rank})`
}

function computeDenseRanks(players: Player[]): RankedPlayer[] {
  const sorted = [...players].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
  const result: RankedPlayer[] = []

  let currentRank = 1
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0) {
      const prevScore = sorted[i - 1].score ?? 0
      const currScore = sorted[i].score ?? 0
      if (currScore < prevScore) {
        currentRank += 1
      }
    }
    result.push({ player: sorted[i], rank: currentRank })
  }

  return result
}

export default function TVPage() {
  const [pin, setPin] = useState<string>('')
  const [joinUrl, setJoinUrl] = useState<string>('')
  const [playersList, setPlayersList] = useState<Player[]>([])
  const [dbError, setDbError] = useState<string>('')
  const [scoreLimit, setScoreLimit] = useState<number>(100)
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const [gameFinished, setGameFinished] = useState<boolean>(false)
  const [questionIndex, setQuestionIndex] = useState<number>(0)
  const [revealAnswers, setRevealAnswers] = useState<boolean>(false)
  const [scoredQuestionIndex, setScoredQuestionIndex] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(QUESTION_DURATION)

  const initialized = useRef(false)
  const pinRef = useRef<string>('')
  const playersListRef = useRef<Player[]>([])
  const questionIndexRef = useRef<number>(0)
  const scoredQuestionIndexRef = useRef<number | null>(null)
  const isRevealingRef = useRef<boolean>(false)

  useEffect(() => {
    playersListRef.current = playersList
  }, [playersList])

  useEffect(() => {
    questionIndexRef.current = questionIndex
  }, [questionIndex])

  useEffect(() => {
    scoredQuestionIndexRef.current = scoredQuestionIndex
  }, [scoredQuestionIndex])

  const triggerRevealAndScore = useCallback(async () => {
    if (isRevealingRef.current) return
    isRevealingRef.current = true

    const idx = questionIndexRef.current
    const currentQuestion = QUESTIONS[idx]
    const currentPlayers = playersListRef.current

    if (scoredQuestionIndexRef.current !== idx && currentQuestion) {
      scoredQuestionIndexRef.current = idx
      setScoredQuestionIndex(idx)

      const updatedList = await Promise.all(
        currentPlayers.map(async (p) => {
          const currentScore = p.score ?? 0

          if (p.answer === currentQuestion.correct) {
            const nextScore = currentScore + CORRECT_POINTS
            await supabase
              .from('players')
              .update({ score: nextScore })
              .eq('id', p.id)
            return { ...p, score: nextScore }
          }

          if (p.answer) {
            const nextScore = Math.max(0, currentScore - WRONG_ANSWER_PENALTY)
            await supabase
              .from('players')
              .update({ score: nextScore })
              .eq('id', p.id)
            return { ...p, score: nextScore }
          }

          return p
        })
      )

      setPlayersList(updatedList)
    }

    setRevealAnswers(true)
    isRevealingRef.current = false
  }, [])

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const randomPin = Math.floor(1000 + Math.random() * 9000).toString()
    pinRef.current = randomPin
    setPin(randomPin)

    if (typeof window !== 'undefined') {
      setJoinUrl(`${window.location.origin}/player?pin=${randomPin}`)
    }

    async function createRoom() {
      const { error } = await supabase
        .from('rooms')
        .insert([{ room_code: randomPin, status: 'waiting' }])

      if (error) {
        console.error('Erreur création room:', error)
        setDbError(error.message)
      }
    }
    createRoom()

    const channel = supabase
      .channel('room-tv-' + randomPin)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'players',
          filter: `session_id=eq.${randomPin}`,
        },
        (payload) => {
          const newPlayer = payload.new as Player
          setPlayersList((prev) =>
            prev.some((p) => p.id === newPlayer.id)
              ? prev
              : [...prev, { ...newPlayer, score: newPlayer.score ?? 0 }]
          )
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'players',
          filter: `session_id=eq.${randomPin}`,
        },
        (payload) => {
          const updatedPlayer = payload.new as Player
          setPlayersList((prev) =>
            prev.map((p) =>
              p.id === updatedPlayer.id
                ? { ...p, ...updatedPlayer, score: updatedPlayer.score ?? p.score ?? 0 }
                : p
            )
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Compte à rebours de 15 secondes pendant une question non révélée
  useEffect(() => {
    if (!gameStarted || gameFinished || revealAnswers) return

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer)
          void triggerRevealAndScore()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      window.clearInterval(timer)
    }
  }, [gameStarted, gameFinished, revealAnswers, questionIndex, triggerRevealAndScore])

  async function startGame() {
    const currentPin = pin || pinRef.current
    const { error } = await supabase
      .from('rooms')
      .update({ status: 'playing' })
      .eq('room_code', currentPin)

    if (error) {
      console.error('Erreur lancement:', error)
      setDbError(error.message)
    } else {
      setGameStarted(true)
      setGameFinished(false)
      setQuestionIndex(0)
      setRevealAnswers(false)
      setScoredQuestionIndex(null)
      scoredQuestionIndexRef.current = null
      setTimeLeft(QUESTION_DURATION)
    }
  }

  async function nextQuestion() {
    const currentPin = pin || pinRef.current
    setRevealAnswers(false)
    setTimeLeft(QUESTION_DURATION)

    await supabase
      .from('players')
      .update({ answer: null })
      .eq('session_id', currentPin)

    setPlayersList((prev) => prev.map((p) => ({ ...p, answer: null })))
    setQuestionIndex((prev) => (prev + 1) % QUESTIONS.length)

    await supabase
      .from('rooms')
      .update({ status: 'playing' })
      .eq('room_code', currentPin)
  }

  async function replayGame() {
    const currentPin = pin || pinRef.current

    await supabase
      .from('players')
      .update({ score: 0, answer: null })
      .eq('session_id', currentPin)

    await supabase
      .from('rooms')
      .update({ status: 'waiting' })
      .eq('room_code', currentPin)

    setPlayersList((prev) => prev.map((p) => ({ ...p, score: 0, answer: null })))
    setGameFinished(false)
    setGameStarted(false)
    setQuestionIndex(0)
    setRevealAnswers(false)
    setScoredQuestionIndex(null)
    scoredQuestionIndexRef.current = null
    setTimeLeft(QUESTION_DURATION)
  }

  const currentQuestion = QUESTIONS[questionIndex]
  const answeredCount = playersList.filter((p) => Boolean(p.answer)).length

  const playerColorMap = new Map<number, (typeof FLASHY_BORDERS)[number]>()
  playersList.forEach((p, idx) => {
    playerColorMap.set(p.id, FLASHY_BORDERS[idx % FLASHY_BORDERS.length])
  })

  const rankedPlayers = computeDenseRanks(playersList)
  const hasReachedLimit = playersList.some((p) => (p.score ?? 0) >= scoreLimit)

  return (
    <main className="flex min-h-screen flex-col p-6 md:p-8 bg-slate-950 text-white">
      <div className="max-w-7xl w-full mx-auto space-y-6 flex-1 flex flex-col">
        {/* Barre supérieure */}
        <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 px-6 py-3 rounded-2xl">
          <span className="text-sm font-bold uppercase tracking-widest text-slate-400">
            Salon Animateur
          </span>
          <span className="text-xl font-black tracking-widest text-indigo-400">
            PIN : {pin || '----'}
          </span>
          <span className="text-sm font-semibold text-slate-300">
            +{CORRECT_POINTS} / -{WRONG_ANSWER_PENALTY} pts • Objectif : {scoreLimit} pts
          </span>
        </div>

        {dbError && (
          <div className="p-4 bg-red-500/20 border border-red-500 text-red-300 rounded-xl text-sm font-semibold text-center">
            Erreur Supabase : {dbError}
          </div>
        )}

        {!gameStarted ? (
          <div className="max-w-3xl w-full mx-auto my-auto space-y-8 text-center">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <p className="text-sm uppercase tracking-widest text-slate-400">
                  Scanne pour rejoindre
                </p>
                <div className="text-7xl font-black tracking-widest text-indigo-400">
                  {pin || '----'}
                </div>
                <p className="text-xs text-slate-400 break-all">
                  {joinUrl || '/player'}
                </p>
              </div>

              {joinUrl ? (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=12&data=${encodeURIComponent(joinUrl)}`}
                  alt="QR Code pour rejoindre la partie"
                  className="w-40 h-40 md:w-44 md:h-44 bg-white p-2 rounded-2xl shadow-lg shrink-0"
                />
              ) : (
                <div className="w-40 h-40 md:w-44 md:h-44 bg-slate-800 rounded-2xl flex items-center justify-center text-xs text-slate-400 shrink-0">
                  QR Code...
                </div>
              )}
            </div>

            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-6">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                  Limite de points pour gagner
                </p>
                <div className="flex justify-center gap-3">
                  {SCORE_LIMIT_OPTIONS.map((limit) => {
                    const active = scoreLimit === limit
                    return (
                      <button
                        key={limit}
                        type="button"
                        onClick={() => setScoreLimit(limit)}
                        className={`px-6 py-2.5 rounded-xl font-black text-xl border-2 transition-all cursor-pointer ${
                          active
                            ? 'bg-indigo-500 border-indigo-300 text-white shadow-[0_0_18px_rgba(99,102,241,0.5)]'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        {limit} pts
                      </button>
                    )
                  })}
                </div>
              </div>

              <h2 className="text-xl font-bold text-indigo-300">
                Joueurs connectés ({playersList.length})
              </h2>

              {playersList.length === 0 ? (
                <p className="text-slate-500 animate-pulse">
                  En attente des joueurs sur leur smartphone...
                </p>
              ) : (
                <div className="flex flex-wrap gap-3 justify-center">
                  {playersList.map((p, idx) => {
                    const style = FLASHY_BORDERS[idx % FLASHY_BORDERS.length]
                    return (
                      <span
                        key={p.id}
                        className={`px-5 py-2.5 bg-slate-900 border-4 ${style.border} rounded-full font-bold text-xl`}
                      >
                        {getDisplayName(p, playersList)}
                      </span>
                    )
                  })}
                </div>
              )}

              {playersList.length > 0 && (
                <button
                  onClick={startGame}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xl rounded-2xl transition-all shadow-lg cursor-pointer"
                >
                  🚀 Lancer la partie !
                </button>
              )}
            </div>
          </div>
        ) : gameFinished ? (
          <div className="max-w-3xl w-full mx-auto my-auto bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <p className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                Objectif {scoreLimit} pts atteint
              </p>
              <h1 className="text-4xl md:text-5xl font-black">Classement final</h1>
            </div>

            <div className="space-y-4">
              {rankedPlayers.map(({ player: p, rank }) => {
                const colorStyle = playerColorMap.get(p.id) || FLASHY_BORDERS[0]
                return (
                  <div
                    key={p.id}
                    className={`bg-slate-950 border-4 ${colorStyle.border} rounded-3xl px-6 py-4 flex items-center justify-between gap-4`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className={`text-3xl font-black shrink-0 ${colorStyle.badge}`}>
                        #{rank}
                      </span>
                      <span className="text-3xl md:text-4xl font-black truncate">
                        {getDisplayName(p, playersList)}
                      </span>
                    </div>
                    <span className="text-3xl md:text-4xl font-black text-white shrink-0">
                      {p.score ?? 0} <span className="text-xl font-bold text-slate-400">pts</span>
                    </span>
                  </div>
                )
              })}
            </div>

            <button
              onClick={replayGame}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xl rounded-2xl transition-all shadow-lg cursor-pointer"
            >
              🔄 Rejouer
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-4 text-center">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs uppercase tracking-widest text-indigo-400 font-bold">
                    Question {questionIndex + 1} / {QUESTIONS.length}
                  </p>

                  <div
                    className={`px-4 py-1.5 rounded-full font-black text-2xl tabular-nums border-2 transition-all ${
                      revealAnswers
                        ? 'bg-slate-800 border-slate-700 text-slate-400'
                        : timeLeft <= 5
                        ? 'bg-rose-600 border-rose-300 text-white animate-pulse shadow-[0_0_20px_rgba(225,29,72,0.75)]'
                        : 'bg-indigo-600/30 border-indigo-400 text-indigo-200'
                    }`}
                  >
                    {revealAnswers ? 'Temps écoulé' : `${timeLeft}s`}
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-black leading-tight">
                  {currentQuestion.question}
                </h1>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {(['A', 'B', 'C', 'D'] as const).map((key) => {
                  const isCorrect = revealAnswers && currentQuestion.correct === key
                  const isDimmed = revealAnswers && currentQuestion.correct !== key

                  return (
                    <div
                      key={key}
                      className={`p-5 rounded-2xl border-2 flex items-center gap-4 transition-all duration-300 ${
                        OPTION_STYLES[key]
                      } ${
                        isCorrect
                          ? 'ring-4 ring-white scale-[1.04] brightness-110 shadow-[0_0_35px_rgba(255,255,255,0.45)] z-10'
                          : isDimmed
                          ? 'opacity-30 scale-[0.98] grayscale-[30%]'
                          : ''
                      }`}
                    >
                      <span className="w-12 h-12 rounded-xl bg-black/25 flex items-center justify-center font-black text-2xl shrink-0">
                        {key}
                      </span>
                      <span className="text-2xl font-bold leading-snug">
                        {currentQuestion.options[key]}
                      </span>
                    </div>
                  )
                })}
              </div>

              <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                <span className="text-lg font-bold text-slate-200">
                  Réponses : {answeredCount} / {playersList.length}
                </span>

                {revealAnswers && hasReachedLimit ? (
                  <button
                    onClick={() => setGameFinished(true)}
                    className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-lg rounded-xl transition-all shadow-lg cursor-pointer"
                  >
                    🏆 Voir le podium final
                  </button>
                ) : (
                  <button
                    onClick={nextQuestion}
                    className="px-5 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-lg rounded-xl transition-all cursor-pointer"
                  >
                    Suivante →
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-5">
              <h2 className="text-sm uppercase tracking-widest text-indigo-300 font-bold text-center">
                Classement en direct
              </h2>

              <div className="space-y-4">
                {rankedPlayers.map(({ player: p, rank }) => {
                  const colorStyle = playerColorMap.get(p.id) || FLASHY_BORDERS[0]
                  const answerBubbleStyle =
                    p.answer && ANSWER_BUBBLE_STYLES[p.answer]
                      ? ANSWER_BUBBLE_STYLES[p.answer]
                      : 'bg-slate-700 border-slate-500 text-white'

                  return (
                    <div
                      key={p.id}
                      className={`bg-slate-900 border-4 ${colorStyle.border} rounded-3xl px-6 py-4 flex items-center justify-between gap-4 transition-all`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`text-2xl font-black shrink-0 ${colorStyle.badge}`}>
                          #{rank}
                        </span>
                        <span className="text-3xl md:text-4xl font-black truncate">
                          {getDisplayName(p, playersList)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {p.answer ? (
                          revealAnswers ? (
                            <span
                              className={`w-11 h-11 rounded-full border-2 font-black text-2xl flex items-center justify-center shrink-0 ${answerBubbleStyle}`}
                            >
                              {p.answer}
                            </span>
                          ) : (
                            <span className="w-10 h-10 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 font-black text-lg flex items-center justify-center shrink-0">
                              ✓
                            </span>
                          )
                        ) : (
                          <span className="text-xl font-bold text-slate-500 px-2">...</span>
                        )}

                        <span className="text-3xl md:text-4xl font-black text-white">
                          {p.score ?? 0}{' '}
                          <span className="text-xl font-bold text-slate-400">pts</span>
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
