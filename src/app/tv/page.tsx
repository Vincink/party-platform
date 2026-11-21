'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import * as questionsModule from '@/data/questions'

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
  config?: Record<string, unknown> | null
}

interface RawQuestion {
  id?: string | number
  question?: string
  prompt?: string
  title?: string
  text?: string
  intitule?: string
  label?: string
  options?: unknown[]
  choices?: unknown[]
  answers?: unknown[]
  propositions?: unknown[]
  reponses?: unknown[]
  items?: unknown[]
  a?: string
  b?: string
  c?: string
  d?: string
  A?: string
  B?: string
  C?: string
  D?: string
  optionA?: string
  optionB?: string
  optionC?: string
  optionD?: string
  option1?: string
  option2?: string
  option3?: string
  option4?: string
  choice1?: string
  choice2?: string
  choice3?: string
  choice4?: string
  reponse1?: string
  reponse2?: string
  reponse3?: string
  reponse4?: string
  reponseA?: string
  reponseB?: string
  reponseC?: string
  reponseD?: string
  correctIndex?: number | string
  correct_index?: number | string
  answerIndex?: number | string
  answer_index?: number | string
  correctOption?: number | string
  correct?: number | string | boolean
  answer?: number | string
  reponse?: number | string
  bonneReponse?: number | string
  bonne_reponse?: number | string
  correctAnswer?: number | string
  correct_answer?: number | string
  solution?: number | string
  category?: string
  categorie?: string
  theme?: string
}

interface NormalizedQuestion {
  id: string | number
  question: string
  options: [string, string, string, string]
  correctIndex: number
  category?: string
}

interface AnswerTileStyle {
  letter: 'A' | 'B' | 'C' | 'D'
  bg: string
  border: string
  badgeBg: string
  badgeText: string
  text: string
}

const QUESTION_DURATION_SECONDS = 15

const ANSWER_TILE_STYLES: [AnswerTileStyle, AnswerTileStyle, AnswerTileStyle, AnswerTileStyle] = [
  {
    letter: 'A',
    bg: '#dc2626',
    border: '#fca5a5',
    badgeBg: 'rgba(15, 23, 42, 0.28)',
    badgeText: '#ffffff',
    text: '#ffffff',
  },
  {
    letter: 'B',
    bg: '#eab308',
    border: '#fef08a',
    badgeBg: 'rgba(15, 23, 42, 0.16)',
    badgeText: '#0f172a',
    text: '#0f172a',
  },
  {
    letter: 'C',
    bg: '#2563eb',
    border: '#93c5fd',
    badgeBg: 'rgba(15, 23, 42, 0.28)',
    badgeText: '#ffffff',
    text: '#ffffff',
  },
  {
    letter: 'D',
    bg: '#16a34a',
    border: '#86efac',
    badgeBg: 'rgba(15, 23, 42, 0.28)',
    badgeText: '#ffffff',
    text: '#ffffff',
  },
]

const RANDOM_PLAYER_COLORS = [
  '#2563eb', // Bleu roi
  '#059669', // Vert émeraude
  '#d97706', // Ambre vif
  '#7c3aed', // Violet intense
  '#e11d48', // Rouge framboise
  '#0891b2', // Cyan soutenu
  '#c026d3', // Magenta
  '#ea580c', // Orange brûlé
  '#4f46e5', // Indigo
  '#16a34a', // Vert pomme
  '#db2777', // Rose vif
  '#0d9488', // Turquoise foncé
]

function resolvePlayerColor(player: Player, index: number): string {
  if (player.avatar && player.avatar.startsWith('#')) {
    return player.avatar
  }
  const seed = String(player.client_id ?? player.id ?? player.pseudo ?? index)
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return RANDOM_PLAYER_COLORS[(hash + index) % RANDOM_PLAYER_COLORS.length]
}

