'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { QUESTIONS, type QuizQuestion } from '@/data/questions'
import { MUSIQUE_QUESTIONS } from '@/data/questions-musique'
import {
  PETIT_BAC_ROUNDS_PER_GAME,
  PETIT_BAC_DURATION_SECONDS,
  PETIT_BAC_NO_ANSWER_PENALTY,
  computePetitBacPoints,
  evaluatePetitBacAnswers,
  pickPetitBacRounds,
  type EvaluatedPetitBacEntry,
  type PetitBacRound,
  type PetitBacVerdict,
} from '@/data/petit-bac'
import { getPlayerColorTheme, getPlayerNeonStyle } from '@/lib/playerColors'

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

type GameType = 'quiz' | 'petitbac'
type QuizTheme = 'culture' | 'musique'

const GAME_OPTIONS: {
  id: GameType
  title: string
  subtitle: string
  icon: string
}[] = [
  {
    id: 'quiz',
    title: 'Quiz',
    subtitle: '15 questions • +10 / -5 / -2 pts',
    icon: '🧠',
  },
  {
    id: 'petitbac',
    title: 'Petit Bac',
    subtitle: `${PETIT_BAC_ROUNDS_PER_GAME} manches • 1 lettre + 1 thème`,
    icon: '🔤',
  },
]

const THEME_OPTIONS: {
  id: QuizTheme
  title: string
  subtitle: string
  icon: string
}[] = [
  {
    id: 'culture',
    title: 'Culture générale',
    subtitle: `${QUESTIONS.length} questions`,
    icon: '🌍',
  },
  {
    id: 'musique',
    title: 'Musique & Tubes mondiaux',
    subtitle: `${MUSIQUE_QUESTIONS.length} questions • Francophone, TV & classiques`,
    icon: '🎵',
  },
]

const START_COUNTDOWN_SECONDS = 3
const QUESTION_DURATION = 15
const QUESTIONS_PER_GAME = 15
const CORRECT_POINTS = 10
const WRONG_ANSWER_PENALTY = 5
const NO_ANSWER_PENALTY = 2
const TIMER_SOUND_SRC = '/quiz_son.mp3'

const OPTION_STYLES: Record<string, string> = {
  A: 'bg-rose-600/90 border-rose-400',
  B: 'bg-blue-600/90 border-blue-400',
  C: 'bg-amber-500/90 border-amber-300 text-slate-950',
  D: 'bg-emerald-600/90 border-emerald-400',
}

const ANSWER_BUBBLE_STYLES: Record<string, string> = {
  A: 'bg-rose-600 border-rose-300 text-white shadow-[0_0_14px_rgba(225,29,72,0.7)]',
  B: 'bg-blue-600 border-blue-300 text-white shadow-[0_0_14px_rgba(37,99,235,0.7)]',
  C: 'bg-amber-400 border-amber-200 text-slate-950 shadow-[0_0_14px_rgba(251,191,36,0.7)]',
  D: 'bg-emerald-600 border-emerald-300 text-white shadow-[0_0_14px_rgba(5,150,105,0.7)]',
}

function getQuestionsForTheme(theme: QuizTheme): QuizQuestion[] {
  return theme === 'musique' ? MUSIQUE_QUESTIONS : QUESTIONS
}

