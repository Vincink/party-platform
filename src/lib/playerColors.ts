export const FLASHY_BORDERS = [
  {
    border: 'border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.45)]',
    halo: 'ring-4 ring-cyan-400/45 shadow-[0_0_32px_rgba(34,211,238,0.65)]',
    badge: 'text-cyan-300',
    pillBorder: 'border-cyan-400',
    pillGlow: 'shadow-[0_0_25px_rgba(34,211,238,0.55)]',
    rankBadge: 'bg-cyan-400/15 border-cyan-400/60 text-cyan-300',
  },
  {
    border: 'border-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,0.45)]',
    halo: 'ring-4 ring-fuchsia-500/45 shadow-[0_0_32px_rgba(217,70,239,0.65)]',
    badge: 'text-fuchsia-300',
    pillBorder: 'border-fuchsia-500',
    pillGlow: 'shadow-[0_0_25px_rgba(217,70,239,0.55)]',
    rankBadge: 'bg-fuchsia-500/15 border-fuchsia-500/60 text-fuchsia-300',
  },
  {
    border: 'border-lime-400 shadow-[0_0_20px_rgba(163,230,53,0.45)]',
    halo: 'ring-4 ring-lime-400/45 shadow-[0_0_32px_rgba(163,230,53,0.65)]',
    badge: 'text-lime-300',
    pillBorder: 'border-lime-400',
    pillGlow: 'shadow-[0_0_25px_rgba(163,230,53,0.55)]',
    rankBadge: 'bg-lime-400/15 border-lime-400/60 text-lime-300',
  },
  {
    border: 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.45)]',
    halo: 'ring-4 ring-yellow-400/45 shadow-[0_0_32px_rgba(250,204,21,0.65)]',
    badge: 'text-yellow-300',
    pillBorder: 'border-yellow-400',
    pillGlow: 'shadow-[0_0_25px_rgba(250,204,21,0.55)]',
    rankBadge: 'bg-yellow-400/15 border-yellow-400/60 text-yellow-300',
  },
  {
    border: 'border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.45)]',
    halo: 'ring-4 ring-orange-500/45 shadow-[0_0_32px_rgba(249,115,22,0.65)]',
    badge: 'text-orange-300',
    pillBorder: 'border-orange-500',
    pillGlow: 'shadow-[0_0_25px_rgba(249,115,22,0.55)]',
    rankBadge: 'bg-orange-500/15 border-orange-500/60 text-orange-300',
  },
  {
    border: 'border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.45)]',
    halo: 'ring-4 ring-rose-500/45 shadow-[0_0_32px_rgba(244,63,94,0.65)]',
    badge: 'text-rose-300',
    pillBorder: 'border-rose-500',
    pillGlow: 'shadow-[0_0_25px_rgba(244,63,94,0.55)]',
    rankBadge: 'bg-rose-500/15 border-rose-500/60 text-rose-300',
  },
  {
    border: 'border-violet-400 shadow-[0_0_20px_rgba(167,139,250,0.45)]',
    halo: 'ring-4 ring-violet-400/45 shadow-[0_0_32px_rgba(167,139,250,0.65)]',
    badge: 'text-violet-300',
    pillBorder: 'border-violet-400',
    pillGlow: 'shadow-[0_0_25px_rgba(167,139,250,0.55)]',
    rankBadge: 'bg-violet-400/15 border-violet-400/60 text-violet-300',
  },
  {
    border: 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.45)]',
    halo: 'ring-4 ring-emerald-400/45 shadow-[0_0_32px_rgba(52,211,153,0.65)]',
    badge: 'text-emerald-300',
    pillBorder: 'border-emerald-400',
    pillGlow: 'shadow-[0_0_25px_rgba(52,211,153,0.55)]',
    rankBadge: 'bg-emerald-400/15 border-emerald-400/60 text-emerald-300',
  },
]

export function getPlayerColorStyle(playerId: number) {
  const safeId = Math.abs(playerId)
  return FLASHY_BORDERS[safeId % FLASHY_BORDERS.length]
}
