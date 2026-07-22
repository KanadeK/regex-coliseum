import { describe, expect, it } from 'vitest'
import { readabilityScore, scoreEvaluation } from '../../src/core/scoring'

describe('scoring', () => {
  it('rewards bounded, readable patterns without exceeding 100', () => {
    expect(readabilityScore('^foo$')).toBe(20)
    expect(scoreEvaluation(4, 2, 6, '^foo$', 4)).toBe(100)
  })
  it('penalizes slow and low-accuracy answers', () => {
    expect(scoreEvaluation(1, 0, 6, '.*.*', 150)).toBe(31)
  })
})
