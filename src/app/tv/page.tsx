'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { QRCodeSVG } from 'qrcode.react'

interface Player {
  id: string
  pseudo: string
  score: number
}

export default function TvLobbyPage() {
  const [roomCode, setRoomCode] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(false)

  // 1. Fonction pour créer une nouvelle salle de jeu
  const createRoom = async () => {
    setLoading(true)
    const code = Math.floor(1000 + Math.random() * 9000).toString()

    const { data, error } = await supabase
      .from('game_sessions')
      .insert([{ room_code: code, status: 'LOBBY' }])
      .select()
      .single()

    if (error) {
      console.error("Erreur lors de la création de la salle :", error)
      setLoading(false)
      return
    }

    setRoomCode(code)
    setSessionId(data.id)
    setLoading(false)
  }

  // 2. Écouter en temps réel les joueurs qui rejoignent la salle
  useEffect(() => {
    if (!sessionId) return

    // Charger les joueurs déjà présents (si reconnexion)
    const fetchPlayers = async () => {
      const { data } = await supabase
        .from('players')
        .select('*')
        .eq('session_id', sessionId)
      if (data) setPlayers(data)
    }
    fetchPlayers()

    // S'abonner aux changements dans la table players (Temps Réel)
    const channel = supabase
      .channel('room-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
          filter: `session_id=eq.${sessionId}`,
        },
        () => {
          fetchPlayers() // Recharge la liste dès qu'un joueur rejoint ou quitte
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [sessionId])

  const joinUrl = roomCode ? `${window.location.origin}/join?room=${roomCode}` : ''

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-between p-8">
      {/* En-titre */}
      <div className="w-full max-w-6xl text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Plateforme de Jeux Multijoueurs
        </h1>
      </div>

      {/* Contenu principal */}
      <div className="w-full max-w-6xl my-auto">
        {!roomCode ? (
          <div className="text-center">
            <button
              onClick={createRoom}
              disabled={loading}
              className="px-8 py-5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-2xl rounded-2xl shadow-lg transition-all transform hover:scale-105 cursor-pointer"
            >
              {loading ? "Création en cours..." : "Créer une nouvelle partie 🎮"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Colonne de gauche : Code PIN & QR Code */}
            <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl flex flex-col items-center space-y-6">
              <div className="text-center space-y-2">
                <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Code de la salle</p>
                <div className="text-6xl font-black tracking-widest text-yellow-400 bg-slate-950 px-6 py-3 rounded-2xl border border-slate-800">
                  {roomCode}
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl flex flex-col items-center space-y-2 text-slate-950">
                <QRCodeSVG value={joinUrl} size={160} />
                <p className="text-xs font-bold text-slate-600">Scanne pour rejoindre</p>
              </div>
            </div>

            {/* Colonne de droite : Liste des joueurs connectés en direct */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl flex flex-col h-[450px]">
              <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-4">
                <h2 className="text-2xl font-bold text-purple-300">Joueurs connectés</h2>
                <span className="bg-purple-950 text-purple-300 px-4 py-1 rounded-full font-bold text-lg border border-purple-800">
                  {players.length} {players.length <= 1 ? "joueur" : "joueurs"}
                </span>
              </div>

              {/* Grille des pseudos des joueurs */}
              <div className="flex-1 overflow-y-auto pr-2">
                {players.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                    <p className="text-lg">En attente des premiers joueurs...</p>
                    <p className="text-sm">Scanne le QR code ou entre le code sur ton téléphone</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {players.map((player) => (
                      <div
                        key={player.id}
                        className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center space-x-3 shadow-md animate-fade-in"
                      >
                        <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-lg shadow">
                          {player.pseudo.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-lg truncate text-slate-200">{player.pseudo}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bouton pour lancer la partie (actif s'il y a au moins 1 joueur) */}
              <div className="mt-4 pt-4 border-t border-slate-800">
                <button
                  disabled={players.length === 0}
                  className={`w-full py-4 font-bold text-xl rounded-2xl shadow-lg transition-all ${
                    players.length > 0
                      ? "bg-green-600 hover:bg-green-500 text-white cursor-pointer transform hover:scale-[1.02]"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  {players.length > 0 ? "Lancer la partie ! 🚀" : "En attente de joueurs..."}
                </button>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Pied de page discret */}
      <div className="w-full text-center text-slate-600 text-xs">
        Mode TV / Animateur — Synchronisation en temps réel active
      </div>
    </div>
  )
}
