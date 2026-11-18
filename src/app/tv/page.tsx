'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface Player {
  id: number
  pseudo: string
}

export default function TVPage() {
  const [pin, setPin] = useState<string>('')
  const [playersList, setPlayersList] = useState<Player[]>([])
  const [dbError, setDbError] = useState<string>('')
  
  // Empêche la double exécution en mode dev (React Strict Mode)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const randomPin = Math.floor(1000 + Math.random() * 9000).toString()
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
      .channel('room-' + randomPin)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'players',
          filter: `session_id=eq.${randomPin}`,
        },
        (payload) => {
          setPlayersList((prev) => [...prev, payload.new as Player])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-slate-950 text-white">
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-3xl font-bold text-slate-300">Salon de l'Animateur</h1>
        
        {dbError && (
          <div className="p-4 bg-red-500/20 border border-red-500 text-red-300 rounded-xl text-sm font-semibold">
            Erreur Supabase : {dbError}
          </div>
        )}

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <p className="text-sm uppercase tracking-widest text-slate-400 mb-2">Code de la partie</p>
          <div className="text-7xl font-black tracking-widest text-indigo-400">{pin || '----'}</div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4 text-indigo-300">Joueurs connectés ({playersList.length})</h2>
          {playersList.length === 0 ? (
            <p className="text-slate-500 animate-pulse">En attente des joueurs sur leur smartphone...</p>
          ) : (
            <div className="flex flex-wrap gap-3 justify-center">
              {playersList.map((p) => (
                <span key={p.id} className="px-4 py-2 bg-indigo-600/30 border border-indigo-500/50 rounded-xl font-semibold text-lg">
                  {p.pseudo}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