function shuffleQuestions(list: QuizQuestion[]): QuizQuestion[] {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function pickRandomQuestions(theme: QuizTheme): QuizQuestion[] {
  return shuffleQuestions(getQuestionsForTheme(theme)).slice(0, QUESTIONS_PER_GAME)
}

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

function formatVerdictBadge(verdict: PetitBacVerdict, isCloseMatch: boolean) {
  if (verdict === 'unique') {
    return {
      label: 'Unique • +10 pts',
      className: 'bg-emerald-500/20 border-emerald-400 text-emerald-300',
    }
  }
  if (verdict === 'duplicate') {
    return {
      label: isCloseMatch ? 'Doublon (faute proche) • +5 pts' : 'Doublon • +5 pts',
      className: 'bg-amber-400/20 border-amber-300 text-amber-200',
    }
  }
  if (verdict === 'rejected') {
    return {
      label: 'Refusé • 0 pt',
      className: 'bg-rose-500/20 border-rose-400 text-rose-300',
    }
  }
  return {
    label: `Aucune réponse • -${PETIT_BAC_NO_ANSWER_PENALTY} pts`,
    className: 'bg-slate-800 border-slate-600 text-slate-400',
  }
}

export default function TVPage() {
  const [pin, setPin] = useState<string>('')
  const [joinUrl, setJoinUrl] = useState<string>('')
  const [selectedGame, setSelectedGame] = useState<GameType>('quiz')
  const [selectedTheme, setSelectedTheme] = useState<QuizTheme>('culture')
  const [playersList, setPlayersList] = useState<Player[]>([])
  const [dbError, setDbError] = useState<string>('')
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true)
  const [gameOpened, setGameOpened] = useState<boolean>(false)
  const [gameRunning, setGameRunning] = useState<boolean>(false)
  const [startCountdown, setStartCountdown] = useState<number | null>(null)
  const [gameFinished, setGameFinished] = useState<boolean>(false)

  // États Quiz
  const [deckQuestions, setDeckQuestions] = useState<QuizQuestion[]>(() =>
    pickRandomQuestions('culture')
  )
  const [questionIndex, setQuestionIndex] = useState<number>(0)
  const [revealAnswers, setRevealAnswers] = useState<boolean>(false)
  const [scoredQuestionIndex, setScoredQuestionIndex] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(QUESTION_DURATION)

  // États Petit Bac
  const [bacRounds, setBacRounds] = useState<PetitBacRound[]>(() => pickPetitBacRounds())
  const [bacRoundIndex, setBacRoundIndex] = useState<number>(0)
  const [bacTimeLeft, setBacTimeLeft] = useState<number>(PETIT_BAC_DURATION_SECONDS)
  const [bacPhase, setBacPhase] = useState<'playing' | 'review' | 'applied'>('playing')
  const [bacEvaluations, setBacEvaluations] = useState<Record<number, EvaluatedPetitBacEntry>>({})

  const initialized = useRef(false)
  const pinRef = useRef<string>('')
  const selectedGameRef = useRef<GameType>('quiz')
  const selectedThemeRef = useRef<QuizTheme>('culture')
  const playersListRef = useRef<Player[]>([])
  const deckQuestionsRef = useRef<QuizQuestion[]>(deckQuestions)
  const questionIndexRef = useRef<number>(0)
  const scoredQuestionIndexRef = useRef<number | null>(null)
  const isRevealingRef = useRef<boolean>(false)
  const bacRoundsRef = useRef<PetitBacRound[]>(bacRounds)
  const bacRoundIndexRef = useRef<number>(0)
  const isBacRevealingRef = useRef<boolean>(false)
  const countdownLaunchedRef = useRef<boolean>(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    selectedGameRef.current = selectedGame
  }, [selectedGame])

  useEffect(() => {
    selectedThemeRef.current = selectedTheme
  }, [selectedTheme])

  useEffect(() => {
    playersListRef.current = playersList
  }, [playersList])

  useEffect(() => {
    deckQuestionsRef.current = deckQuestions
  }, [deckQuestions])

  useEffect(() => {
    questionIndexRef.current = questionIndex
  }, [questionIndex])

  useEffect(() => {
    scoredQuestionIndexRef.current = scoredQuestionIndex
  }, [scoredQuestionIndex])

  useEffect(() => {
    bacRoundsRef.current = bacRounds
  }, [bacRounds])

  useEffect(() => {
    bacRoundIndexRef.current = bacRoundIndex
  }, [bacRoundIndex])

  const stopTimerSound = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
  }, [])

  const startTimerSound = useCallback(() => {
    if (!soundEnabled || typeof window === 'undefined') return
    if (!audioRef.current) {
      const audio = new Audio(TIMER_SOUND_SRC)
      audio.loop = true
      audio.volume = 1
      audioRef.current = audio
    }
    const audio = audioRef.current
    audio.currentTime = 0
    void audio.play().catch(() => {})
  }, [soundEnabled])

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const isQuizActive =
    selectedGame === 'quiz' &&
    gameOpened &&
    gameRunning &&
    startCountdown === null &&
    !gameFinished &&
    !revealAnswers

  const isBacPlayingActive =
    selectedGame === 'petitbac' &&
    gameOpened &&
    gameRunning &&
    startCountdown === null &&
    !gameFinished &&
    bacPhase === 'playing'

  const isSoundActive = isQuizActive || isBacPlayingActive

  useEffect(() => {
    if (!soundEnabled) {
      stopTimerSound()
    } else if (isSoundActive) {
      startTimerSound()
    }
  }, [soundEnabled, isSoundActive, stopTimerSound, startTimerSound])

  const syncRoomGameType = useCallback(async (roomPin: string, game: GameType) => {
    if (!roomPin) return
    await supabase
      .from('rooms')
      .update({ game_type: game })
      .eq('room_code', roomPin)
  }, [])

  const triggerRevealAndScoreQuiz = useCallback(async () => {
    if (isRevealingRef.current) return
    isRevealingRef.current = true
    stopTimerSound()

    const currentPin = pinRef.current
    const idx = questionIndexRef.current
    const currentQuestion = deckQuestionsRef.current[idx]
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

          const nextScore = Math.max(0, currentScore - NO_ANSWER_PENALTY)
          await supabase
            .from('players')
            .update({ score: nextScore })
            .eq('id', p.id)
          return { ...p, score: nextScore }
        })
      )

      setPlayersList(updatedList)
    }

    if (currentPin) {
      await supabase
        .from('rooms')
        .update({ status: `revealed:${idx}:${currentQuestion?.correct ?? ''}` })
        .eq('room_code', currentPin)
    }

    setRevealAnswers(true)
    isRevealingRef.current = false
  }, [stopTimerSound])

  const triggerBacReveal = useCallback(async () => {
    if (isBacRevealingRef.current) return
    isBacRevealingRef.current = true
    stopTimerSound()

    const currentPin = pinRef.current
    const roundIdx = bacRoundIndexRef.current
    const round = bacRoundsRef.current[roundIdx]
    const currentPlayers = playersListRef.current

    const evaluatedList = evaluatePetitBacAnswers(currentPlayers, round?.letter ?? '')
    const mapByPlayer: Record<number, EvaluatedPetitBacEntry> = {}
    for (const item of evaluatedList) {
      mapByPlayer[item.playerId] = item
    }

    setBacEvaluations(mapByPlayer)
    setBacPhase('review')

    if (currentPin) {
      await supabase
        .from('rooms')
        .update({ status: `bac_review:${roundIdx}` })
        .eq('room_code', currentPin)
    }

    isBacRevealingRef.current = false
  }, [stopTimerSound])

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
        .insert([
          {
            room_code: randomPin,
            status: 'waiting',
            game_type: selectedGameRef.current,
          },
        ])

      if (error) {
        console.error('Erreur création room:', error)
        setDbError(error.message)
      }
    }
    void createRoom()

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

  // Décompte 3, 2, 1 sans effet de bord dans setState
  useEffect(() => {
    if (!gameRunning || startCountdown === null || gameFinished) return

    if (startCountdown <= 0) {
      if (countdownLaunchedRef.current) return
      countdownLaunchedRef.current = true

      const currentPin = pinRef.current
      const activeGame = selectedGameRef.current

      async function launchRoundOne() {
        if (activeGame === 'quiz') {
          setTimeLeft(QUESTION_DURATION)
          if (currentPin) {
            await supabase
              .from('rooms')
              .update({ status: 'playing:0', game_type: 'quiz' })
              .eq('room_code', currentPin)
          }
        } else {
          const firstRound = bacRoundsRef.current[0]
          setBacTimeLeft(PETIT_BAC_DURATION_SECONDS)
          setBacPhase('playing')
          if (currentPin && firstRound) {
            await supabase
              .from('rooms')
              .update({
                status: `bac_playing:0:${firstRound.letter}:${encodeURIComponent(firstRound.category)}`,
                game_type: 'petitbac',
              })
              .eq('room_code', currentPin)
          }
        }
        setStartCountdown(null)
        startTimerSound()
      }

      void launchRoundOne()
      return
    }

    const countdownTimer = window.setTimeout(() => {
      setStartCountdown((prev) => (prev === null ? null : prev - 1))
    }, 1000)

    return () => {
      window.clearTimeout(countdownTimer)
    }
  }, [gameRunning, startCountdown, gameFinished, startTimerSound])

  useEffect(() => {
    if (!isQuizActive) {
      if (!isBacPlayingActive) {
        stopTimerSound()
      }
      return
    }

    startTimerSound()

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer)
          void triggerRevealAndScoreQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      window.clearInterval(timer)
      stopTimerSound()
    }
  }, [isQuizActive, isBacPlayingActive, questionIndex, triggerRevealAndScoreQuiz, startTimerSound, stopTimerSound])

  useEffect(() => {
    if (!isBacPlayingActive) {
      if (!isQuizActive) {
        stopTimerSound()
      }
      return
    }

    startTimerSound()

    const timer = window.setInterval(() => {
      setBacTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer)
          void triggerBacReveal()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      window.clearInterval(timer)
      stopTimerSound()
    }
  }, [isBacPlayingActive, isQuizActive, bacRoundIndex, triggerBacReveal, startTimerSound, stopTimerSound])

  function handleSelectGame(game: GameType) {
    selectedGameRef.current = game
    setSelectedGame(game)
    const currentPin = pin || pinRef.current
    if (currentPin) {
      void syncRoomGameType(currentPin, game)
    }
  }

  function handleSelectTheme(theme: QuizTheme) {
    selectedThemeRef.current = theme
    setSelectedTheme(theme)
    const picked = pickRandomQuestions(theme)
    deckQuestionsRef.current = picked
    setDeckQuestions(picked)
  }

  function openGame() {
    stopTimerSound()
    const currentPin = pin || pinRef.current
    const activeGame = selectedGameRef.current

    if (currentPin) {
      void syncRoomGameType(currentPin, activeGame)
    }

    if (activeGame === 'quiz') {
      const picked = pickRandomQuestions(selectedThemeRef.current)
      deckQuestionsRef.current = picked
      setDeckQuestions(picked)
      setQuestionIndex(0)
      setRevealAnswers(false)
      setScoredQuestionIndex(null)
      scoredQuestionIndexRef.current = null
      setTimeLeft(QUESTION_DURATION)
    } else {
      const rounds = pickPetitBacRounds()
      bacRoundsRef.current = rounds
      setBacRounds(rounds)
      setBacRoundIndex(0)
      setBacTimeLeft(PETIT_BAC_DURATION_SECONDS)
      setBacPhase('playing')
      setBacEvaluations({})
    }

    countdownLaunchedRef.current = false
    setGameOpened(true)
    setGameRunning(false)
    setStartCountdown(null)
    setGameFinished(false)
  }

  async function backToGameSelection() {
    stopTimerSound()
    const currentPin = pin || pinRef.current

    countdownLaunchedRef.current = false
    setStartCountdown(null)
    setGameRunning(false)
    setGameFinished(false)
    setRevealAnswers(false)
    setScoredQuestionIndex(null)
    scoredQuestionIndexRef.current = null
    setQuestionIndex(0)
    setTimeLeft(QUESTION_DURATION)
    setBacRoundIndex(0)
    setBacTimeLeft(PETIT_BAC_DURATION_SECONDS)
    setBacPhase('playing')
    setBacEvaluations({})
    setGameOpened(false)

    if (currentPin) {
      await supabase
        .from('players')
        .update({ answer: null })
        .eq('session_id', currentPin)
      await supabase
        .from('rooms')
        .update({ status: 'waiting', game_type: selectedGameRef.current })
        .eq('room_code', currentPin)
    }

    setPlayersList((prev) => prev.map((p) => ({ ...p, answer: null })))
  }

  async function startGame() {
    stopTimerSound()
    const currentPin = pin || pinRef.current
    const activeGame = selectedGameRef.current

    if (activeGame === 'quiz') {
      const picked = pickRandomQuestions(selectedThemeRef.current)
      deckQuestionsRef.current = picked
      setDeckQuestions(picked)
      setQuestionIndex(0)
      setRevealAnswers(false)
      setScoredQuestionIndex(null)
      scoredQuestionIndexRef.current = null
      setTimeLeft(QUESTION_DURATION)
    } else {
      const rounds = pickPetitBacRounds()
      bacRoundsRef.current = rounds
      setBacRounds(rounds)
      setBacRoundIndex(0)
      setBacTimeLeft(PETIT_BAC_DURATION_SECONDS)
      setBacPhase('playing')
      setBacEvaluations({})
    }

    if (currentPin) {
      await supabase
        .from('players')
        .update({ answer: null })
        .eq('session_id', currentPin)
      await supabase
        .from('rooms')
        .update({ game_type: activeGame })
        .eq('room_code', currentPin)
      setPlayersList((prev) => prev.map((p) => ({ ...p, answer: null })))
    }

    countdownLaunchedRef.current = false
    setGameFinished(false)
    setGameRunning(true)
    setStartCountdown(START_COUNTDOWN_SECONDS)
  }

  async function stopGame() {
    stopTimerSound()
    countdownLaunchedRef.current = false
    setStartCountdown(null)
    setGameRunning(false)
    setRevealAnswers(false)
    setTimeLeft(QUESTION_DURATION)
    setBacTimeLeft(PETIT_BAC_DURATION_SECONDS)
    setBacPhase('playing')
    setBacEvaluations({})

    const currentPin = pin || pinRef.current
    if (currentPin) {
      await supabase
        .from('players')
        .update({ answer: null })
        .eq('session_id', currentPin)
      await supabase
        .from('rooms')
        .update({ status: 'waiting' })
        .eq('room_code', currentPin)
    }
    setPlayersList((prev) => prev.map((p) => ({ ...p, answer: null })))
  }

  async function nextQuestion() {
    stopTimerSound()
    const currentPin = pin || pinRef.current
    const nextIdx = Math.min(questionIndexRef.current + 1, deckQuestionsRef.current.length - 1)
    setRevealAnswers(false)
    setTimeLeft(QUESTION_DURATION)

    await supabase
      .from('players')
      .update({ answer: null })
      .eq('session_id', currentPin)

    setPlayersList((prev) => prev.map((p) => ({ ...p, answer: null })))
    setQuestionIndex(nextIdx)

    await supabase
      .from('rooms')
      .update({ status: `playing:${nextIdx}` })
      .eq('room_code', currentPin)
  }

  function handleSetBacVerdict(playerId: number, verdict: Exclude<PetitBacVerdict, 'empty'>) {
    setBacEvaluations((prev) => {
      const existing = prev[playerId]
      if (!existing || existing.verdict === 'empty') return prev
      return {
        ...prev,
        [playerId]: {
          ...existing,
          verdict,
          pointsDelta: computePetitBacPoints(verdict),
          isCloseMatch: verdict === 'duplicate' ? existing.isCloseMatch : false,
        },
      }
    })
  }

  async function applyBacRoundScores() {
    if (bacPhase !== 'review') return
    const currentPin = pin || pinRef.current
    const currentPlayers = playersListRef.current

    const updatedList = await Promise.all(
      currentPlayers.map(async (p) => {
        const entry = bacEvaluations[p.id]
        const delta = entry ? entry.pointsDelta : 0
        const currentScore = p.score ?? 0
        const nextScore = Math.max(0, currentScore + delta)

        await supabase
          .from('players')
          .update({ score: nextScore })
          .eq('id', p.id)

        return { ...p, score: nextScore }
      })
    )

    setPlayersList(updatedList)
    setBacPhase('applied')

    if (currentPin) {
      await supabase
        .from('rooms')
        .update({ status: `bac_scored:${bacRoundIndexRef.current}` })
        .eq('room_code', currentPin)
    }
  }

  async function nextBacRound() {
    stopTimerSound()
    const currentPin = pin || pinRef.current
    const nextIdx = Math.min(bacRoundIndexRef.current + 1, bacRoundsRef.current.length - 1)
    const nextRound = bacRoundsRef.current[nextIdx]

    setBacEvaluations({})
    setBacTimeLeft(PETIT_BAC_DURATION_SECONDS)
    setBacPhase('playing')

    await supabase
      .from('players')
      .update({ answer: null })
      .eq('session_id', currentPin)

    setPlayersList((prev) => prev.map((p) => ({ ...p, answer: null })))
    setBacRoundIndex(nextIdx)

    if (currentPin && nextRound) {
      await supabase
        .from('rooms')
        .update({
          status: `bac_playing:${nextIdx}:${nextRound.letter}:${encodeURIComponent(nextRound.category)}`,
          game_type: 'petitbac',
        })
        .eq('room_code', currentPin)
    }
  }

  async function finishGame() {
    stopTimerSound()
    countdownLaunchedRef.current = false
    setStartCountdown(null)
    setGameRunning(false)
    const currentPin = pin || pinRef.current
    setGameFinished(true)
    if (currentPin) {
      await supabase
        .from('rooms')
        .update({ status: 'finished' })
        .eq('room_code', currentPin)
    }
  }

  async function replayGame() {
    stopTimerSound()
    const currentPin = pin || pinRef.current

    await supabase
      .from('players')
      .update({ score: 0, answer: null })
      .eq('session_id', currentPin)

    await supabase
      .from('rooms')
      .update({ status: 'waiting', game_type: selectedGameRef.current })
      .eq('room_code', currentPin)

    const picked = pickRandomQuestions(selectedThemeRef.current)
    deckQuestionsRef.current = picked
    setDeckQuestions(picked)

    const rounds = pickPetitBacRounds()
    bacRoundsRef.current = rounds
    setBacRounds(rounds)

    countdownLaunchedRef.current = false
    setPlayersList((prev) => prev.map((p) => ({ ...p, score: 0, answer: null })))
    setGameFinished(false)
    setGameOpened(false)
    setGameRunning(false)
    setStartCountdown(null)
    setQuestionIndex(0)
    setRevealAnswers(false)
    setScoredQuestionIndex(null)
    scoredQuestionIndexRef.current = null
    setTimeLeft(QUESTION_DURATION)
    setBacRoundIndex(0)
    setBacTimeLeft(PETIT_BAC_DURATION_SECONDS)
    setBacPhase('playing')
    setBacEvaluations({})
  }

  const activeGameOption =
    GAME_OPTIONS.find((g) => g.id === selectedGame) || GAME_OPTIONS[0]
  const activeThemeOption =
    THEME_OPTIONS.find((t) => t.id === selectedTheme) || THEME_OPTIONS[0]
  const currentQuestion = deckQuestions[questionIndex]
  const currentBacRound = bacRounds[bacRoundIndex]
  const answeredCount = playersList.filter((p) => Boolean(p.answer && p.answer.trim())).length

  const rankedPlayers = computeDenseRanks(playersList)
  const isLastQuizQuestion = questionIndex >= deckQuestions.length - 1
  const isLastBacRound = bacRoundIndex >= bacRounds.length - 1

  return (
    <main className="flex min-h-screen flex-col p-6 md:p-8 bg-slate-950 text-white overflow-hidden select-none">
      <style>{`
        html, body {
          overflow: hidden;
          overscroll-behavior: none;
          touch-action: none;
          -webkit-user-select: none;
          user-select: none;
        }
        @keyframes slideLeftFade {
          0% {
            opacity: 0;
            translate: 36px 0;
          }
          100% {
            opacity: 1;
            translate: 0 0;
          }
        }
        .anim-slide-left {
          animation-name: slideLeftFade;
          animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
          animation-fill-mode: both;
        }
      `}</style>

      <div className="max-w-7xl w-full mx-auto space-y-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 px-6 py-3 rounded-2xl">
          <span className="text-sm font-bold uppercase tracking-widest text-slate-400">
            Salon Animateur
          </span>
          <span className="text-xl font-black tracking-widest text-indigo-400">
            PIN : {pin || '----'}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSoundEnabled((prev) => !prev)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {soundEnabled ? '🔊 Son ON' : '🔇 Son OFF'}
            </button>
          </div>
        </div>

        {dbError && (
          <div className="p-4 bg-red-500/20 border border-red-500 text-red-300 rounded-xl text-sm font-semibold text-center">
            Erreur Supabase : {dbError}
          </div>
        )}

        {!gameOpened ? (
          <div className="max-w-4xl w-full mx-auto my-auto space-y-6 text-center">
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

            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-4">
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                Choix du jeu
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {GAME_OPTIONS.map((game) => {
                  const active = selectedGame === game.id
                  return (
                    <button
                      key={game.id}
                      type="button"
                      onClick={() => handleSelectGame(game.id)}
                      className={`px-6 py-4 rounded-2xl border-2 flex items-center gap-4 text-left transition-all cursor-pointer ${
                        active
                          ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-[0_0_24px_rgba(99,102,241,0.45)]'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <span className="text-4xl">{game.icon}</span>
                      <div>
                        <p className="text-xl font-black">{game.title}</p>
                        <p className="text-xs text-indigo-200 font-semibold">{game.subtitle}</p>
                      </div>
                    </button>
                  )
                })}
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
                <div className="flex flex-wrap gap-6 justify-center py-2">
                  {playersList.map((p) => (
                    <span
                      key={p.id}
                      style={getPlayerNeonStyle(p.id)}
                      className="px-6 py-2.5 bg-slate-900/90 border-4 rounded-full font-bold text-xl"
                    >
                      {getDisplayName(p, playersList)}
                    </span>
                  ))}
                </div>
              )}

              {playersList.length > 0 && (
                <button
                  type="button"
                  onClick={openGame}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xl rounded-2xl transition-all shadow-lg cursor-pointer"
                >
                  Ouvrir {activeGameOption.title}
                </button>
              )}
            </div>
          </div>
        ) : gameFinished ? (
          <div className="max-w-3xl w-full mx-auto my-auto bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <p className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                Fin de la partie ({activeGameOption.title})
              </p>
              <h1 className="text-4xl md:text-5xl font-black">Classement final</h1>
            </div>

            <div className="space-y-6">
              {rankedPlayers.map(({ player: p, rank }) => {
                const theme = getPlayerColorTheme(p.id)
                return (
                  <div
                    key={p.id}
                    style={getPlayerNeonStyle(p.id)}
                    className="bg-slate-900/90 border-4 rounded-3xl px-6 py-4 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className={`text-3xl font-black shrink-0 ${theme.badgeClass}`}>
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
              type="button"
              onClick={replayGame}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xl rounded-2xl transition-all shadow-lg cursor-pointer"
            >
              🔄 Rejouer
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1 relative">
            {startCountdown !== null && startCountdown > 0 && (
              <div className="fixed inset-0 z-50 bg-slate-950/90 flex flex-col items-center justify-center pointer-events-none select-none">
                <span
                  key={`countdown-${startCountdown}`}
                  style={{ animationDuration: '350ms', animationDelay: '0ms' }}
                  className="anim-slide-left text-[11rem] md:text-[15rem] leading-none font-black text-indigo-400 drop-shadow-[0_0_50px_rgba(129,140,248,0.75)] tabular-nums"
                >
                  {startCountdown}
                </span>
              </div>
            )}

            <div className="lg:col-span-7 space-y-6">
              {!gameRunning ? (
                <div className="bg-slate-900 border border-slate-800 p-8 md:p-10 rounded-3xl shadow-2xl text-center space-y-6">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-widest text-indigo-400 font-bold">
                      {activeGameOption.title} ouvert — prêt à démarrer
                    </p>
                    <h1 className="text-3xl md:text-4xl font-black">
                      {playersList.length} joueur{playersList.length > 1 ? 's' : ''} dans le salon
                    </h1>
                  </div>

                  {selectedGame === 'quiz' ? (
                    <>
                      <div className="space-y-3">
                        <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                          Choix du thème
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                          {THEME_OPTIONS.map((theme) => {
                            const active = selectedTheme === theme.id
                            return (
                              <button
                                key={theme.id}
                                type="button"
                                onClick={() => handleSelectTheme(theme.id)}
                                className={`px-5 py-3.5 rounded-2xl border-2 flex items-center gap-3 text-left transition-all cursor-pointer ${
                                  active
                                    ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-[0_0_24px_rgba(99,102,241,0.45)]'
                                    : 'bg-slate-950/70 border-slate-700 text-slate-300 hover:border-slate-500'
                                }`}
                              >
                                <span className="text-3xl">{theme.icon}</span>
                                <div>
                                  <p className="text-lg font-black">{theme.title}</p>
                                  <p className="text-xs text-indigo-200 font-semibold">{theme.subtitle}</p>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <p className="text-slate-400 text-base">
                        Thème sélectionné : <span className="text-white font-bold">{activeThemeOption.title}</span> — {QUESTIONS_PER_GAME} questions aléatoires, victoire au plus de points.
                      </p>
                    </>
                  ) : (
                    <p className="text-slate-400 text-base">
                      {PETIT_BAC_ROUNDS_PER_GAME} manches • 1 lettre + 1 thème par manche • Unique +10, Doublon +5 (tolérance orthographique), Refusé 0, Vide -2.
                    </p>
                  )}
                </div>
              ) : selectedGame === 'quiz' ? (
                startCountdown === null && (
                  <>
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-4 text-center overflow-hidden">
                      <div className="flex items-center justify-between gap-4">
                        <p
                          key={`label-${questionIndex}`}
                          style={{ animationDuration: '350ms', animationDelay: '0ms' }}
                          className="anim-slide-left text-xs uppercase tracking-widest text-indigo-400 font-bold"
                        >
                          Question {questionIndex + 1} / {deckQuestions.length}
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

                      <h1
                        key={`text-${questionIndex}`}
                        style={{ animationDuration: '400ms', animationDelay: '320ms' }}
                        className="anim-slide-left text-3xl md:text-4xl font-black leading-tight"
                      >
                        {currentQuestion.question}
                      </h1>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                      {(['A', 'B', 'C', 'D'] as const).map((key, optIdx) => {
                        const isCorrect = revealAnswers && currentQuestion.correct === key
                        const isDimmed = revealAnswers && currentQuestion.correct !== key
                        const optionDelay = 680 + optIdx * 65

                        return (
                          <div
                            key={`${questionIndex}-${key}`}
                            style={{ animationDuration: '380ms', animationDelay: `${optionDelay}ms` }}
                            className={`anim-slide-left p-5 rounded-2xl border-2 flex items-center gap-4 transition-all duration-300 ${
                              OPTION_STYLES[key]
                            } ${
                              isCorrect
                                ? 'scale-[1.05] brightness-125 shadow-[0_0_45px_rgba(255,255,255,0.5)] opacity-100 z-10'
                                : isDimmed
                                ? 'opacity-25 scale-[0.96] grayscale'
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
                  </>
                )
              ) : (
                startCountdown === null && currentBacRound && (
                  <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl space-y-6">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold">
                        Manche {bacRoundIndex + 1} / {bacRounds.length} • Petit Bac
                      </span>
                      <div
                        className={`px-4 py-1.5 rounded-full font-black text-2xl tabular-nums border-2 transition-all ${
                          bacPhase !== 'playing'
                            ? 'bg-slate-800 border-slate-700 text-slate-400'
                            : bacTimeLeft <= 5
                            ? 'bg-rose-600 border-rose-300 text-white animate-pulse shadow-[0_0_20px_rgba(225,29,72,0.75)]'
                            : 'bg-indigo-600/30 border-indigo-400 text-indigo-200'
                        }`}
                      >
                        {bacPhase === 'playing' ? `${bacTimeLeft}s` : 'Arbitrage'}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 bg-slate-950/70 border border-slate-800 p-6 rounded-2xl">
                      <div className="w-24 h-24 rounded-3xl bg-indigo-600/30 border-4 border-indigo-400 flex items-center justify-center text-6xl font-black text-indigo-300 shrink-0">
                        {currentBacRound.letter}
                      </div>
                      <div className="text-center sm:text-left space-y-1">
                        <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                          Thème à trouver
                        </p>
                        <h1 className="text-3xl md:text-4xl font-black text-white">
                          {currentBacRound.category}
                        </h1>
                      </div>
                    </div>

                    {bacPhase === 'playing' ? (
                      <div className="text-center py-4 space-y-2">
                        <p className="text-xl font-bold text-slate-200">
                          Les joueurs saisissent leur mot sur leur téléphone...
                        </p>
                        <button
                          type="button"
                          onClick={() => void triggerBacReveal()}
                          className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-xl transition-all cursor-pointer"
                        >
                          Révéler les réponses maintenant
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                            Réponses & arbitrage en 1 clic
                          </p>
                          {bacPhase === 'review' && (
                            <button
                              type="button"
                              onClick={() => void applyBacRoundScores()}
                              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-xl transition-all cursor-pointer"
                            >
                              ✓ Valider les points
                            </button>
                          )}
                          {bacPhase === 'applied' && (
                            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                              Points attribués
                            </span>
                          )}
                        </div>

                        <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                          {playersList.map((p) => {
                            const entry = bacEvaluations[p.id]
                            const verdict = entry?.verdict ?? (p.answer?.trim() ? 'unique' : 'empty')
                            const badge = formatVerdictBadge(verdict, Boolean(entry?.isCloseMatch))

                            return (
                              <div
                                key={p.id}
                                className="bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3"
                              >
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-slate-400">
                                    {getDisplayName(p, playersList)}
                                  </p>
                                  <p className="text-2xl font-black text-white truncate">
                                    {p.answer?.trim() ? p.answer.trim() : '—'}
                                  </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                  <span
                                    className={`px-3 py-1 rounded-full border text-xs font-black ${badge.className}`}
                                  >
                                    {badge.label}
                                  </span>

                                  {bacPhase === 'review' && verdict !== 'empty' && (
                                    <div className="flex items-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => handleSetBacVerdict(p.id, 'unique')}
                                        className={`px-2.5 py-1 rounded-lg text-xs font-black border cursor-pointer ${
                                          verdict === 'unique'
                                            ? 'bg-emerald-500 border-emerald-300 text-slate-950'
                                            : 'bg-slate-900 border-slate-700 text-slate-300'
                                        }`}
                                      >
                                        Unique
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleSetBacVerdict(p.id, 'duplicate')}
                                        className={`px-2.5 py-1 rounded-lg text-xs font-black border cursor-pointer ${
                                          verdict === 'duplicate'
                                            ? 'bg-amber-400 border-amber-200 text-slate-950'
                                            : 'bg-slate-900 border-slate-700 text-slate-300'
                                        }`}
                                      >
                                        Doublon
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleSetBacVerdict(p.id, 'rejected')}
                                        className={`px-2.5 py-1 rounded-lg text-xs font-black border cursor-pointer ${
                                          verdict === 'rejected'
                                            ? 'bg-rose-600 border-rose-400 text-white'
                                            : 'bg-slate-900 border-slate-700 text-slate-300'
                                        }`}
                                      >
                                        Refusé
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              )}

              <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  {!gameRunning ? (
                    <>
                      <button
                        type="button"
                        onClick={() => void startGame()}
                        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-lg rounded-xl transition-all shadow-lg cursor-pointer"
                      >
                        Démarrer le jeu
                      </button>
                      <button
                        type="button"
                        onClick={() => void backToGameSelection()}
                        className="px-5 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold text-lg rounded-xl transition-all cursor-pointer"
                      >
                        Sélection du jeu
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void stopGame()}
                      className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-black text-lg rounded-xl transition-all shadow-lg cursor-pointer"
                    >
                      Arrêter
                    </button>
                  )}

                  {gameRunning && startCountdown === null && (
                    <span className="text-lg font-bold text-slate-200">
                      Réponses : {answeredCount} / {playersList.length}
                    </span>
                  )}
                </div>

                {gameRunning && startCountdown === null && selectedGame === 'quiz' && (
                  revealAnswers && isLastQuizQuestion ? (
                    <button
                      type="button"
                      onClick={() => void finishGame()}
                      className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-lg rounded-xl transition-all shadow-lg cursor-pointer"
                    >
                      🏆 Voir le podium final
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void nextQuestion()}
                      className="px-5 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-lg rounded-xl transition-all cursor-pointer"
                    >
                      Suivante →
                    </button>
                  )
                )}

                {gameRunning && startCountdown === null && selectedGame === 'petitbac' && bacPhase === 'applied' && (
                  isLastBacRound ? (
                    <button
                      type="button"
                      onClick={() => void finishGame()}
                      className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-lg rounded-xl transition-all shadow-lg cursor-pointer"
                    >
                      🏆 Voir le podium final
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void nextBacRound()}
                      className="px-5 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-lg rounded-xl transition-all cursor-pointer"
                    >
                      Manche suivante →
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-5 overflow-visible">
              <h2 className="text-sm uppercase tracking-widest text-indigo-300 font-bold text-center">
                Classement en direct
              </h2>

              <div className="space-y-6 py-2">
                {rankedPlayers.map(({ player: p, rank }) => {
                  const theme = getPlayerColorTheme(p.id)
                  const answerBubbleStyle =
                    p.answer && ANSWER_BUBBLE_STYLES[p.answer]
                      ? ANSWER_BUBBLE_STYLES[p.answer]
                      : 'bg-slate-700 border-slate-500 text-white'

                  return (
                    <div
                      key={p.id}
                      style={getPlayerNeonStyle(p.id)}
                      className="bg-slate-900/90 border-4 rounded-3xl px-6 py-4 flex items-center justify-between gap-4 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`text-2xl font-black shrink-0 ${theme.badgeClass}`}>
                          #{rank}
                        </span>
                        <span className="text-3xl md:text-4xl font-black truncate">
                          {getDisplayName(p, playersList)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {selectedGame === 'quiz' ? (
                          p.answer ? (
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
                          )
                        ) : p.answer?.trim() ? (
                          <span className="w-10 h-10 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 font-black text-lg flex items-center justify-center shrink-0">
                            ✓
                          </span>
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
