'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface Player {
  id: number
  pseudo: string
  answer?: string | null
  score?: number | null
}

const QUESTIONS = [
  {
    question: 'Quelle est la capitale de la Belgique ?',
    options: {
      A: 'Anvers',
      B: 'Bruxelles',
      C: 'Liège',
      D: 'Gand',
    },
    correct: 'B',
  },
  {
    question: 'Combien y a-t-il de boules numérotées dans un jeu de billard américain standard ?',
    options: {
      A: '12',
      B: '14',
      C: '15',
      D: '16',
    },
    correct: 'C',
  },
  {
    question: 'Quelle planète est surnommée la planète rouge ?',
    options: {
      A: 'Mars',
      B: 'Jupiter',
      C: 'Vénus',
      D: 'Saturne',
    },
    correct: 'A',
  },
]

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

export default function TVPage() {
  const [pin, setPin] = useState<string>('')
  const [playersList, setPlayersList] = useState<Player[]>([])
  const [dbError, setDbError] = useState<string>('')
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const [questionIndex, setQuestionIndex] = useState<number>(0)
  const [revealAnswers, setRevealAnswers] = useState<boolean>(false)
  const [scoredQuestionIndex, setScoredQuestionIndex] = useState<number | null>(null)

  const initialized = useRef(false)
  const pinRef = useRef<string>('')

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const randomPin = Math.floor(1000 + Math.random() * 9000).toString()
    pinRef.current = randomPin
    setPin(randomPin)

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
      setQuestionIndex(0)
      setRevealAnswers(false)
      setScoredQuestionIndex(null)
    }
  }

  async function toggleRevealAnswers() {
    const currentQuestion = QUESTIONS[questionIndex]

    if (!revealAnswers && scoredQuestionIndex !== questionIndex) {
      setScoredQuestionIndex(questionIndex)

      const updatedList = await Promise.all(
        playersList.map(async (p) => {
          if (p.answer === currentQuestion.correct) {
            const nextScore = (p.score ?? 0) + 10
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

    setRevealAnswers((prev) => !prev)
  }

  async function nextQuestion() {
    const currentPin = pin || pinRef.current
    setRevealAnswers(false)

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

  const currentQuestion = QUESTIONS[questionIndex]
  const answeredCount = playersList.filter((p) => Boolean(p.answer)).length

  // On associe une couleur fixe à chaque joueur selon son ordre d'arrivée
  const playerColorMap = new Map<number, (typeof FLASHY_BORDERS)[number]>()
  playersList.forEach((p, idx) => {
    playerColorMap.set(p.id, FLASHY_BORDERS[idx % FLASHY_BORDERS.length])
  })

  const sortedPlayers = [...playersList].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

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
            Joueurs : {playersList.length}
          </span>
        </div>

        {dbError && (
          <div className="p-4 bg-red-500/20 border border-red-500 text-red-300 rounded-xl text-sm font-semibold text-center">
            Erreur Supabase : {dbError}
          </div>
        )}

        {!gameStarted ? (
          <div className="max-w-2xl w-full mx-auto my-auto space-y-8 text-center">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
              <p className="text-sm uppercase tracking-widest text-slate-400 mb-2">
                Code de la partie
              </p>
              <div className="text-7xl font-black tracking-widest text-indigo-400">
                {pin || '----'}
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-6">
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
        ) : (
          /* Disposition en 2 colonnes : Question à gauche, Classement flashy à droite */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
            {/* COLONNE GAUCHE : Question, 4 choix et contrôles animateur */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-4 text-center">
                <p className="text-xs uppercase tracking-widest text-indigo-400 font-bold">
                  Question {questionIndex + 1} / {QUESTIONS.length}
                </p>
                <h1 className="text-3xl md:text-4xl font-black leading-tight">
                  {currentQuestion.question}
                </h1>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {(['A', 'B', 'C', 'D'] as const).map((key) => {
                  const isCorrect = revealAnswers && currentQuestion.correct === key
                  return (
                    <div
                      key={key}
                      className={`p-5 rounded-2xl border-2 flex items-center gap-4 transition-all ${
                        OPTION_STYLES[key]
                      } ${isCorrect ? 'ring-4 ring-white scale-[1.02]' : ''}`}
                    >
                      <span className="w-12 h-12 rounded-xl bg-black/25 flex items-center justify-center font-black text-2xl shrink-0">
                        {key}
                      </span>
                      <span className="text-2xl font-bold">{currentQuestion.options[key]}</span>
                    </div>
                  )
                })}
              </div>

              {/* Barre de contrôle animateur */}
              <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                <span className="text-lg font-bold text-slate-200">
                  Réponses : {answeredCount} / {playersList.length}
                </span>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={toggleRevealAnswers}
                    className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-lg rounded-xl transition-all cursor-pointer"
                  >
                    {revealAnswers ? 'Masquer la réponse' : 'Révéler (+10 pts)'}
                  </button>
                  <button
                    onClick={nextQuestion}
                    className="px-5 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-lg rounded-xl transition-all cursor-pointer"
                  >
                    Suivante →
                  </button>
                </div>
              </div>
            </div>

            {/* COLONNE DROITE : Classement en direct avec pastilles flashy */}
            <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-5">
              <h2 className="text-sm uppercase tracking-widest text-indigo-300 font-bold text-center">
                Classement en direct
              </h2>

              <div className="space-y-4">
                {sortedPlayers.map((p, index) => {
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
                          #{index + 1}
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
