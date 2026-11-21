'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
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
  tag: string
}[] = [
  {
    id: 'quiz',
    title: 'Quiz',
    subtitle: '15 questions • +10 / -5 / -2 pts',
    tag: 'QCM',
  },
  {
    id: 'petitbac',
    title: 'Petit Bac',
    subtitle: `${PETIT_BAC_ROUNDS_PER_GAME} manches • 1 lettre + 1 thème`,
    tag: 'Lettres',
  },
]

const THEME_OPTIONS: {
  id: QuizTheme
  title: string
  subtitle: string
  tag: string
}[] = [
  {
    id: 'culture',
    title: 'Culture générale',
    subtitle: `${QUESTIONS.length} questions`,
    tag: 'Général',
  },
  {
    id: 'musique',
    title: 'Musique & Tubes mondiaux',
    subtitle: `${MUSIQUE_QUESTIONS.length} questions • Francophone, TV & classiques`,
    tag: 'Audio',
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
  A: 'bg-rose-500/15 border-rose-400/40 text-rose-100',
  B: 'bg-sky-500/15 border-sky-400/40 text-sky-100',
  C: 'bg-amber-400/15 border-amber-300/40 text-amber-100',
  D: 'bg-emerald-500/15 border-emerald-400/40 text-emerald-100',
}

const ANSWER_BUBBLE_STYLES: Record<string, string> = {
  A: 'bg-rose-500 border-rose-300 text-white',
  B: 'bg-sky-500 border-sky-300 text-white',
  C: 'bg-amber-400 border-amber-200 text-zinc-950',
  D: 'bg-emerald-500 border-emerald-300 text-white',
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

function formatVerdictBadge(entry?: EvaluatedPetitBacEntry, hasRawAnswer = false) {
  const verdict: PetitBacVerdict = entry?.verdict ?? (hasRawAnswer ? 'unique' : 'empty')
  const isCloseMatch = Boolean(entry?.isCloseMatch)
  const needsManualCheck = Boolean(entry?.needsManualCheck)

  if (verdict === 'unique') {
    return {
      label: 'Unique • +10 pts',
      className: 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300',
    }
  }
  if (verdict === 'duplicate') {
    return {
      label: isCloseMatch ? 'Doublon (faute proche) • +5 pts' : 'Doublon • +5 pts',
      className: 'bg-amber-400/15 border-amber-300/40 text-amber-200',
    }
  }
  if (verdict === 'rejected') {
    return {
      label: needsManualCheck ? 'Hors liste / À vérifier • 0 pt' : 'Refusé • 0 pt',
      className: 'bg-rose-500/15 border-rose-400/40 text-rose-300',
    }
  }
  return {
    label: `Aucune réponse • -${PETIT_BAC_NO_ANSWER_PENALTY} pts`,
    className: 'bg-zinc-800/80 border-white/10 text-zinc-400',
  }
}

export default function TVPage() {
  const router = useRouter()
  const [entryModeSelected, setEntryModeSelected] = useState<boolean>(false)
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
  const gameRunningRef = useRef<boolean>(false)
  const gameFinishedRef = useRef<boolean>(false)
  const deckQuestionsRef = useRef<QuizQuestion[]>(deckQuestions)
  const questionIndexRef = useRef<number>(0)
  const scoredQuestionIndexRef = useRef<number | null>(null)
  const isRevealingRef = useRef<boolean>(false)
  const bacRoundsRef = useRef<PetitBacRound[]>(bacRounds)
  const bacRoundIndexRef = useRef<number>(0)
  const bacPhaseRef = useRef<'playing' | 'review' | 'applied'>('playing')
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
    gameRunningRef.current = gameRunning
  }, [gameRunning])

  useEffect(() => {
    gameFinishedRef.current = gameFinished
  }, [gameFinished])

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

  useEffect(() => {
    bacPhaseRef.current = bacPhase
  }, [bacPhase])

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

  const isSoundActive = isQuizActive

  useEffect(() => {
    if (!soundEnabled || !isSoundActive) {
      stopTimerSound()
    } else {
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
    if (isBacRevealingRef.current || bacPhaseRef.current !== 'playing') return
    isBacRevealingRef.current = true
    bacPhaseRef.current = 'review'
    setBacTimeLeft(0)
    setBacPhase('review')
    stopTimerSound()

    const currentPin = pinRef.current
    const roundIdx = bacRoundIndexRef.current
    const round = bacRoundsRef.current[roundIdx]
    const currentPlayers = playersListRef.current

    const evaluatedList = evaluatePetitBacAnswers(
      currentPlayers,
      round?.letter ?? '',
      round?.category ?? ''
    )
    const mapByPlayer: Record<number, EvaluatedPetitBacEntry> = {}
    for (const item of evaluatedList) {
      mapByPlayer[item.playerId] = item
    }

    setBacEvaluations(mapByPlayer)

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

    const createRoom = async () => {
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
          if (gameRunningRef.current || gameFinishedRef.current) return
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
            prev.map((p) => {
              if (p.id !== updatedPlayer.id) return p
              const allowAnswerSync =
                selectedGameRef.current !== 'petitbac' || bacPhaseRef.current === 'playing'
              return {
                ...p,
                pseudo: updatedPlayer.pseudo ?? p.pseudo,
                score: updatedPlayer.score ?? p.score ?? 0,
                answer: allowAnswerSync ? updatedPlayer.answer : p.answer,
              }
            })
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    if (!gameRunning || startCountdown === null || gameFinished) return

    if (startCountdown <= 0) {
      if (countdownLaunchedRef.current) return
      countdownLaunchedRef.current = true

      const currentPin = pinRef.current
      const activeGame = selectedGameRef.current

      const launchRoundOne = async () => {
        if (activeGame === 'quiz') {
          setTimeLeft(QUESTION_DURATION)
          if (currentPin) {
            await supabase
              .from('rooms')
              .update({ status: 'playing:0', game_type: 'quiz' })
              .eq('room_code', currentPin)
          }
          setStartCountdown(null)
          startTimerSound()
        } else {
          const firstRound = bacRoundsRef.current[0]
          isBacRevealingRef.current = false
          bacPhaseRef.current = 'playing'
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
          setStartCountdown(null)
        }
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
      stopTimerSound()
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
  }, [isQuizActive, questionIndex, triggerRevealAndScoreQuiz, startTimerSound, stopTimerSound])

  const answeredCount = playersList.filter((p) => Boolean(p.answer && p.answer.trim())).length
  const allPlayersAnsweredBac =
    isBacPlayingActive &&
    !isBacRevealingRef.current &&
    playersList.length > 0 &&
    playersList.every((p) => Boolean(p.answer && p.answer.trim()))

  useEffect(() => {
    if (!isBacPlayingActive || isBacRevealingRef.current) return

    if (allPlayersAnsweredBac) {
      void triggerBacReveal()
      return
    }

    const timer = window.setInterval(() => {
      if (!isBacPlayingActive || isBacRevealingRef.current) {
        window.clearInterval(timer)
        return
      }
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
    }
  }, [isBacPlayingActive, allPlayersAnsweredBac, bacRoundIndex, triggerBacReveal])

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
      isBacRevealingRef.current = false
      bacPhaseRef.current = 'playing'
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
    isBacRevealingRef.current = false
    bacPhaseRef.current = 'playing'
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
    setPlayersList((prev) => prev.map((p) => ({ ...p, answer: null })))

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
      isBacRevealingRef.current = false
      bacPhaseRef.current = 'playing'
      setBacRounds(rounds)
      setBacRoundIndex(0)
      setBacTimeLeft(PETIT_BAC_DURATION_SECONDS)
      setBacPhase('playing')
      setBacEvaluations({})
    }

    setPlayersList((prev) => prev.map((p) => ({ ...p, answer: null })))

    if (currentPin) {
      await supabase
        .from('players')
        .update({ answer: null })
        .eq('session_id', currentPin)
      await supabase
        .from('rooms')
        .update({ game_type: activeGame })
        .eq('room_code', currentPin)
    }

    countdownLaunchedRef.current = false
    setGameFinished(false)
    setGameRunning(true)
    setStartCountdown(START_COUNTDOWN_SECONDS)
  }

  async function stopGame() {
    stopTimerSound()
    countdownLaunchedRef.current = false
    isBacRevealingRef.current = false
    bacPhaseRef.current = 'playing'
    setStartCountdown(null)
    setGameRunning(false)
    setRevealAnswers(false)
    setTimeLeft(QUESTION_DURATION)
    setBacTimeLeft(PETIT_BAC_DURATION_SECONDS)
    setBacPhase('playing')
    setBacEvaluations({})
    setPlayersList((prev) => prev.map((p) => ({ ...p, answer: null })))

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
  }

  async function nextQuestion() {
    stopTimerSound()
    const currentPin = pin || pinRef.current
    const nextIdx = Math.min(questionIndexRef.current + 1, deckQuestionsRef.current.length - 1)
    setRevealAnswers(false)
    setTimeLeft(QUESTION_DURATION)
    setPlayersList((prev) => prev.map((p) => ({ ...p, answer: null })))
    setQuestionIndex(nextIdx)

    await supabase
      .from('players')
      .update({ answer: null })
      .eq('session_id', currentPin)

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
    bacPhaseRef.current = 'applied'
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

    isBacRevealingRef.current = false
    bacPhaseRef.current = 'playing'
    bacRoundIndexRef.current = nextIdx
    setBacEvaluations({})
    setBacTimeLeft(PETIT_BAC_DURATION_SECONDS)
    setBacRoundIndex(nextIdx)
    setBacPhase('playing')
    setPlayersList((prev) => prev.map((p) => ({ ...p, answer: null })))

    if (currentPin) {
      await supabase
        .from('players')
        .update({ answer: null })
        .eq('session_id', currentPin)

      if (nextRound) {
        await supabase
          .from('rooms')
          .update({
            status: `bac_playing:${nextIdx}:${nextRound.letter}:${encodeURIComponent(nextRound.category)}`,
            game_type: 'petitbac',
          })
          .eq('room_code', currentPin)
      }
    }
  }

  async function finishGame() {
    stopTimerSound()
    countdownLaunchedRef.current = false
    isBacRevealingRef.current = false
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

    const picked = pickRandomQuestions(selectedThemeRef.current)
    deckQuestionsRef.current = picked
    setDeckQuestions(picked)

    const rounds = pickPetitBacRounds()
    bacRoundsRef.current = rounds
    setBacRounds(rounds)

    countdownLaunchedRef.current = false
    isBacRevealingRef.current = false
    bacPhaseRef.current = 'playing'
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

    if (currentPin) {
      await supabase
        .from('players')
        .update({ score: 0, answer: null })
        .eq('session_id', currentPin)

      await supabase
        .from('rooms')
        .update({ status: 'waiting', game_type: selectedGameRef.current })
        .eq('room_code', currentPin)
    }
  }

  function handleGoToPlayer() {
    const targetPin = pin || pinRef.current
    router.push(targetPin ? `/player?pin=${targetPin}` : '/player')
  }

  const activeGameOption =
    GAME_OPTIONS.find((g) => g.id === selectedGame) || GAME_OPTIONS[0]
  const activeThemeOption =
    THEME_OPTIONS.find((t) => t.id === selectedTheme) || THEME_OPTIONS[0]
  const currentQuestion = deckQuestions[questionIndex]
  const currentBacRound = bacRounds[bacRoundIndex]

  const rankedPlayers = computeDenseRanks(playersList)
  const isLastQuizQuestion = questionIndex >= deckQuestions.length - 1
  const isLastBacRound = bacRoundIndex >= bacRounds.length - 1

  return (
    <main className="flex min-h-screen flex-col p-6 md:p-8 bg-zinc-950 text-zinc-100 overflow-hidden select-none font-sans antialiased">
      <style>{`
        html, body {
          overflow: hidden;
          overscroll-behavior: none;
          touch-action: none;
          -webkit-user-select: none;
          user-select: none;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
        }
        @keyframes slideLeftFade {
          0% {
            opacity: 0;
            translate: 28px 0;
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

      <div className="max-w-6xl w-full mx-auto space-y-6 flex-1 flex flex-col">
        <header className="flex items-center justify-between gap-4 bg-zinc-900/75 backdrop-blur-xl border border-white/10 px-6 py-3.5 rounded-2xl">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
              {!entryModeSelected ? 'Accueil' : 'Mode TV • Hôte'}
            </span>
          </div>

          {!entryModeSelected ? (
            <span className="text-sm font-medium text-zinc-300">
              Choisir un mode d&apos;accès
            </span>
          ) : !gameOpened ? (
            <div className="flex items-center gap-2.5">
              <span className="text-xs uppercase tracking-[0.12em] text-zinc-400 font-medium">
                Code PIN
              </span>
              <span className="text-xl font-semibold tracking-[0.22em] text-white tabular-nums">
                {pin || '----'}
              </span>
            </div>
          ) : (
            <span className="text-sm font-semibold tracking-wide text-amber-300">
              Partie en cours
            </span>
          )}

          <button
            type="button"
            onClick={() => setSoundEnabled((prev) => !prev)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-white/10 border-white/20 text-white hover:bg-white/15'
                : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {soundEnabled ? 'Audio actif' : 'Audio coupé'}
          </button>
        </header>

        {dbError && (
          <div className="p-4 bg-rose-500/10 border border-rose-400/30 text-rose-200 rounded-2xl text-sm font-medium text-center">
            Erreur Supabase : {dbError}
          </div>
        )}

        {!entryModeSelected ? (
          <div className="max-w-3xl w-full mx-auto my-auto space-y-6">
            <section className="bg-zinc-900/75 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl space-y-8">
              <div className="text-center space-y-2">
                <p className="text-xs uppercase tracking-[0.14em] text-zinc-400 font-semibold">
                  Configuration
                </p>
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
                  Comment souhaitez-vous démarrer ?
                </h1>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setEntryModeSelected(true)}
                  className="p-6 rounded-2xl bg-zinc-950/70 hover:bg-zinc-800/70 border border-white/10 hover:border-sky-400/60 text-left flex flex-col justify-between gap-6 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs uppercase tracking-[0.12em] font-semibold text-sky-300">
                      Écran principal
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/5 border border-white/10 text-zinc-300">
                      Hôte
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-2xl font-semibold tracking-tight text-white">
                      Mode TV / Hôte
                    </p>
                    <p className="text-sm text-zinc-400">
                      Créer un salon, afficher le code PIN et le QR code, animer la partie et suivre le classement.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleGoToPlayer}
                  className="p-6 rounded-2xl bg-zinc-950/70 hover:bg-zinc-800/70 border border-white/10 hover:border-white/30 text-left flex flex-col justify-between gap-6 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs uppercase tracking-[0.12em] font-semibold text-zinc-300">
                      Manette mobile
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/5 border border-white/10 text-zinc-300">
                      Joueur
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-2xl font-semibold tracking-tight text-white">
                      Rejoindre
                    </p>
                    <p className="text-sm text-zinc-400">
                      Ouvrir l&apos;écran joueur pour saisir un code PIN, choisir un pseudo et répondre aux manches.
                    </p>
                  </div>
                </button>
              </div>
            </section>
          </div>
        ) : !gameOpened ? (
          <div className="max-w-4xl w-full mx-auto my-auto space-y-6">
            <section className="bg-zinc-900/75 backdrop-blur-xl border border-white/10 p-7 md:p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-2 text-center md:text-left">
                <p className="text-xs uppercase tracking-[0.14em] text-zinc-400 font-semibold">
                  Connexion des joueurs
                </p>
                <div className="text-6xl md:text-7xl font-semibold tracking-[0.18em] text-white tabular-nums">
                  {pin || '----'}
                </div>
                <p className="text-xs text-zinc-400 break-all pt-1">
                  {joinUrl || '/player'}
                </p>
              </div>

              {joinUrl ? (
                <div className="bg-white p-3 rounded-2xl border border-white/10 shrink-0">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(joinUrl)}`}
                    alt="QR Code pour rejoindre la partie"
                    className="w-36 h-36 md:w-40 md:h-40 block"
                  />
                </div>
              ) : (
                <div className="w-36 h-36 md:w-40 md:h-40 bg-zinc-800/70 border border-white/10 rounded-2xl flex items-center justify-center text-xs text-zinc-400 shrink-0">
                  Génération du code
                </div>
              )}
            </section>

            <section className="bg-zinc-900/70 backdrop-blur-xl border border-white/10 p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.14em] text-zinc-400 font-semibold">
                  Choisir un mode de jeu
                </p>
                <span className="text-xs text-zinc-400">
                  Sélection active : {activeGameOption.title}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {GAME_OPTIONS.map((game) => {
                  const active = selectedGame === game.id
                  return (
                    <button
                      key={game.id}
                      type="button"
                      onClick={() => handleSelectGame(game.id)}
                      className={`px-5 py-4 rounded-2xl border flex items-center justify-between gap-4 text-left transition-all cursor-pointer ${
                        active
                          ? 'bg-sky-500/15 border-sky-400/70 text-white'
                          : 'bg-zinc-900/60 border-white/10 text-zinc-300 hover:bg-zinc-800/60 hover:border-white/20'
                      }`}
                    >
                      <div className="space-y-1">
                        <p className="text-lg font-semibold tracking-tight">{game.title}</p>
                        <p className="text-xs text-zinc-400">{game.subtitle}</p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                          active
                            ? 'bg-sky-400/20 border-sky-300/40 text-sky-200'
                            : 'bg-white/5 border-white/10 text-zinc-400'
                        }`}
                      >
                        {game.tag}
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>

            <section className="bg-zinc-900/70 backdrop-blur-xl border border-white/10 p-6 rounded-3xl space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-300">
                  Joueurs connectés
                </h2>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-zinc-200 tabular-nums">
                  {playersList.length}
                </span>
              </div>

              {playersList.length === 0 ? (
                <p className="text-sm text-zinc-400 text-center py-4">
                  En attente des joueurs sur leur smartphone.
                </p>
              ) : (
                <div className="flex flex-wrap gap-3 justify-center py-1">
                  {playersList.map((p) => (
                    <span
                      key={p.id}
                      className="px-4 py-2 bg-zinc-900 border border-white/15 rounded-full font-medium text-base text-white"
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
                  className="w-full py-3.5 bg-sky-500 hover:bg-sky-400 text-zinc-950 font-semibold text-base rounded-2xl transition-all cursor-pointer"
                >
                  Ouvrir {activeGameOption.title}
                </button>
              )}
            </section>
          </div>
        ) : gameFinished ? (
          <div className="max-w-3xl w-full mx-auto my-auto bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl space-y-6">
            <div className="text-center space-y-1.5">
              <p className="text-xs uppercase tracking-[0.14em] text-amber-300 font-semibold">
                Fin de la partie • {activeGameOption.title}
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
                Classement final
              </h1>
            </div>

            <div className="space-y-3">
              {rankedPlayers.map(({ player: p, rank }) => {
                const theme = getPlayerColorTheme(p.id)
                return (
                  <div
                    key={p.id}
                    className="bg-zinc-950/70 border border-white/10 rounded-2xl px-5 py-3.5 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className={`text-lg font-semibold shrink-0 tabular-nums ${theme.badgeClass}`}>
                        #{rank}
                      </span>
                      <span className="text-xl md:text-2xl font-semibold text-white truncate">
                        {getDisplayName(p, playersList)}
                      </span>
                    </div>
                    <span className="text-2xl md:text-3xl font-semibold text-white shrink-0 tabular-nums">
                      {p.score ?? 0}{' '}
                      <span className="text-sm font-medium text-zinc-400">pts</span>
                    </span>
                  </div>
                )
              })}
            </div>

            <button
              type="button"
              onClick={replayGame}
              className="w-full py-3.5 bg-sky-500 hover:bg-sky-400 text-zinc-950 font-semibold text-base rounded-2xl transition-all cursor-pointer"
            >
              Rejouer
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1 relative">
            {startCountdown !== null && startCountdown > 0 && (
              <div className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-md flex flex-col items-center justify-center pointer-events-none select-none">
                <span
                  key={`countdown-${startCountdown}`}
                  style={{ animationDuration: '350ms', animationDelay: '0ms' }}
                  className="anim-slide-left text-[10rem] md:text-[14rem] leading-none font-semibold text-white tabular-nums"
                >
                  {startCountdown}
                </span>
              </div>
            )}

            <div className="lg:col-span-7 space-y-5">
              {!gameRunning ? (
                <div className="bg-zinc-900/75 backdrop-blur-xl border border-white/10 p-8 rounded-3xl text-center space-y-6">
                  <div className="space-y-1.5">
                    <p className="text-xs uppercase tracking-[0.14em] text-sky-300 font-semibold">
                      {activeGameOption.title} • Prêt
                    </p>
                    <h1 className="text-3xl font-semibold tracking-tight text-white">
                      {playersList.length} joueur{playersList.length > 1 ? 's' : ''} dans le salon
                    </h1>
                  </div>

                  {selectedGame === 'quiz' ? (
                    <>
                      <div className="space-y-3">
                        <p className="text-xs uppercase tracking-[0.14em] text-zinc-400 font-semibold">
                          Thème du Quiz
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                          {THEME_OPTIONS.map((theme) => {
                            const active = selectedTheme === theme.id
                            return (
                              <button
                                key={theme.id}
                                type="button"
                                onClick={() => handleSelectTheme(theme.id)}
                                className={`px-4 py-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${
                                  active
                                    ? 'bg-sky-500/15 border-sky-400/70 text-white'
                                    : 'bg-zinc-950/60 border-white/10 text-zinc-300 hover:bg-zinc-800/60'
                                }`}
                              >
                                <div className="space-y-0.5">
                                  <p className="text-base font-semibold">{theme.title}</p>
                                  <p className="text-xs text-zinc-400">{theme.subtitle}</p>
                                </div>
                                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                                  {theme.tag}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <p className="text-sm text-zinc-400">
                        Thème sélectionné : <span className="text-white font-medium">{activeThemeOption.title}</span> • {QUESTIONS_PER_GAME} questions aléatoires.
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-zinc-400">
                      {PETIT_BAC_ROUNDS_PER_GAME} manches • 1 lettre et 1 thème par manche • Unique +10, Doublon +5, Refusé 0, Vide -2.
                    </p>
                  )}
                </div>
              ) : selectedGame === 'quiz' ? (
                startCountdown === null && (
                  <>
                    <div className="bg-zinc-900/75 backdrop-blur-xl border border-white/10 p-7 rounded-3xl space-y-4 text-center overflow-hidden">
                      <div className="flex items-center justify-between gap-4">
                        <p
                          key={`label-${questionIndex}`}
                          style={{ animationDuration: '350ms', animationDelay: '0ms' }}
                          className="anim-slide-left text-xs uppercase tracking-[0.14em] text-zinc-400 font-semibold tabular-nums"
                        >
                          Question {questionIndex + 1} / {deckQuestions.length}
                        </p>

                        <div
                          className={`px-4 py-1 rounded-full font-semibold text-xl tabular-nums border transition-all ${
                            revealAnswers
                              ? 'bg-zinc-800 border-white/10 text-zinc-400'
                              : timeLeft <= 5
                              ? 'bg-rose-500/20 border-rose-400/60 text-rose-200'
                              : 'bg-white/5 border-white/15 text-white'
                          }`}
                        >
                          {revealAnswers ? 'Terminé' : `${timeLeft}s`}
                        </div>
                      </div>

                      <h1
                        key={`text-${questionIndex}`}
                        style={{ animationDuration: '400ms', animationDelay: '320ms' }}
                        className="anim-slide-left text-2xl md:text-4xl font-semibold tracking-tight leading-snug text-white"
                      >
                        {currentQuestion.question}
                      </h1>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
                      {(['A', 'B', 'C', 'D'] as const).map((key, optIdx) => {
                        const isCorrect = revealAnswers && currentQuestion.correct === key
                        const isDimmed = revealAnswers && currentQuestion.correct !== key
                        const optionDelay = 680 + optIdx * 65

                        return (
                          <div
                            key={`${questionIndex}-${key}`}
                            style={{ animationDuration: '380ms', animationDelay: `${optionDelay}ms` }}
                            className={`anim-slide-left p-4 rounded-2xl border flex items-center gap-4 transition-all duration-300 ${
                              OPTION_STYLES[key]
                            } ${
                              isCorrect
                                ? 'ring-2 ring-white/70 scale-[1.02] opacity-100'
                                : isDimmed
                                ? 'opacity-30'
                                : ''
                            }`}
                          >
                            <span className="w-10 h-10 rounded-xl bg-black/30 border border-white/15 flex items-center justify-center font-semibold text-lg shrink-0">
                              {key}
                            </span>
                            <span className="text-lg md:text-xl font-medium leading-snug">
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
                  <div className="bg-zinc-900/75 backdrop-blur-xl border border-white/10 p-6 md:p-7 rounded-3xl space-y-6">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs uppercase tracking-[0.14em] text-zinc-400 font-semibold tabular-nums">
                        Manche {bacRoundIndex + 1} / {bacRounds.length} • Petit Bac
                      </span>
                      <div
                        className={`px-4 py-1 rounded-full font-semibold text-xl tabular-nums border transition-all ${
                          bacPhase !== 'playing'
                            ? 'bg-zinc-800 border-white/10 text-zinc-400'
                            : bacTimeLeft <= 5
                            ? 'bg-rose-500/20 border-rose-400/60 text-rose-200'
                            : 'bg-white/5 border-white/15 text-white'
                        }`}
                      >
                        {bacPhase === 'playing' ? `${bacTimeLeft}s` : 'Arbitrage'}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 bg-zinc-950/70 border border-white/10 p-6 rounded-2xl">
                      <div className="w-24 h-24 rounded-3xl bg-sky-500/15 border border-sky-400/40 flex items-center justify-center text-6xl font-semibold text-sky-200 shrink-0">
                        {currentBacRound.letter}
                      </div>
                      <div className="text-center sm:text-left space-y-1">
                        <p className="text-xs uppercase tracking-[0.14em] text-zinc-400 font-semibold">
                          Thème
                        </p>
                        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
                          {currentBacRound.category}
                        </h1>
                      </div>
                    </div>

                    {bacPhase === 'playing' ? (
                      <div className="text-center py-3 space-y-3">
                        <p className="text-base font-medium text-zinc-300">
                          Saisie en cours sur les smartphones.
                        </p>
                        <button
                          type="button"
                          onClick={() => void triggerBacReveal()}
                          className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer"
                        >
                          Révéler maintenant
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs uppercase tracking-[0.14em] text-zinc-400 font-semibold">
                            Réponses et arbitrage
                          </p>
                          {bacPhase === 'review' && (
                            <button
                              type="button"
                              onClick={() => void applyBacRoundScores()}
                              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs rounded-xl transition-all cursor-pointer"
                            >
                              Valider les points
                            </button>
                          )}
                          {bacPhase === 'applied' && (
                            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                              Points attribués
                            </span>
                          )}
                        </div>

                        <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                          {playersList.map((p) => {
                            const entry = bacEvaluations[p.id]
                            const hasRawAnswer = Boolean(p.answer?.trim())
                            const verdict = entry?.verdict ?? (hasRawAnswer ? 'unique' : 'empty')
                            const badge = formatVerdictBadge(entry, hasRawAnswer)

                            return (
                              <div
                                key={p.id}
                                className="bg-zinc-950/75 border border-white/10 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3"
                              >
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-zinc-400">
                                    {getDisplayName(p, playersList)}
                                  </p>
                                  <p className="text-xl font-semibold text-white truncate">
                                    {hasRawAnswer ? p.answer!.trim() : '—'}
                                  </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                  <span
                                    className={`px-3 py-1 rounded-full border text-xs font-medium ${badge.className}`}
                                  >
                                    {badge.label}
                                  </span>

                                  {bacPhase === 'review' && verdict !== 'empty' && (
                                    <div className="flex items-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => handleSetBacVerdict(p.id, 'unique')}
                                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-pointer ${
                                          verdict === 'unique'
                                            ? 'bg-emerald-500 border-emerald-400 text-zinc-950'
                                            : 'bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800'
                                        }`}
                                      >
                                        Unique
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleSetBacVerdict(p.id, 'duplicate')}
                                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-pointer ${
                                          verdict === 'duplicate'
                                            ? 'bg-amber-400 border-amber-300 text-zinc-950'
                                            : 'bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800'
                                        }`}
                                      >
                                        Doublon
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleSetBacVerdict(p.id, 'rejected')}
                                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-pointer ${
                                          verdict === 'rejected'
                                            ? 'bg-rose-500 border-rose-400 text-white'
                                            : 'bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800'
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

              <div className="bg-zinc-900/75 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  {!gameRunning ? (
                    <>
                      <button
                        type="button"
                        onClick={() => void startGame()}
                        className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-zinc-950 font-semibold text-sm rounded-xl transition-all cursor-pointer"
                      >
                        Démarrer la partie
                      </button>
                      <button
                        type="button"
                        onClick={() => void backToGameSelection()}
                        className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-zinc-200 font-medium text-sm rounded-xl transition-all cursor-pointer"
                      >
                        Changer de jeu
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void stopGame()}
                      className="px-5 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-200 font-semibold text-sm rounded-xl transition-all cursor-pointer"
                    >
                      Arrêter
                    </button>
                  )}

                  {gameRunning && startCountdown === null && (
                    <span className="text-sm font-medium text-zinc-300 tabular-nums">
                      Réponses : {answeredCount} / {playersList.length}
                    </span>
                  )}
                </div>

                {gameRunning && startCountdown === null && selectedGame === 'quiz' && (
                  revealAnswers && isLastQuizQuestion ? (
                    <button
                      type="button"
                      onClick={() => void finishGame()}
                      className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold text-sm rounded-xl transition-all cursor-pointer"
                    >
                      Classement final
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void nextQuestion()}
                      className="px-4 py-2.5 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer"
                    >
                      Question suivante
                    </button>
                  )
                )}

                {gameRunning && startCountdown === null && selectedGame === 'petitbac' && bacPhase === 'applied' && (
                  isLastBacRound ? (
                    <button
                      type="button"
                      onClick={() => void finishGame()}
                      className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold text-sm rounded-xl transition-all cursor-pointer"
                    >
                      Classement final
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void nextBacRound()}
                      className="px-4 py-2.5 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer"
                    >
                      Manche suivante
                    </button>
                  )
                )}
              </div>
            </div>

            <aside className="lg:col-span-5 bg-zinc-900/70 backdrop-blur-xl border border-white/10 p-6 rounded-3xl space-y-4">
              <h2 className="text-xs uppercase tracking-[0.14em] text-zinc-400 font-semibold text-center">
                Classement en direct
              </h2>

              <div className="space-y-3">
                {rankedPlayers.map(({ player: p, rank }) => {
                  const theme = getPlayerColorTheme(p.id)
                  const answerBubbleStyle =
                    p.answer && ANSWER_BUBBLE_STYLES[p.answer]
                      ? ANSWER_BUBBLE_STYLES[p.answer]
                      : 'bg-zinc-700 border-white/20 text-white'

                  return (
                    <div
                      key={p.id}
                      style={getPlayerNeonStyle(p.id)}
                      className="bg-zinc-950/75 border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between gap-3 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`text-base font-semibold shrink-0 tabular-nums ${theme.badgeClass}`}>
                          #{rank}
                        </span>
                        <span className="text-xl md:text-2xl font-semibold text-white truncate">
                          {getDisplayName(p, playersList)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {selectedGame === 'quiz' ? (
                          p.answer ? (
                            revealAnswers ? (
                              <span
                                className={`w-9 h-9 rounded-full border font-semibold text-base flex items-center justify-center shrink-0 ${answerBubbleStyle}`}
                              >
                                {p.answer}
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 font-semibold text-xs shrink-0">
                                OK
                              </span>
                            )
                          ) : (
                            <span className="text-sm font-medium text-zinc-500 px-1.5">...</span>
                          )
                        ) : p.answer?.trim() ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 font-semibold text-xs shrink-0">
                            OK
                          </span>
                        ) : (
                          <span className="text-sm font-medium text-zinc-500 px-1.5">...</span>
                        )}

                        <span className="text-2xl md:text-3xl font-semibold text-white tabular-nums">
                          {p.score ?? 0}{' '}
                          <span className="text-xs font-medium text-zinc-400">pts</span>
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}
