export interface PetitBacRound {
  letter: string
  category: string
}

export type PetitBacVerdict = 'unique' | 'duplicate' | 'rejected' | 'empty'

export interface EvaluatedPetitBacEntry {
  playerId: number
  rawAnswer: string
  normalizedAnswer: string
  verdict: PetitBacVerdict
  pointsDelta: number
  isCloseMatch: boolean
}

export const PETIT_BAC_ROUNDS_PER_GAME = 10
export const PETIT_BAC_DURATION_SECONDS = 20
export const PETIT_BAC_UNIQUE_POINTS = 10
export const PETIT_BAC_DUPLICATE_POINTS = 5
export const PETIT_BAC_REJECTED_POINTS = 0
export const PETIT_BAC_NO_ANSWER_PENALTY = 2

export const PETIT_BAC_LETTERS = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'L',
  'M',
  'N',
  'O',
  'P',
  'R',
  'S',
  'T',
  'V',
] as const

export const PETIT_BAC_CATEGORIES: string[] = [
  'Animal',
  'Pays ou Ville',
  'Métier',
  'Film ou Série',
  'Fruit ou Légume',
  'Marque',
  'Prénom',
  'Sport',
  'Objet du quotidien',
  'Célébrité',
  'Plat ou Aliment',
  'Instrument ou Art',
  'Vêtement ou Accessoire',
  'Boisson',
]

export function normalizePetitBacWord(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’\-]+/g, ' ')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length

  const dp: number[][] = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  )

  for (let i = 0; i <= a.length; i++) dp[i][0] = i
  for (let j = 0; j <= b.length; j++) dp[0][j] = j

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      )
    }
  }

  return dp[a.length][b.length]
}

export function areWordsSimilar(a: string, b: string): boolean {
  const normA = normalizePetitBacWord(a)
  const normB = normalizePetitBacWord(b)
  if (!normA || !normB) return false
  if (normA === normB) return true

  const dist = levenshteinDistance(normA, normB)
  const maxLen = Math.max(normA.length, normB.length)

  if (maxLen <= 4) return dist <= 1
  if (maxLen <= 8) return dist <= 2
  return dist <= 2
}

export function pickPetitBacRounds(count = PETIT_BAC_ROUNDS_PER_GAME): PetitBacRound[] {
  const lettersPool = [...PETIT_BAC_LETTERS]
  for (let i = lettersPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[lettersPool[i], lettersPool[j]] = [lettersPool[j], lettersPool[i]]
  }

  const categoriesPool = [...PETIT_BAC_CATEGORIES]
  for (let i = categoriesPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[categoriesPool[i], categoriesPool[j]] = [categoriesPool[j], categoriesPool[i]]
  }

  const rounds: PetitBacRound[] = []
  for (let i = 0; i < count; i++) {
    const letter = lettersPool[i % lettersPool.length]
    const category = categoriesPool[i % categoriesPool.length]
    rounds.push({ letter, category })
  }
  return rounds
}

export function computePetitBacPoints(verdict: PetitBacVerdict): number {
  switch (verdict) {
    case 'unique':
      return PETIT_BAC_UNIQUE_POINTS
    case 'duplicate':
      return PETIT_BAC_DUPLICATE_POINTS
    case 'rejected':
      return PETIT_BAC_REJECTED_POINTS
    case 'empty':
      return -PETIT_BAC_NO_ANSWER_PENALTY
  }
}

export function evaluatePetitBacAnswers(
  players: { id: number; answer?: string | null }[],
  targetLetter: string
): EvaluatedPetitBacEntry[] {
  const expectedFirst = normalizePetitBacWord(targetLetter).charAt(0)

  const initial = players.map((p) => {
    const raw = (p.answer ?? '').trim()
    const normalized = normalizePetitBacWord(raw)

    if (!normalized) {
      return {
        playerId: p.id,
        rawAnswer: raw,
        normalizedAnswer: '',
        verdict: 'empty' as PetitBacVerdict,
        pointsDelta: computePetitBacPoints('empty'),
        isCloseMatch: false,
      }
    }

    const startsWithRightLetter = expectedFirst ? normalized.startsWith(expectedFirst) : true
    if (!startsWithRightLetter) {
      return {
        playerId: p.id,
        rawAnswer: raw,
        normalizedAnswer: normalized,
        verdict: 'rejected' as PetitBacVerdict,
        pointsDelta: computePetitBacPoints('rejected'),
        isCloseMatch: false,
      }
    }

    return {
      playerId: p.id,
      rawAnswer: raw,
      normalizedAnswer: normalized,
      verdict: 'unique' as PetitBacVerdict,
      pointsDelta: computePetitBacPoints('unique'),
      isCloseMatch: false,
    }
  })

  const validEntries = initial.filter((e) => e.verdict !== 'empty' && e.verdict !== 'rejected')

  for (let i = 0; i < validEntries.length; i++) {
    for (let j = i + 1; j < validEntries.length; j++) {
      if (areWordsSimilar(validEntries[i].normalizedAnswer, validEntries[j].normalizedAnswer)) {
        validEntries[i].verdict = 'duplicate'
        validEntries[j].verdict = 'duplicate'
        validEntries[i].pointsDelta = computePetitBacPoints('duplicate')
        validEntries[j].pointsDelta = computePetitBacPoints('duplicate')

        if (validEntries[i].normalizedAnswer !== validEntries[j].normalizedAnswer) {
          validEntries[i].isCloseMatch = true
          validEntries[j].isCloseMatch = true
        }
      }
    }
  }

  return initial
}
