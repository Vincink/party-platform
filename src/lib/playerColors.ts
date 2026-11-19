export const FLASHY_BORDERS = [
  {
    border: 'border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.65)]',
    badge: 'text-cyan-300',
    pillBorder: 'border-cyan-400',
    pillGlow: 'shadow-[0_0_25px_rgba(34,211,238,0.55)]',
    pillBg: 'bg-cyan-500/15',
    rankBadge: 'bg-cyan-400/20 border-cyan-300 text-cyan-200',
  },
  {
    border: 'border-fuchsia-500 shadow-[0_0_25px_rgba(217,70,239,0.65)]',
    badge: 'text-fuchsia-300',
    pillBorder: 'border-fuchsia-500',
    pillGlow: 'shadow-[0_0_25px_rgba(217,70,239,0.55)]',
    pillBg: 'bg-fuchsia-500/15',
    rankBadge: 'bg-fuchsia-500/20 border-fuchsia-300 text-fuchsia-200',
  },
  {
    border: 'border-lime-400 shadow-[0_0_25px_rgba(163,230,53,0.65)]',
    badge: 'text-lime-300',
    pillBorder: 'border-lime-400',
    pillGlow: 'shadow-[0_0_25px_rgba(163,230,53,0.55)]',
    pillBg: 'bg-lime-400/15',
    rankBadge: 'bg-lime-400/20 border-lime-300 text-lime-200',
  },
  {
    border: 'border-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.65)]',
    badge: 'text-yellow-300',
    pillBorder: 'border-yellow-400',
    pillGlow: 'shadow-[0_0_25px_rgba(250,204,21,0.55)]',
    pillBg: 'bg-yellow-400/15',
    rankBadge: 'bg-yellow-400/20 border-yellow-300 text-yellow-200',
  },
  {
    border: 'border-orange-500 shadow-[0_0_25px_rgba(249,115,22,0.65)]',
    badge: 'text-orange-300',
    pillBorder: 'border-orange-500',
    pillGlow: 'shadow-[0_0_25px_rgba(249,115,22,0.55)]',
    pillBg: 'bg-orange-500/15',
    rankBadge: 'bg-orange-500/20 border-orange-300 text-orange-200',
  },
  {
    border: 'border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.65)]',
    badge: 'text-rose-300',
    pillBorder: 'border-rose-500',
    pillGlow: 'shadow-[0_0_25px_rgba(244,63,94,0.55)]',
    pillBg: 'bg-rose-500/15',
    rankBadge: 'bg-rose-500/20 border-rose-300 text-rose-200',
  },
  {
    border: 'border-violet-400 shadow-[0_0_25px_rgba(167,139,250,0.65)]',
    badge: 'text-violet-300',
    pillBorder: 'border-violet-400',
    pillGlow: 'shadow-[0_0_25px_rgba(167,139,250,0.55)]',
    pillBg: 'bg-violet-400/15',
    rankBadge: 'bg-violet-400/20 border-violet-300 text-violet-200',
  },
  {
    border: 'border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.65)]',
    badge: 'text-emerald-300',
    pillBorder: 'border-emerald-400',
    pillGlow: 'shadow-[0_0_25px_rgba(52,211,153,0.55)]',
    pillBg: 'bg-emerald-400/15',
    rankBadge: 'bg-emerald-400/20 border-emerald-300 text-emerald-200',
  },
]

export function getPlayerColorStyle(playerId: number) {
  const safeId = Math.abs(playerId)
  return FLASHY_BORDERS[safeId % FLASHY_BORDERS.length]
}
