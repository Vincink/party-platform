'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
      <div className="max-w-xl w-full text-center space-y-8">
        <div className="space-y-3">
          <span className="px-3 py-1 text-xs font-semibold uppercase tracking-widest bg-indigo-500/20 text-indigo-400 rounded-full border border-indigo-500/30">
            Plateforme Multijoueur en Temps Réel
          </span>
          <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
            Party Platform
          </h1>
          <p className="text-slate-400 text-lg">
            Affichage dynamique sur grand écran et contrôles fluides sur smartphone.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <Link
            href="/tv"
            className="group relative flex flex-col items-center p-8 bg-slate-900/80 hover:bg-slate-900 border border-indigo-500/30 hover:border-indigo-500 rounded-2xl shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 text-center"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📺</div>
            <h2 className="text-xl font-bold text-white mb-2">Mode TV / Hôte</h2>
            <p className="text-sm text-slate-400">Lance le salon et affiche le code QR sur grand écran.</p>
          </Link>

          <Link
            href="/player"
            className="group relative flex flex-col items-center p-8 bg-slate-900/80 hover:bg-slate-900 border border-emerald-500/30 hover:border-emerald-500 rounded-2xl shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 text-center"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📱</div>
            <h2 className="text-xl font-bold text-white mb-2">Rejoindre</h2>
            <p className="text-sm text-slate-400">Entre le code de la partie depuis ton smartphone.</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
