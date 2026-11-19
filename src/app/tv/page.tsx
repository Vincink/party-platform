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
  const sortedPlayers = [...playersList].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-slate-950 text-white">
      <div className="max-w-4xl w-full text-center space-y-8">
        <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 px-6 py-3 rounded-2xl">
          <span className="text-sm font-bold uppercase tracking-widest text-slate-400">
            Salon Animateur
          </span>
          <span className="text-lg font-black tracking-widest text-indigo-400">
            PIN : {pin || '----'}
          </span>
          <span className="text-sm font-semibold text-slate-300">
            Joueurs : {playersList.length}
          </span>
        </div>

        {dbError && (
          <div className="p-4 bg-red-500/20 border border-red-500 text-red-300 rounded-xl text-sm font-semibold">
            Erreur Supabase : {dbError}
          </div>
        )}

        {!gameStarted ? (
          <>
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
                  {playersList.map((p) => (
                    <span
                      key={p.id}
                      className="px-4 py-2 bg-indigo-600/30 border border-indigo-500/50 rounded-xl font-semibold text-lg"
                    >
                      {p.pseudo}
                    </span>
                  ))}
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
          </>
        ) : (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-4">
              <p className="text-xs uppercase tracking-widest text-indigo-400 font-bold">
                Question {questionIndex + 1} / {QUESTIONS.length}
              </p>
              <h1 className="text-3xl md:text-4xl font-black leading-tight">
                {currentQuestion.question}
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {(['A', 'B', 'C', 'D'] as const).map((key) => {
                const isCorrect = revealAnswers && currentQuestion.correct === key
                return (
                  <div
                    key={key}
                    className={`p-5 rounded-2xl border-2 flex items-center gap-4 transition-all ${
                      OPTION_STYLES[key]
                    } ${isCorrect ? 'ring-4 ring-white scale-[1.02]' : ''}`}
                  >
                    <span className="w-11 h-11 rounded-xl bg-black/25 flex items-center justify-center font-black text-2xl shrink-0">
                      {key}
                    </span>
                    <span className="text-xl font-bold">{currentQuestion.options[key]}</span>
                  </div>
                )
              })}
            </div>

            <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-2xl space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-slate-200">
                  Réponses reçues : {answeredCount} / {playersList.length}
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={toggleRevealAnswers}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all cursor-pointer"
                  >
                    {revealAnswers ? 'Masquer la réponse' : 'Révéler la réponse (+10 pts)'}
                  </button>
                  <button
                    onClick={nextQuestion}
                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Question suivante →
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                {playersList.map((p) => (
                  <div
                    key={p.id}
                    className={`px-4 py-2 rounded-xl border font-semibold flex items-center gap-2 ${
                      p.answer
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span>{p.pseudo}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-black/30">
                      {p.answer ? (revealAnswers ? `Choix ${p.answer}` : 'Prêt ✓') : 'Réfléchit...'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800 text-left space-y-2">
                <h3 className="text-xs uppercase tracking-widest text-indigo-300 font-bold">
                  Classement en direct
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sortedPlayers.map((p, index) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-xl"
                    >
                      <span className="font-bold">
                        #{index + 1} {p.pseudo}
                      </span>
                      <span className="font-black text-emerald-400">{p.score ?? 0} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
