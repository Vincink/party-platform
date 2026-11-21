'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface Room {
  id: string | number
  room_code: string
  status: string
  game_type: string | null
  current_game?: string | null
  current_round?: number | null
  config?: Record<string, unknown> | null
}

interface Player {
  id: string | number
  room_code: string
  pseudo: string
  score: number
  is_connected?: boolean | null
  client_id?: string | null
  avatar?: string | null
}

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

function pickRandomPlayerColor(): string {
  const idx = Math.floor(Math.random() * RANDOM_PLAYER_COLORS.length)
  return RANDOM_PLAYER_COLORS[idx]
}

function resolvePlayerColor(
  player: Pick<Player, 'avatar' | 'id' | 'pseudo' | 'client_id'>
): string {
  if (player.avatar && player.avatar.startsWith('#')) {
    return player.avatar
  }
  const seed = String(player.client_id ?? player.id ?? player.pseudo ?? '0')
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return RANDOM_PLAYER_COLORS[hash % RANDOM_PLAYER_COLORS.length]
}

function getOrCreateClientId(): string {
  if (typeof window === 'undefined') return ''
  const key = 'tvos_player_client_id'
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

function PlayerContent() {
  const searchParams = useSearchParams()

  const [roomCode, setRoomCode] = useState('')
  const [playerPseudo, setPlayerPseudo] = useState('')
  const [room, setRoom] = useState<Room | null>(null)
  const [player, setPlayer] = useState<Player | null>(null)
  const [joining, setJoining] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    const codeFromUrl = searchParams.get('code')
    if (codeFromUrl) {
      setRoomCode(codeFromUrl.toUpperCase().trim())
    }
  }, [searchParams])

  const syncRoomAndPlayer = useCallback(
    async (roomId: string | number, playerId: string | number) => {
      const { data: updatedRoom } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single()

      if (updatedRoom) {
        setRoom(updatedRoom)
      }

      const { data: updatedPlayer } = await supabase
        .from('players')
        .select('*')
        .eq('id', playerId)
        .single()

      if (updatedPlayer) {
        setPlayer(updatedPlayer)
      }
    },
    []
  )

  useEffect(() => {
    if (!room?.id || !player?.id) return

    syncRoomAndPlayer(room.id, player.id)

    const channel = supabase
      .channel(`player-session-${room.id}-${player.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${room.id}` },
        (payload) => {
          setRoom(payload.new as Room)
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'players', filter: `id=eq.${player.id}` },
        (payload) => {
          if (payload.new) {
            setPlayer(payload.new as Player)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [room?.id, player?.id, syncRoomAndPlayer])

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    const cleanCode = roomCode.trim().toUpperCase()
    const cleanPseudo = playerPseudo.trim()

    if (!cleanCode) {
      setErrorMsg('Entre le code du salon.')
      return
    }
    if (!cleanPseudo) {
      setErrorMsg('Entre ton pseudo.')
      return
    }

    setJoining(true)

    const { data: foundRoom, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .ilike('room_code', cleanCode)
      .order('id', { ascending: false })
      .limit(1)
      .single()

    if (roomError || !foundRoom) {
      setErrorMsg('Salon introuvable. Vérifie le code.')
      setJoining(false)
      return
    }

    const clientId = getOrCreateClientId()
    const assignedColor = pickRandomPlayerColor()

    const { data: createdPlayer, error: playerError } = await supabase
      .from('players')
      .insert([
        {
          room_code: foundRoom.room_code,
          pseudo: cleanPseudo,
          score: 0,
          is_connected: true,
          client_id: clientId || null,
          avatar: assignedColor,
        },
      ])
      .select()
      .single()

    if (playerError || !createdPlayer) {
      setErrorMsg(playerError?.message || 'Impossible de rejoindre le salon.')
      setJoining(false)
      return
    }

    setRoom(foundRoom)
    setPlayer({ ...createdPlayer, avatar: createdPlayer.avatar || assignedColor })
    setJoining(false)
  }

  const playerColor = player ? resolvePlayerColor(player) : RANDOM_PLAYER_COLORS[0]

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#0e172a] text-white select-none font-sans antialiased flex items-center justify-center px-5 py-6 sm:px-8 sm:py-8">
      <style>{`
        html, body {
          height: 100%;
          overflow: hidden;
          overscroll-behavior: none;
          touch-action: none;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
        }
        .tvos-card {
          transition:
            transform 300ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 300ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 220ms ease;
        }
        .tvos-btn {
          transition:
            transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 220ms cubic-bezier(0.22, 1, 0.36, 1),
            background 200ms ease;
        }
        .tvos-btn:hover,
        .tvos-btn:focus-visible {
          transform: scale(1.02);
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

      <section className="relative z-10 max-w-xl w-full mx-auto flex items-center justify-center">
        {!player || !room ? (
          <form
            onSubmit={handleJoinRoom}
            className="tvos-card w-full p-6 sm:p-8 rounded-[28px] bg-gradient-to-b from-white/[0.18] via-white/[0.09] to-slate-900/70 backdrop-blur-2xl border border-white/25 space-y-5"
          >
            <div className="space-y-1 text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
                Connexion au salon
              </span>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                Rejoindre la partie
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Entre le code affiché sur l&apos;écran TV et ton pseudo
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="room-code"
                  className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate-200"
                >
                  Code du salon
                </label>
                <input
                  id="room-code"
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="EX : V6HA3A"
                  maxLength={10}
                  autoCapitalize="characters"
                  autoCorrect="off"
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-950/55 border border-white/25 text-white text-center text-xl font-semibold tracking-[0.22em] placeholder:text-slate-500 placeholder:tracking-normal placeholder:text-sm focus:outline-none focus:border-sky-300"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="player-pseudo"
                  className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate-200"
                >
                  Ton pseudo
                </label>
                <input
                  id="player-pseudo"
                  type="text"
                  value={playerPseudo}
                  onChange={(e) => setPlayerPseudo(e.target.value)}
                  placeholder="Ton prénom ou pseudo"
                  maxLength={24}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-950/55 border border-white/25 text-white text-base font-medium placeholder:text-slate-500 focus:outline-none focus:border-sky-300"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-300/40 text-rose-100 text-xs sm:text-sm text-center">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={joining}
              className="tvos-btn w-full py-4 px-6 rounded-2xl bg-sky-500 hover:bg-sky-400 disabled:opacity-60 text-white font-semibold text-base tracking-tight shadow-[0_14px_30px_-8px_rgba(14,165,233,0.65)] cursor-pointer"
            >
              {joining ? 'Connexion...' : 'Rejoindre le salon'}
            </button>
          </form>
        ) : room.status === 'playing' ? (
          <div className="tvos-card w-full p-6 sm:p-8 rounded-[28px] bg-gradient-to-b from-white/[0.18] via-white/[0.09] to-slate-900/70 backdrop-blur-2xl border border-white/25 space-y-6">
            <div
              style={{ backgroundColor: playerColor }}
              className="p-5 rounded-2xl border-2 border-white/50 flex items-center justify-between gap-4 shadow-lg"
            >
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.15em] text-white/85 font-semibold">
                  {room.game_type === 'petit_bac' ? 'Petit Bac' : 'Quiz'} • {room.room_code}
                </p>
                <p className="text-2xl font-bold text-white truncate">{player.pseudo}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs uppercase tracking-[0.15em] text-white/85 font-semibold">
                  Score
                </p>
                <p className="text-2xl font-bold text-white">{player.score} pts</p>
              </div>
            </div>

            <div className="py-6 px-4 rounded-2xl bg-white/[0.06] border border-white/15 text-center space-y-2">
              <p className="text-lg font-semibold text-white">
                Regarde l&apos;écran TV
              </p>
              <p className="text-xs sm:text-sm text-slate-300">
                {room.game_type === 'petit_bac'
                  ? 'La lettre est affichée sur la TV : prépare tes mots.'
                  : 'La question est affichée sur la TV : prépare ta réponse.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="tvos-card w-full p-6 sm:p-8 rounded-[28px] bg-gradient-to-b from-white/[0.18] via-white/[0.09] to-slate-900/70 backdrop-blur-2xl border border-white/25 text-center space-y-6">
            <div
              style={{ backgroundColor: playerColor }}
              className="w-full py-6 px-5 rounded-[24px] border-2 border-white/50 shadow-lg space-y-1.5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
                Salon {room.room_code}
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                {player.pseudo}
              </h1>
            </div>

            <div className="py-6 px-4 rounded-2xl bg-white/[0.06] border border-white/15 space-y-1.5">
              <p className="text-base font-medium text-white">
                En attente du lancement...
              </p>
              <p className="text-xs sm:text-sm text-slate-300">
                L&apos;hôte va bientôt lancer la partie depuis la TV.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default function PlayerPage() {
  return (
    <Suspense
      fallback={
        <main className="h-screen w-full overflow-hidden bg-[#0e172a] text-white flex items-center justify-center p-6">
          <p className="text-sm text-slate-300">Chargement...</p>
        </main>
      }
    >
      <PlayerContent />
    </Suspense>
  )
}