function extractOptionEntry(entry: unknown): { text: string; isCorrect: boolean } {
  if (typeof entry === 'string' || typeof entry === 'number') {
    return { text: String(entry).trim(), isCorrect: false }
  }
  if (entry && typeof entry === 'object') {
    const obj = entry as Record<string, unknown>
    const val =
      obj.text ??
      obj.label ??
      obj.value ??
      obj.title ??
      obj.reponse ??
      obj.answer ??
      obj.option ??
      obj.intitule ??
      obj.name
    const isCorrect = Boolean(
      obj.isCorrect ?? obj.is_correct ?? obj.correct ?? obj.valid ?? obj.isRight
    )
    return {
      text: val !== undefined && val !== null ? String(val).trim() : '',
      isCorrect,
    }
  }
  return { text: '', isCorrect: false }
}

function extractOptionsAndCorrect(item: RawQuestion): {
  options: [string, string, string, string]
  correctIndex: number
} {
  let texts: string[] = []
  let flaggedCorrectIndex = -1

  const arraySource =
    item?.options ??
    item?.choices ??
    item?.answers ??
    item?.propositions ??
    item?.reponses ??
    item?.items

  if (Array.isArray(arraySource) && arraySource.length > 0) {
    const parsed = arraySource
      .map(extractOptionEntry)
      .filter((entry) => entry.text.length > 0)
      .slice(0, 4)

    texts = parsed.map((p) => p.text)
    flaggedCorrectIndex = parsed.findIndex((p) => p.isCorrect)
  } else {
    const discreteCandidates = [
      [item?.a, item?.b, item?.c, item?.d],
      [item?.A, item?.B, item?.C, item?.D],
      [item?.optionA, item?.optionB, item?.optionC, item?.optionD],
      [item?.option1, item?.option2, item?.option3, item?.option4],
      [item?.choice1, item?.choice2, item?.choice3, item?.choice4],
      [item?.reponse1, item?.reponse2, item?.reponse3, item?.reponse4],
      [item?.reponseA, item?.reponseB, item?.reponseC, item?.reponseD],
    ]

    for (const group of discreteCandidates) {
      const cleaned = group
        .filter((v): v is string | number => v !== undefined && v !== null && String(v).trim().length > 0)
        .map((v) => String(v).trim())
      if (cleaned.length > 0) {
        texts = cleaned.slice(0, 4)
        break
      }
    }
  }

  const fourOptions: [string, string, string, string] = [
    texts[0] ?? '',
    texts[1] ?? '',
    texts[2] ?? '',
    texts[3] ?? '',
  ]

  if (flaggedCorrectIndex >= 0 && flaggedCorrectIndex < 4) {
    return { options: fourOptions, correctIndex: flaggedCorrectIndex }
  }

  const rawAnswer =
    item?.correctIndex ??
    item?.correct_index ??
    item?.answerIndex ??
    item?.answer_index ??
    item?.correctOption ??
    item?.correctAnswer ??
    item?.correct_answer ??
    item?.bonneReponse ??
    item?.bonne_reponse ??
    item?.answer ??
    item?.reponse ??
    item?.solution ??
    (typeof item?.correct !== 'boolean' ? item?.correct : undefined)

  let resolvedIndex = 0

  if (typeof rawAnswer === 'number' && Number.isFinite(rawAnswer)) {
    if (rawAnswer >= 0 && rawAnswer <= 3) {
      resolvedIndex = rawAnswer
    } else if (rawAnswer >= 1 && rawAnswer <= 4) {
      resolvedIndex = rawAnswer - 1
    }
  } else if (typeof rawAnswer === 'string') {
    const trimmed = rawAnswer.trim()
    const upper = trimmed.toUpperCase()
    if (upper === 'A' || upper === '0') resolvedIndex = 0
    else if (upper === 'B' || upper === '1') resolvedIndex = 1
    else if (upper === 'C' || upper === '2') resolvedIndex = 2
    else if (upper === 'D' || upper === '3') resolvedIndex = 3
    else {
      const exactMatch = fourOptions.findIndex(
        (opt) => opt.toLowerCase() === trimmed.toLowerCase()
      )
      if (exactMatch >= 0) {
        resolvedIndex = exactMatch
      }
    }
  }

  return { options: fourOptions, correctIndex: resolvedIndex }
}

