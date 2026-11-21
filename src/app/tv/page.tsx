'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#06070a] text-white select-none font-sans antialiased flex flex-col justify-between px-6 py-8 md:px-14 md:py-12">
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
          transform: scale(1.045) translateY(-4px);
          box-shadow:
            0 30px 70px -15px rgba(0, 0, 0, 0.88),
            0 0 0 2px rgba(255, 255, 255, 0.55);
          outline: none;
        }
      `}</style>

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_-5%,rgba(37,99,235,0.28),rgba(6,7,10,0))]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_80%_85%,rgba(14,165,233,0.10),transparent_45%)]"
      />

      <header className="relative z-10 flex items-center justify-between max-w-6xl w-full mx-auto">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
          tvOS • Salon
        </span>
        <span className="inline-flex items-center px-3.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.16em] bg-white/[0.06] border border-white/15 text-sky-200 backdrop-blur-xl">
          Plateforme multijoueur en temps réel
        </span>
      </header>

      <section className="relative z-10 max-w-5xl w-full mx-auto my-auto space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-white leading-[1.04]">
            Party Platform
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-zinc-300/90 font-normal leading-relaxed">
            Affichage dynamique sur grand écran et contrôles fluides sur smartphone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <Link
            href="/tv"
            className="tvos-card group relative min-h-[220px] md:min-h-[250px] p-7 md:p-9 rounded-[28px] bg-gradient-to-b from-white/[0.10] via-white/[0.04] to-black/40 backdrop-blur-2xl border border-white/15 flex flex-col justify-between overflow-hidden"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
                Grand écran
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/10 border border-white/10 text-zinc-300">
                Hôte
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
                Mode TV / Hôte
              </h2>
              <p className="text-sm md:text-base text-zinc-300/80 leading-relaxed">
                Lance le salon et affiche le code QR sur grand écran.
              </p>
            </div>
          </Link>

          <Link
            href="/player"
            className="tvos-card group relative min-h-[220px] md:min-h-[250px] p-7 md:p-9 rounded-[28px] bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-black/45 backdrop-blur-2xl border border-white/15 flex flex-col justify-between overflow-hidden"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-300">
                Smartphone
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/10 border border-white/10 text-zinc-300">
                Joueur
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
                Rejoindre
              </h2>
              <p className="text-sm md:text-base text-zinc-300/80 leading-relaxed">
                Entre le code de la partie depuis ton smartphone.
              </p>
            </div>
          </Link>
        </div>
      </section>

      <footer className="relative z-10 max-w-6xl w-full mx-auto text-center">
        <p className="text-xs tracking-wide text-zinc-500">
          Sélectionnez une tuile pour continuer
        </p>
      </footer>
    </main>
  )
}
