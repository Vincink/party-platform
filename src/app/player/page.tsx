'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function PlayerPage() {
  const [pin, setPin] = useState('')
  const [pseudo, setPseudo] = useState('')
  const [joined, setJoined] = useState(false)
  const [error, setError] = useState('')

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!pin || !pseudo) {
      setError('Veuillez remplir tous les champs.')
      return
    }

    // Vérifier si le salon existe avec room_code
    const { data: roomData, error: roomError } = await supabase
      .from('rooms')
      .select('room_code')
      .eq('room_code', pin)
      .single()

    if (roomError || !roomData) {
      setError('Salon introuvable avec ce code PIN.')
      return
    }

    // Inscrire le joueur dans la table players avec session_id et pseudo
    const { error: joinError } = await supabase
      .from('players')
      .insert([{ session_id: pin, pseudo, is_connected: true, score: 0 }])

    if (joinError) {
      setError('Erreur lors de la connexion au salon.')
      return
    }

    setJoined(true)
  }

  if (joined) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-950 text-white text-center">
        <div className="max-w-md w-full space-y-6 bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl">
          <div className="text-5xl">🎉</div>
          <h1 className="text-2xl font-bold text-emerald-400">Te voilà dans la partie, {pseudo} !</h1>
          <p className="text-slate-400">Regarde le grand écran pour suivre le jeu en direct.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-950 text-white">
      <div className="max-w-md w-full space-y-6 bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <h1 className="text-3xl font-black text-center">Rejoindre la Partie</h1>
        
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500 text-red-300 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Code PIN à 4 chiffres</label>
            <input
              type="text"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Ex: 1234"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-center text-2xl font-bold tracking-widest text-indigo-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Ton Pseudo</label>
            <input
              type="text"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              placeholder="Ex: SuperGamer"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-lg font-semibold text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-lg shadow-lg transition-all"
          >
            C'est parti !
          </button>
        </form>
      </div>
    </main>
  )
}
