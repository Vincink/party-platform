'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8 space-y-8 text-center">
      <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
        Plateforme de Jeux Multijoueurs
      </h1>
      <p className="text-slate-400 max-w-md">
        Choisis ton mode pour commencer : affiche l'écran principal sur la TV ou rejoins la partie depuis ton smartphone.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link
          href="/tv"
          className="flex-1 py-5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-lg rounded-2xl shadow-lg transition-all text-center"
        >
          📺 Mode TV / Animateur
        </Link>
        <Link
          href="/join"
          className="flex-1 py-5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg rounded-2xl shadow-lg transition-all text-center"
        >
          📱 Rejoindre (Joueur)
        </Link>
      </div>
    </div>
  )
}
