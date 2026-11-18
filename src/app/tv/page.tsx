'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'

export default function TVPage() {
  const [pin, setPin] = useState<string>('----')

  useEffect(() => {
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString()
    setPin(randomPin)
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-slate-950 text-white">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold text-slate-300">Salon de l'Animateur</h1>
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <p className="text-sm uppercase tracking-widest text-slate-400 mb-2">Code de la partie</p>
          <div className="text-7xl font-black tracking-widest text-indigo-400">{pin}</div>
        </div>
        <p className="text-slate-400">Scannez le QR code ou rendez-vous sur le site pour rejoindre.</p>
      </div>
    </main>
  )
}
