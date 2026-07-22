export type ScoreEntry = { name: string; score: number; challengeId: string; createdAt: string }
const key = 'regex-coliseum:scores'
export const readScores = (): ScoreEntry[] => {
  try { return JSON.parse(localStorage.getItem(key) ?? '[]') as ScoreEntry[] } catch { return [] }
}
export const saveScore = (entry: ScoreEntry): ScoreEntry[] => {
  const next = [...readScores(), entry].sort((a, b) => b.score - a.score).slice(0, 20)
  localStorage.setItem(key, JSON.stringify(next))
  return next
}
