'use client'

import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#0e172a] text-white select-none font-sans antialiased flex flex-col justify-between px-6 py-7 md:px-12 md:py-10">
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
          transform: scale(1.025) translateY(-3px);
          box-shadow:
            0 28px 65px -12px rgba(2, 6, 23, 0.75),
            0 0 0 2px rgba(255, 255, 255, 0.75);
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

      <header className="relative z-10 flex items-center justify-between max-w-5xl w-full mx-auto">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
          tvOS • Party Platform
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.16em] bg-white/[0.12] border border-white/20 text-sky-200 backdrop-blur-xl">
          Multijoueur
        </span>
      </header>

      <section className="relative z-10 max-w-5xl w-full mx-auto my-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white">
            Choisis ton écran
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Lance un salon sur la TV ou rejoins une partie depuis ton téléphone
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            type="button"
            onClick={() => router.push('/tv')}
            className="tvos-card p-8 md:p-10 rounded-[32px] bg-gradient-to-b from-white/[0.18] via-white/[0.09] to-slate-900/65 backdrop-blur-2xl border border-white/25 text-left flex flex-col justify-between gap-8 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-sky-400 to-blue-600 shadow-[0_12px_30px_-6px_rgba(56,189,248,0.65)] ring-2 ring-white/75 flex items-center justify-center">
              <svg
                viewBox="0 0 48 48"
                fill="none"
                className="w-9 h-9 text-white"
                aria-hidden="true"
              >
                <rect
                  x="6"
                  y="10"
                  width="36"
                  height="24"
                  rx="4"
                  stroke="currentColor"
                  strokeWidth="2.8"
                />
                <path
                  d="M16 40H32M24 34V40"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
                Écran principal
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                Mode TV (Hôte)
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Crée un salon, affiche le QR code et dirige les manches de Quiz ou de Petit Bac.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => router.push('/player')}
            className="tvos-card p-8 md:p-10 rounded-[32px] bg-gradient-to-b from-white/[0.18] via-white/[0.09] to-slate-900/65 backdrop-blur-2xl border border-white/25 text-left flex flex-col justify-between gap-8 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-indigo-400 to-cyan-500 shadow-[0_12px_30px_-6px_rgba(99,102,241,0.65)] ring-2 ring-white/75 flex items-center justify-center">
              <svg
                viewBox="0 0 48 48"
                fill="none"
                className="w-9 h-9 text-white"
                aria-hidden="true"
              >
                <rect
                  x="14"
                  y="6"
                  width="20"
                  height="36"
                  rx="4.5"
                  stroke="currentColor"
                  strokeWidth="2.8"
                />
                <circle cx="24" cy="36" r="1.8" fill="currentColor" />
              </svg>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                Manette mobile
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                Mode Joueur
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Entre le code affiché sur la télévision et participe depuis ton smartphone.
              </p>
            </div>
          </button>
        </div>
      </section>

      <footer className="relative z-10 max-w-5xl w-full mx-auto text-center">
        <p className="text-xs tracking-wide text-slate-400">
          Synchronisation temps réel • Salon multijoueur
        </p>
      </footer>
    </main>
  )
}
