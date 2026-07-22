import type { CaseResult, Challenge, Evaluation } from './types'

export const readabilityScore = (source: string): number => {
  if (!source) return 0
  const rewards = [source.startsWith('^'), source.endsWith('$'), !source.includes('.*.*'), source.length <= 80]
  return rewards.filter(Boolean).length * 5
}

export const scoreEvaluation = (visibleCorrect: number, hiddenCorrect: number, total: number, source: string, elapsedMs: number): number => {
  const accuracy = Math.round(((visibleCorrect + hiddenCorrect) / total) * 70)
  const performance = elapsedMs <= 25 ? 15 : elapsedMs <= 100 ? 10 : 4
  const length = Math.max(0, 10 - Math.floor(source.length / 12))
  return Math.min(100, accuracy + performance + length + readabilityScore(source))
}

export const makeEvaluation = (challenge: Challenge, source: string, results: CaseResult[], elapsedMs: number, timedOut = false, error?: string): Evaluation => {
  const visibleCorrect = results.slice(0, challenge.visible.length).filter((result) => result.passed).length
  const hiddenCorrect = results.slice(challenge.visible.length).filter((result) => result.passed).length
  return { cases: results, visibleCorrect, hiddenCorrect, elapsedMs, score: timedOut || error ? 0 : scoreEvaluation(visibleCorrect, hiddenCorrect, results.length, source, elapsedMs), timedOut, error }
}
