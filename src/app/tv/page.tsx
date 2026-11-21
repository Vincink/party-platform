'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
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
  config?: Record<string, unknown> | null
}

const RANDOM_BADGE_COLORS = [
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
  return RANDOM_BADGE_COLORS[(hash + index) % RANDOM_BADGE_COLORS.length]
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

  const handleStartGame = async () => {
    if (!room?.id) return

    if (selectedMode === 'petit_bac') {
      const letters = 'ABCDEFGHIJKLMNOPRST'
      setCurrentLetter(letters[Math.floor(Math.random() * letters.length)])
      setCurrentQuestion(null)
    } else {
      setCurrentQuestion('Question 1 : Prêt pour commencer ?')
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
      ? `${window.location.origin}/player?code=${encodeURIComponent(room.room_code)}`
      : ''

  const qrCodeSrc = joinUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(joinUrl)}`
    : ''

  const activeGameType = room?.game_type || selectedMode

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#0e172a] text-white select-none font-sans antialiased flex flex-col justify-between px-6 py-5 md:px-10 md:py-7">
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
          transform: scale(1.015) translateY(-2px);
          box-shadow:
            0 28px 65px -12px rgba(2, 6, 23, 0.75),
            0 0 0 2px rgba(255, 255, 255, 0.65);
          outline: none;
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
        .tvos-btn:hover,
        .tvos-btn:focus-visible {
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
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
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
                      Lettre tirée
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
                  <p className="text-sm text-slate-300">Aucun joueur connecté.</p>
                ) : (
                  <ul className="space-y-2.5">
                    {players.map((p, idx) => {
                      const colorHex = resolvePlayerColor(p, idx)
                      return (
                        <li
                          key={p.id}
                          className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/[0.08] border border-white/15"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              style={{ backgroundColor: colorHex }}
                              className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white border border-white/40 shrink-0 shadow-sm"
                            >
                              {idx + 1}
                            </span>
                            <span className="font-medium text-white truncate">{p.pseudo}</span>
                          </div>
                          <span className="font-semibold text-sky-300">{p.score} pts</span>
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
            <div className="lg:col-span-4 h-full p-6 md:p-8 rounded-[30px] bg-gradient-to-b from-white/[0.16] via-white/[0.08] to-slate-900/65 backdrop-blur-2xl border border-white/25 flex flex-col justify-between min-h-0">
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
                  <div className="rounded-2xl overflow-hidden border border-white/15 bg-white/[0.05]">
                    <div className="grid grid-cols-12 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-300 bg-white/[0.06] border-b border-white/10">
                      <span className="col-span-2">#</span>
                      <span className="col-span-6">Joueur</span>
                      <span className="col-span-4 text-right">Statut</span>
                    </div>
                    <ul className="divide-y divide-white/10">
                      {players.map((p, idx) => {
                        const colorHex = resolvePlayerColor(p, idx)
                        return (
                          <li
                            key={p.id}
                            className="grid grid-cols-12 items-center px-4 py-3 text-sm"
                          >
                            <span className="col-span-2">
                              <span
                                style={{ backgroundColor: colorHex }}
                                className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white border border-white/40 shadow-sm"
                              >
                                {idx + 1}
                              </span>
                            </span>
                            <span className="col-span-6 font-semibold text-white truncate pr-2">
                              {p.pseudo}
                            </span>
                            <span className="col-span-4 text-right">
                              <span
                                style={{ backgroundColor: colorHex }}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/40 shadow-sm"
                              >
                                Prêt
                              </span>
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
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
