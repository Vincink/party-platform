'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface Player {
  id: string
  name: string
  score: number
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

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export default function TvPage() {
  const router = useRouter()
  const [room, setRoom] = useState<Room | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [selectedMode, setSelectedMode] = useState<'quiz' | 'petit_bac'>('quiz')
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null)
  const [currentLetter, setCurrentLetter] = useState<string | null>(null)

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
    if (!room?.id) return

    const fetchPlayers = async () => {
      const { data } = await supabase
        .from('players')
        .select('*')
        .eq('room_id', room.id)
        .order('score', { ascending: false })
      if (data) setPlayers(data)
    }

    fetchPlayers()

    const channel = supabase
      .channel(`room-${room.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'players', filter: `room_id=eq.${room.id}` },
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
  }, [room?.id])

  const handleStartGame = async () => {
    if (!room?.id) return

    if (selectedMode === 'petit_bac') {
      const letters = 'ABCDEFGHIJKLMNOPRST'
      setCurrentLetter(letters[Math.floor(Math.random() * letters.length)])
      setCurrentQuestion(null)
    } else {
      setCurrentQuestion('Question 1 : Pret pour commencer ?')
      setCurrentLetter(null)
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

  const handleResetRoom = async () => {
    if (!room?.id) return
    setCurrentQuestion(null)
    setCurrentLetter(null)

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
      ? `${window.location.origin}/player?code=${room.room_code}`
      : ''

  const qrCodeSrc = joinUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(joinUrl)}`
    : ''

  const activeGameType = room?.game_type || selectedMode

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#0e172a] text-white select-none font-sans antialiased flex flex-col justify-between px-6 py-7 md:px-14 md:py-10">
      <style>{`
        html, body {
          overflow: hidden;
          overscroll-behavior: none;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
        }
        .tvos-card {
          transition:
            transform 320ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 320ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 240ms ease,
            background 240ms ease;
        }
        .tvos-card:hover,
        .tvos-card:focus-visible {
          transform: scale(1.03) translateY(-3px);
          box-shadow:
            0 28px 65px -12px rgba(2, 6, 23, 0.75),
            0 0 0 2px rgba(255, 255, 255, 0.7);
          outline: none;
        }
        .tvos-btn {
          transition:
            transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 220ms cubic-bezier(0.22, 1, 0.36, 1),
            background 200ms ease;
        }
        .tvos-btn:hover,
        .tvos-btn:focus-visible {
          transform: scale(1.03);
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

      <header className="relative z-10 flex items-center justify-between max-w-6xl w-full mx-auto gap-4">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">
          tvOS • Mode Hôte
        </span>

        <div className="flex items-center gap-3">
          {room?.room_code && (
            <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-[0.18em] bg-white/[0.14] border border-white/25 text-white backdrop-blur-xl">
              Code : {room.room_code}
            </span>
          )}
          <button
            type="button"
            onClick={() => router.push('/')}
            className="tvos-btn inline-flex items-center px-3.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.16em] bg-white/[0.11] border border-white/25 text-sky-100 backdrop-blur-xl cursor-pointer"
          >
            Accueil
          </button>
        </div>
      </header>

      <section className="relative z-10 max-w-6xl w-full mx-auto my-auto">
        {loading ? (
          <div className="text-center py-16 space-y-3">
            <p className="text-2xl font-semibold tracking-tight text-white">
              Creation du salon...
            </p>
            <p className="text-sm text-slate-300">
              Connexion en temps reel au serveur
            </p>
          </div>
        ) : errorMsg ? (
          <div className="max-w-xl mx-auto p-8 rounded-[28px] bg-white/[0.12] border border-white/25 backdrop-blur-2xl text-center space-y-5">
            <h1 className="text-2xl font-semibold text-white">Erreur de salon</h1>
            <p className="text-sm text-slate-200">{errorMsg}</p>
            <button
              type="button"
              onClick={createRoom}
              className="tvos-btn px-6 py-3 rounded-2xl bg-sky-500 text-white font-semibold text-sm cursor-pointer"
            >
              Reessayer
            </button>
          </div>
        ) : room?.status === 'playing' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
            <div className="tvos-card lg:col-span-2 p-7 md:p-10 rounded-[28px] bg-gradient-to-b from-white/[0.18] via-white/[0.09] to-slate-900/65 backdrop-blur-2xl border border-white/25 flex flex-col justify-between space-y-6">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
                  {activeGameType === 'petit_bac' ? 'Petit Bac' : 'Quiz'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/15 border border-white/20 text-slate-100">
                  En cours
                </span>
              </div>

              <div className="space-y-4 my-auto">
                {activeGameType === 'petit_bac' ? (
                  <>
                    <p className="text-sm uppercase tracking-[0.18em] text-sky-200 font-semibold">
                      Lettre tiree
                    </p>
                    <p className="text-7xl md:text-8xl font-semibold tracking-tight text-white">
                      {currentLetter || 'A'}
                    </p>
                  </>
                ) : (
                  <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-white leading-tight">
                    {currentQuestion || 'Partie en cours'}
                  </h1>
                )}
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleResetRoom}
                  className="tvos-btn px-5 py-3 rounded-2xl bg-white/15 border border-white/25 text-white text-sm font-semibold cursor-pointer"
                >
                  Retour au salon
                </button>
              </div>
            </div>

            <div className="tvos-card p-7 md:p-8 rounded-[28px] bg-gradient-to-b from-white/[0.16] via-white/[0.08] to-slate-900/65 backdrop-blur-2xl border border-white/25 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">
                    Classement
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/15 border border-white/20 text-slate-100">
                    {players.length} joueur{players.length > 1 ? 's' : ''}
                  </span>
                </div>

                {players.length === 0 ? (
                  <p className="text-sm text-slate-300">Aucun joueur connecte.</p>
                ) : (
                  <ul className="space-y-2.5">
                    {players.map((p) => (
                      <li
                        key={p.id}
                        className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/[0.08] border border-white/15"
                      >
                        <span className="font-medium text-white">{p.name}</span>
                        <span className="font-semibold text-sky-300">{p.score} pts</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
            <div className="tvos-card p-7 md:p-8 rounded-[28px] bg-gradient-to-b from-white/[0.18] via-white/[0.09] to-slate-900/65 backdrop-blur-2xl border border-white/25 flex flex-col items-center justify-between text-center space-y-4">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
                Connexion rapide
              </span>

              {qrCodeSrc && (
                <div className="p-3 rounded-2xl bg-white">
                  <img
                    src={qrCodeSrc}
                    alt={`QR Code salon ${room?.room_code}`}
                    className="w-40 h-40 md:w-44 md:h-44 object-contain"
                  />
                </div>
              )}

              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                  Code du salon
                </p>
                <p className="text-3xl md:text-4xl font-semibold tracking-[0.2em] text-white">
                  {room?.room_code}
                </p>
              </div>
            </div>

            <div className="tvos-card p-7 md:p-8 rounded-[28px] bg-gradient-to-b from-white/[0.16] via-white/[0.08] to-slate-900/65 backdrop-blur-2xl border border-white/25 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">
                    Joueurs
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/15 border border-white/20 text-slate-100">
                    {players.length} pret{players.length > 1 ? 's' : ''}
                  </span>
                </div>

                <p className="text-sm text-slate-200">
                  Scanne le QR code ou saisis le code sur <span className="font-semibold text-white">/player</span>.
                </p>

                {players.length === 0 ? (
                  <div className="py-6 px-4 rounded-2xl bg-white/[0.06] border border-white/15 text-center">
                    <p className="text-sm text-slate-300">
                      En attente des joueurs...
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {players.map((p) => (
                      <li
                        key={p.id}
                        className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/[0.08] border border-white/15"
                      >
                        <span className="font-medium text-white">{p.name}</span>
                        <span className="text-xs uppercase tracking-wider text-sky-300">
                          Pret
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="tvos-card p-7 md:p-8 rounded-[28px] bg-gradient-to-b from-white/[0.16] via-white/[0.08] to-slate-900/65 backdrop-blur-2xl border border-white/25 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">
                  Mode de jeu
                </span>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedMode('quiz')}
                    className={`tvos-btn p-4 rounded-2xl text-left border cursor-pointer ${
                      selectedMode === 'quiz'
                        ? 'bg-sky-500/35 border-sky-300 text-white'
                        : 'bg-white/[0.07] border-white/15 text-slate-200'
                    }`}
                  >
                    <p className="font-semibold text-base">Quiz</p>
                    <p className="text-xs text-slate-200 mt-0.5">
                      Questions rapides et classement en direct
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMode('petit_bac')}
                    className={`tvos-btn p-4 rounded-2xl text-left border cursor-pointer ${
                      selectedMode === 'petit_bac'
                        ? 'bg-sky-500/35 border-sky-300 text-white'
                        : 'bg-white/[0.07] border-white/15 text-slate-200'
                    }`}
                  >
                    <p className="font-semibold text-base">Petit Bac</p>
                    <p className="text-xs text-slate-200 mt-0.5">
                      Tirage de lettre et reponses par categorie
                    </p>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartGame}
                className="tvos-btn w-full py-4 px-6 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-base tracking-tight shadow-lg cursor-pointer"
              >
                Lancer la partie
              </button>
            </div>
          </div>
        )}
      </section>

      <footer className="relative z-10 max-w-6xl w-full mx-auto text-center">
        <p className="text-xs tracking-wide text-slate-400">
          Mode Hote • Synchronisation temps reel
        </p>
      </footer>
    </main>
  )
}
