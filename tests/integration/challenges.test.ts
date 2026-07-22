import { describe, expect, it } from 'vitest'
import { challenges } from '../../src/core/challenges'
import { evaluateRegex } from '../../src/core/regex'

describe('challenge fixture contract', () => {
  it('ships 30 reproducible offline challenges spanning all modes', () => {
    expect(challenges).toHaveLength(30)
    expect(new Set(challenges.map((challenge) => challenge.category))).toEqual(new Set(['extract', 'validate', 'log', 'refactor']))
    for (const challenge of challenges) {
      expect(challenge.visible.length).toBeGreaterThanOrEqual(3)
      expect(challenge.hidden.length).toBeGreaterThan(0)
      expect(challenge.performance.length).toBeGreaterThan(0)
    }
  })
  it('does not expose hidden data in visible case result summaries', () => {
    const result = evaluateRegex(challenges[1], '^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$')
    expect(result.hiddenCorrect).toBeGreaterThan(0)
    expect(result.cases.slice(0, challenges[1].visible.length)).toHaveLength(challenges[1].visible.length)
  })
})