function extractQuestionPool(): NormalizedQuestion[] {
  const mod = questionsModule as Record<string, unknown>
  const candidates: unknown[] = [
    mod.default,
    mod.QUESTIONS,
    mod.questions,
    mod.QUIZ_QUESTIONS,
    mod.quizQuestions,
    ...Object.values(mod),
  ]

  const rawList = candidates.find(
    (item): item is RawQuestion[] => Array.isArray(item) && item.length > 0
  )

  if (!rawList) return []

  return rawList
    .map((item, idx) => {
      const text =
        item?.question ??
        item?.prompt ??
        item?.intitule ??
        item?.title ??
        item?.text ??
        item?.label ??
        ''
      const { options, correctIndex } = extractOptionsAndCorrect(item)
      const cat = item?.category ?? item?.categorie ?? item?.theme

      return {
        id: item?.id ?? idx,
        question: String(text).trim(),
        options,
        correctIndex,
        category: cat ? String(cat) : undefined,
      }
    })
    .filter((q) => q.question.length > 0)
}

function shuffleQuestions(list: NormalizedQuestion[]): NormalizedQuestion[] {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

function QuizGameIcon({ selected }: { selected: boolean }) {
  return (
    <div
      className={`w-16 h-16 md:w-20 md:h-20 rounded-[22px] flex items-center justify-center transition-all duration-300 ${
        selected
          ? 'bg-gradient-to-br from-sky-400 to-blue-600 shadow-[0_12px_30px_-6px_rgba(56,189,248,0.65)] ring-2 ring-white/80'
          : 'bg-gradient-to-br from-sky-500/30 to-blue-700/30 border border-white/20'
      }`}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        className="w-9 h-9 md:w-11 md:h-11 text-white"
        aria-hidden="true"
      >
        <path
          d="M24 6C14.059 6 6 13.387 6 22.5c0 4.623 2.075 8.803 5.424 11.797-.36 3.105-1.693 5.792-1.742 5.888a1.25 1.25 0 0 0 1.448 1.766c3.828-1.01 7.032-2.797 8.88-3.981 1.29.277 2.624.43 3.99.43 9.941 0 18-7.387 18-16.4S33.941 6 24 6Z"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <path
          d="M19.8 18.2a4.3 4.3 0 0 1 8.35 1.45c0 2.75-4.15 3.65-4.15 6.1"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <circle cx="24" cy="30.8" r="1.75" fill="currentColor" />
      </svg>
    </div>
  )
}

function PetitBacGameIcon({ selected }: { selected: boolean }) {
  return (
    <div
      className={`w-16 h-16 md:w-20 md:h-20 rounded-[22px] flex items-center justify-center transition-all duration-300 ${
        selected
          ? 'bg-gradient-to-br from-indigo-400 to-cyan-500 shadow-[0_12px_30px_-6px_rgba(99,102,241,0.65)] ring-2 ring-white/80'
          : 'bg-gradient-to-br from-indigo-500/30 to-cyan-600/30 border border-white/20'
      }`}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        className="w-9 h-9 md:w-11 md:h-11 text-white"
        aria-hidden="true"
      >
        <rect
          x="7"
          y="7"
          width="15"
          height="15"
          rx="4"
          stroke="currentColor"
          strokeWidth="2.6"
        />
        <path
          d="M11.8 18L14.5 11L17.2 18M12.5 16.2H16.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="26"
          y="7"
          width="15"
          height="15"
          rx="4"
          stroke="currentColor"
          strokeWidth="2.6"
        />
        <path
          d="M31 11.2H34.2a2.1 2.1 0 0 1 0 4.2H31V11.2ZM31 15.4H34.6a2.2 2.2 0 0 1 0 4.4H31V15.4Z"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinejoin="round"
        />
        <rect
          x="7"
          y="26"
          width="15"
          height="15"
          rx="4"
          stroke="currentColor"
          strokeWidth="2.6"
        />
        <path
          d="M17.3 31.3a3.6 3.6 0 1 0 0 4.4"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <rect
          x="26"
          y="26"
          width="15"
          height="15"
          rx="4"
          stroke="currentColor"
          strokeWidth="2.6"
        />
        <path
          d="M30 33.5L32.4 36L37.5 30.8"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

export default function TvPage() {
  const router = useRouter()
  const [room, setRoom] = useState<Room | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [selectedMode, setSelectedMode] = useState<'quiz' | 'petit_bac'>('quiz')
  const [currentLetter, setCurrentLetter] = useState<string | null>(null)

  const questionPool = useMemo(() => extractQuestionPool(), [])
  const [quizDeck, setQuizDeck] = useState<NormalizedQuestion[]>([])
  const [quizStarted, setQuizStarted] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState<number>(QUESTION_DURATION_SECONDS)

  const createRoom = useCallback(async () => {
    setLoading(true)
    setErrorMsg(null)
    const room_code = generateRoomCode()

    const { data, error } = await supabase
      .from('rooms')
      .insert([{ room_code, status: 'waiting', game_type: 'quiz' }])
      .select()
      .single()

    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
      return
    }

    setRoom(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    createRoom()
  }, [createRoom])

  useEffect(() => {
    if (!room?.room_code) return

    const cleanRoomCode = String(room.room_code).trim().toUpperCase()

    const fetchPlayers = async () => {
      const { data } = await supabase
        .from('players')
        .select('*')
        .ilike('room_code', cleanRoomCode)
        .order('score', { ascending: false })
      if (data) {
        const activePlayers = data.filter((p) => p.is_connected !== false)
        setPlayers(activePlayers)
      }
    }

    fetchPlayers()

    const channel = supabase
      .channel(`room-sync-${cleanRoomCode}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
          filter: `room_code=eq.${cleanRoomCode}`,
        },
        () => {
          fetchPlayers()
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${room.id}` },
        (payload) => {
          setRoom(payload.new as Room)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [room?.id, room?.room_code])

  const activeGameType = room?.game_type || selectedMode
  const activeQuestion = quizDeck[questionIndex] ?? null
  const isLastQuestion = quizDeck.length > 0 && questionIndex >= quizDeck.length - 1
  const isTimeUp = quizStarted && timeLeft === 0

  useEffect(() => {
    if (room?.status !== 'playing' || activeGameType !== 'quiz' || !quizStarted || !activeQuestion) {
      return
    }
    if (timeLeft <= 0) return

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1))
    }, 1000)

    return () => {
      window.clearInterval(timer)
    }
  }, [room?.status, activeGameType, quizStarted, activeQuestion, timeLeft])

  const handleStartGame = async () => {
    if (!room?.id) return

    if (selectedMode === 'petit_bac') {
      const letters = 'ABCDEFGHIJKLMNOPRST'
      setCurrentLetter(letters[Math.floor(Math.random() * letters.length)])
      setQuizStarted(false)
      setQuestionIndex(0)
      setTimeLeft(QUESTION_DURATION_SECONDS)
    } else {
      setCurrentLetter(null)
      setQuizStarted(false)
      setQuestionIndex(0)
      setTimeLeft(QUESTION_DURATION_SECONDS)
      setQuizDeck(shuffleQuestions(questionPool))
    }

    const { data, error } = await supabase
      .from('rooms')
      .update({ status: 'playing', game_type: selectedMode })
      .eq('id', room.id)
      .select()
      .single()

    if (!error && data) {
      setRoom(data)
    }
  }

  const handleStartQuizQuestions = () => {
    const deck = shuffleQuestions(questionPool)
    setQuizDeck(deck)
    setQuestionIndex(0)
    setTimeLeft(QUESTION_DURATION_SECONDS)
    setQuizStarted(true)
  }

  const handleNextQuestion = () => {
    if (timeLeft > 0) return

    if (questionIndex + 1 < quizDeck.length) {
      setQuestionIndex((prev) => prev + 1)
    } else {
      setQuizDeck(shuffleQuestions(questionPool))
      setQuestionIndex(0)
    }
    setTimeLeft(QUESTION_DURATION_SECONDS)
  }

  const handleResetRoom = async () => {
    if (!room?.id) return
    setCurrentLetter(null)
    setQuizStarted(false)
    setQuestionIndex(0)
    setTimeLeft(QUESTION_DURATION_SECONDS)

    const { data, error } = await supabase
      .from('rooms')
      .update({ status: 'waiting' })
      .eq('id', room.id)
      .select()
      .single()

    if (!error && data) {
      setRoom(data)
    }
  }

  const joinUrl =
    typeof window !== 'undefined' && room?.room_code
      ? `${window.location.origin}/player?code=${encodeURIComponent(room.room_code)}`
      : ''

  const qrCodeSrc = joinUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(joinUrl)}`
    : ''

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#0e172a] text-white select-none font-sans antialiased flex flex-col justify-between px-6 py-5 md:px-10 md:py-7">
      <style>{`
        html, body {
          overflow: hidden;
          overscroll-behavior: none;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
        }
        .tvos-tile {
          transition:
            transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 260ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 220ms ease,
            background 220ms ease;
        }
        .tvos-tile:hover,
        .tvos-tile:focus-visible {
          transform: scale(1.035) translateY(-3px);
          box-shadow:
            0 22px 45px -10px rgba(2, 6, 23, 0.7),
            0 0 0 2px rgba(255, 255, 255, 0.8);
          outline: none;
        }
        .tvos-btn {
          transition:
            transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 220ms cubic-bezier(0.22, 1, 0.36, 1),
            background 200ms ease;
        }
        .tvos-btn:hover:not(:disabled),
        .tvos-btn:focus-visible:not(:disabled) {
          transform: scale(1.025);
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.75);
          outline: none;
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

      <header className="relative z-10 flex items-center justify-between max-w-7xl w-full mx-auto gap-4 shrink-0">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">
          tvOS • Mode Hôte
        </span>

        <button
          type="button"
          onClick={() => router.push('/')}
          className="tvos-btn inline-flex items-center px-3.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.16em] bg-white/[0.11] border border-white/25 text-sky-100 backdrop-blur-xl cursor-pointer"
        >
          Accueil
        </button>
      </header>

      <section className="relative z-10 max-w-7xl w-full mx-auto flex-1 min-h-0 my-4 flex items-stretch">
        {loading ? (
          <div className="w-full flex flex-col items-center justify-center text-center space-y-3">
            <p className="text-2xl font-semibold tracking-tight text-white">
              Création du salon...
            </p>
            <p className="text-sm text-slate-300">
              Connexion en temps réel au serveur
            </p>
          </div>
        ) : errorMsg ? (
          <div className="max-w-xl m-auto p-8 rounded-[28px] bg-white/[0.12] border border-white/25 backdrop-blur-2xl text-center space-y-5">
            <h1 className="text-2xl font-semibold text-white">Erreur de salon</h1>
            <p className="text-sm text-slate-200">{errorMsg}</p>
            <button
              type="button"
              onClick={createRoom}
              className="tvos-btn px-6 py-3 rounded-2xl bg-sky-500 text-white font-semibold text-sm cursor-pointer"
            >
              Réessayer
            </button>
          </div>
        ) : room?.status === 'playing' ? (
          <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-8 h-full p-7 md:p-9 rounded-[28px] bg-gradient-to-b from-white/[0.18] via-white/[0.09] to-slate-900/65 backdrop-blur-2xl border border-white/25 flex flex-col justify-between min-h-0 pointer-events-none">
              <div className="flex items-center justify-between gap-3 shrink-0">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
                  {activeGameType === 'petit_bac'
                    ? 'Petit Bac'
                    : quizStarted && quizDeck.length > 0
                    ? `Quiz • Question ${questionIndex + 1} / ${quizDeck.length}`
                    : 'Quiz'}
                </span>

                <div className="flex items-center gap-2.5">
                  {activeGameType === 'quiz' && quizStarted && activeQuestion && (
                    <span
                      className={`px-3.5 py-1 rounded-full text-sm font-extrabold tracking-wider border transition-colors ${
                        timeLeft === 0
                          ? 'bg-emerald-500/25 border-emerald-300 text-emerald-200'
                          : timeLeft <= 5
                          ? 'bg-rose-500/30 border-rose-300 text-rose-100'
                          : 'bg-sky-500/25 border-sky-300/60 text-white'
                      }`}
                    >
                      {timeLeft > 0 ? `${timeLeft}s` : 'Temps écoulé'}
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/15 border border-white/20 text-slate-100">
                    {activeQuestion?.category || 'En cours'}
                  </span>
                </div>
              </div>

              <div className="flex-1 min-h-0 py-4 flex flex-col overflow-hidden">
                {activeGameType === 'petit_bac' ? (
                  <div className="my-auto space-y-4">
                    <p className="text-sm uppercase tracking-[0.18em] text-sky-200 font-semibold">
                      Lettre tirée
                    </p>
                    <p className="text-7xl md:text-8xl font-semibold tracking-tight text-white">
                      {currentLetter || 'A'}
                    </p>
                  </div>
                ) : !quizStarted ? (
                  <div className="my-auto space-y-2 max-w-2xl">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                      Prêt pour le Quiz ?
                    </h1>
                  </div>
                ) : !activeQuestion ? (
                  <div className="my-auto space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                      Aucune question disponible
                    </h1>
                  </div>
                ) : (
                  <div className="flex-1 min-h-0 flex flex-col justify-between gap-4">
                    <div className="flex-1 min-h-0 flex items-start pt-1">
                      <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white leading-snug line-clamp-4">
                        {activeQuestion.question}
                      </h1>
                    </div>

                    <div className="mt-auto shrink-0 grid grid-cols-1 sm:grid-cols-2 grid-rows-2 gap-4 h-52 md:h-60">
                      {activeQuestion.options.map((opt, i) => {
                        const style = ANSWER_TILE_STYLES[i] ?? ANSWER_TILE_STYLES[0]
                        const isCorrect = i === activeQuestion.correctIndex
                        const isDimmed = isTimeUp && !isCorrect
                        const isHighlighted = isTimeUp && isCorrect

                        return (
                          <div
                            key={`${activeQuestion.id}-${i}`}
                            style={{
                              backgroundColor: style.bg,
                              borderColor: isHighlighted ? '#ffffff' : style.border,
                              color: style.text,
                            }}
                            className={`h-full px-5 py-4 rounded-[24px] flex items-center gap-4 transition-all duration-300 ${
                              isHighlighted
                                ? 'border-4 ring-4 ring-white/85 shadow-[0_0_40px_rgba(255,255,255,0.65)] scale-[1.015]'
                                : 'border-2 shadow-lg'
                            } ${isDimmed ? 'opacity-30 grayscale-[35%]' : 'opacity-100'}`}
                          >
                            <span
                              style={{
                                backgroundColor: style.badgeBg,
                                color: style.badgeText,
                              }}
                              className="w-12 h-12 md:w-14 md:h-14 rounded-2xl text-xl md:text-2xl font-extrabold flex items-center justify-center shrink-0"
                            >
                              {style.letter}
                            </span>
                            <span className="text-xl md:text-2xl font-extrabold leading-tight line-clamp-2">
                              {opt}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/15 shrink-0 pointer-events-auto">
                <button
                  type="button"
                  onClick={handleResetRoom}
                  className="tvos-btn px-5 py-3 rounded-2xl bg-white/15 border border-white/25 text-white text-sm font-semibold cursor-pointer"
                >
                  Retour au salon
                </button>

                {activeGameType === 'quiz' && (
                  <div className="flex items-center gap-3">
                    {!quizStarted ? (
                      <button
                        type="button"
                        onClick={handleStartQuizQuestions}
                        disabled={questionPool.length === 0}
                        className="tvos-btn px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white text-sm font-semibold shadow-[0_14px_30px_-8px_rgba(14,165,233,0.65)] cursor-pointer"
                      >
                        Démarrer
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleNextQuestion}
                        disabled={timeLeft > 0}
                        className="tvos-btn px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 disabled:bg-white/10 disabled:text-slate-400 disabled:border disabled:border-white/15 disabled:shadow-none disabled:cursor-not-allowed text-white text-sm font-semibold shadow-[0_14px_30px_-8px_rgba(14,165,233,0.65)] cursor-pointer"
                      >
                        {isLastQuestion ? 'Recommencer' : 'Suivante'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-4 h-full p-7 md:p-8 rounded-[28px] bg-gradient-to-b from-white/[0.16] via-white/[0.08] to-slate-900/65 backdrop-blur-2xl border border-white/25 flex flex-col justify-between space-y-5 min-h-0 pointer-events-none">
              <div className="space-y-4 flex-1 min-h-0 flex flex-col">
                <div className="flex items-center justify-between shrink-0">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">
                    Classement
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/15 border border-white/20 text-slate-100">
                    {players.length} joueur{players.length > 1 ? 's' : ''}
                  </span>
                </div>

                {players.length === 0 ? (
                  <p className="text-sm text-slate-300">Aucun joueur connecté.</p>
                ) : (
                  <ul className="space-y-2.5 overflow-y-auto pr-1">
                    {players.map((p, idx) => {
                      const colorHex = resolvePlayerColor(p, idx)
                      return (
                        <li
                          key={p.id}
                          style={{ backgroundColor: colorHex }}
                          className="flex items-center justify-between px-4 py-3 rounded-2xl border-2 border-white/40 text-white shadow-md"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="font-bold text-white/90">{idx + 1}.</span>
                            <span className="font-bold text-white truncate">{p.pseudo}</span>
                          </div>
                          <span className="font-bold text-white">{p.score} pts</span>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 items-stretch">
            {/* COLONNE GAUCHE : QR CODE SUR TOUTE LA HAUTEUR */}
            <div className="lg:col-span-4 h-full p-6 md:p-8 rounded-[30px] bg-gradient-to-b from-white/[0.18] via-white/[0.09] to-slate-900/65 backdrop-blur-2xl border border-white/25 flex flex-col items-center justify-between text-center">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
                  Rejoindre la partie
                </span>
                <p className="text-xs text-slate-300">
                  Scanne avec ton smartphone
                </p>
              </div>

              {qrCodeSrc && (
                <div className="p-4 md:p-5 rounded-[26px] bg-white shadow-[0_24px_55px_-12px_rgba(2,6,23,0.75)] my-auto">
                  <img
                    src={qrCodeSrc}
                    alt={`QR Code salon ${room?.room_code}`}
                    className="w-44 h-44 sm:w-52 sm:h-52 xl:w-60 xl:h-60 object-contain"
                  />
                </div>
              )}

              <div className="w-full pt-3 border-t border-white/15 space-y-1.5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300">
                  Ou entre le code sur <span className="text-white font-semibold">/player</span>
                </p>
                <p className="text-3xl md:text-4xl font-semibold tracking-[0.22em] text-white">
                  {room?.room_code}
                </p>
              </div>
            </div>

            {/* COLONNE CENTRALE : ICÔNES DES JEUX + LANCEMENT */}
            <div className="lg:col-span-4 h-full p-6 md:p-8 rounded-[30px] bg-gradient-to-b from-white/[0.16] via-white/[0.08] to-slate-900/65 backdrop-blur-2xl border border-white/25 flex flex-col justify-between">
              <div className="text-center space-y-1">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">
                  Choisir un jeu
                </span>
                <p className="text-xs text-slate-300">
                  Sélectionne le mode de la manche
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 my-auto py-4">
                <button
                  type="button"
                  onClick={() => setSelectedMode('quiz')}
                  className={`tvos-tile p-5 rounded-[26px] flex flex-col items-center justify-center text-center gap-3.5 border cursor-pointer ${
                    selectedMode === 'quiz'
                      ? 'bg-white/[0.22] border-sky-300 shadow-[0_18px_40px_-10px_rgba(14,165,233,0.45)]'
                      : 'bg-white/[0.07] border-white/15 text-slate-200'
                  }`}
                >
                  <QuizGameIcon selected={selectedMode === 'quiz'} />
                  <div className="space-y-1">
                    <p className="font-semibold text-lg tracking-tight text-white">
                      Quiz
                    </p>
                    <p className="text-[11px] leading-snug text-slate-200">
                      Culture &amp; musique
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMode('petit_bac')}
                  className={`tvos-tile p-5 rounded-[26px] flex flex-col items-center justify-center text-center gap-3.5 border cursor-pointer ${
                    selectedMode === 'petit_bac'
                      ? 'bg-white/[0.22] border-sky-300 shadow-[0_18px_40px_-10px_rgba(14,165,233,0.45)]'
                      : 'bg-white/[0.07] border-white/15 text-slate-200'
                  }`}
                >
                  <PetitBacGameIcon selected={selectedMode === 'petit_bac'} />
                  <div className="space-y-1">
                    <p className="font-semibold text-lg tracking-tight text-white">
                      Petit Bac
                    </p>
                    <p className="text-[11px] leading-snug text-slate-200">
                      Mots &amp; catégories
                    </p>
                  </div>
                </button>
              </div>

              <button
                type="button"
                onClick={handleStartGame}
                className="tvos-btn w-full py-4 px-6 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-base tracking-tight shadow-[0_14px_30px_-8px_rgba(14,165,233,0.6)] cursor-pointer"
              >
                Lancer {selectedMode === 'petit_bac' ? 'le Petit Bac' : 'le Quiz'}
              </button>
            </div>

            {/* COLONNE DROITE : TABLEAU DES JOUEURS */}
            <div className="lg:col-span-4 h-full p-6 md:p-8 rounded-[30px] bg-gradient-to-b from-white/[0.16] via-white/[0.08] to-slate-900/65 backdrop-blur-2xl border border-white/25 flex flex-col justify-between min-h-0 pointer-events-none">
              <div className="flex items-center justify-between pb-4 border-b border-white/15 shrink-0">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">
                  Joueurs connectés
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/15 border border-white/20 text-white">
                  {players.length}
                </span>
              </div>

              <div className="flex-1 min-h-0 my-4 overflow-y-auto pr-1">
                {players.length === 0 ? (
                  <div className="h-full rounded-2xl bg-white/[0.05] border border-dashed border-white/20 flex flex-col items-center justify-center p-6 text-center space-y-2">
                    <p className="text-base font-medium text-slate-200">
                      En attente des joueurs...
                    </p>
                    <p className="text-xs text-slate-400">
                      Les participants apparaîtront ici dès leur connexion.
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-2.5">
                    {players.map((p, idx) => {
                      const colorHex = resolvePlayerColor(p, idx)
                      return (
                        <li
                          key={p.id}
                          style={{ backgroundColor: colorHex }}
                          className="flex items-center justify-between px-4 py-3.5 rounded-2xl border-2 border-white/45 text-white shadow-md"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                              #{idx + 1}
                            </span>
                            <span className="font-bold text-base text-white truncate">
                              {p.pseudo}
                            </span>
                          </div>
                          <span className="text-xs font-bold uppercase tracking-wider text-white bg-black/20 px-2.5 py-1 rounded-full">
                            Prêt
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>

              <div className="pt-3 border-t border-white/15 text-center shrink-0">
                <p className="text-xs text-slate-300">
                  {players.length === 0
                    ? 'Aucun participant dans le salon'
                    : `${players.length} participant${players.length > 1 ? 's' : ''} prêt${players.length > 1 ? 's' : ''} à jouer`}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      <footer className="relative z-10 max-w-7xl w-full mx-auto text-center shrink-0">
        <p className="text-xs tracking-wide text-slate-400">
          Mode Hôte • Synchronisation temps réel
        </p>
      </footer>
    </main>
  )
}
