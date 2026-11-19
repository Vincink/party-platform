import type { CSSProperties } from 'react'

export interface PlayerColorTheme {
  name: string
  hex: string
  glowStrong: string
  glowMid: string
  glowSoft: string
  badgeClass: string
  rankBadgeClass: string
}

export const FLASHY_PLAYER_COLORS: PlayerColorTheme[] = [
  {
    name: 'Cyan fluo',
    hex: '#22d3ee',
    glowStrong: 'rgba(34, 211, 238, 0.85)',
    glowMid: 'rgba(34, 211, 238, 0.45)',
    glowSoft: 'rgba(34, 211, 238, 0.22)',
    badgeClass: 'text-cyan-300',
    rankBadgeClass: 'bg-cyan-400/15 text-cyan-200',
  },
  {
    name: 'Rose fluo',
    hex: '#ff2a85',
    glowStrong: 'rgba(255, 42, 133, 0.85)',
    glowMid: 'rgba(255, 42, 133, 0.45)',
    glowSoft: 'rgba(255, 42, 133, 0.22)',
    badgeClass: 'text-pink-300',
    rankBadgeClass: 'bg-pink-500/15 text-pink-200',
  },
  {
    name: 'Vert citron fluo',
    hex: '#a3ff00',
    glowStrong: 'rgba(163, 255, 0, 0.85)',
    glowMid: 'rgba(163, 255, 0, 0.45)',
    glowSoft: 'rgba(163, 255, 0, 0.22)',
    badgeClass: 'text-lime-300',
    rankBadgeClass: 'bg-lime-400/15 text-lime-200',
  },
  {
    name: 'Jaune fluo',
    hex: '#ffe600',
    glowStrong: 'rgba(255, 230, 0, 0.9)',
    glowMid: 'rgba(255, 230, 0, 0.45)',
    glowSoft: 'rgba(255, 230, 0, 0.22)',
    badgeClass: 'text-yellow-300',
    rankBadgeClass: 'bg-yellow-300/15 text-yellow-200',
  },
  {
    name: 'Orange fluo',
    hex: '#ff6a00',
    glowStrong: 'rgba(255, 106, 0, 0.9)',
    glowMid: 'rgba(255, 106, 0, 0.45)',
    glowSoft: 'rgba(255, 106, 0, 0.22)',
    badgeClass: 'text-orange-300',
    rankBadgeClass: 'bg-orange-400/15 text-orange-200',
  },
  {
    name: 'Magenta fluo',
    hex: '#e838ff',
    glowStrong: 'rgba(232, 56, 255, 0.85)',
    glowMid: 'rgba(232, 56, 255, 0.45)',
    glowSoft: 'rgba(232, 56, 255, 0.22)',
    badgeClass: 'text-fuchsia-300',
    rankBadgeClass: 'bg-fuchsia-400/15 text-fuchsia-200',
  },
  {
    name: 'Violet fluo',
    hex: '#a855f7',
    glowStrong: 'rgba(168, 85, 247, 0.85)',
    glowMid: 'rgba(168, 85, 247, 0.45)',
    glowSoft: 'rgba(168, 85, 247, 0.22)',
    badgeClass: 'text-purple-300',
    rankBadgeClass: 'bg-purple-400/15 text-purple-200',
  },
  {
    name: 'Vert menthe fluo',
    hex: '#00f59b',
    glowStrong: 'rgba(0, 245, 155, 0.85)',
    glowMid: 'rgba(0, 245, 155, 0.45)',
    glowSoft: 'rgba(0, 245, 155, 0.22)',
    badgeClass: 'text-emerald-300',
    rankBadgeClass: 'bg-emerald-400/15 text-emerald-200',
  },
]

export function getPlayerColorTheme(playerId: number): PlayerColorTheme {
  const safeId = Math.abs(playerId)
  return FLASHY_PLAYER_COLORS[safeId % FLASHY_PLAYER_COLORS.length]
}

export function getPlayerNeonStyle(playerId: number): CSSProperties {
  const theme = getPlayerColorTheme(playerId)

  return {
    borderColor: theme.hex,
    boxShadow: `0 0 14px ${theme.glowStrong}, 0 0 34px ${theme.glowMid}, 0 0 65px ${theme.glowSoft}`,
  }
}
