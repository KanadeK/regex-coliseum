import { describe, expect, it } from 'vitest'
import { challenges } from '../../src/core/challenges'
import { evaluateRegex, regexInputSchema } from '../../src/core/regex'

describe('regex evaluation', () => {
  const email = challenges[0]
  it('scores a correct pattern against visible and hidden cases', () => {
    const result = evaluateRegex(email, '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$')
    expect(result.error).toBeUndefined()
    expect(result.visibleCorrect).toBe(email.visible.length)
    expect(result.hiddenCorrect).toBe(email.hidden.length)
    expect(result.score).toBeGreaterThan(80)
  })
  it('reports malformed patterns instead of treating them as matches', () => {
    const result = evaluateRegex(email, '[')
    expect(result.score).toBe(0)
    expect(result.error).toMatch(/Invalid regular expression/)
  })
  it('rejects duplicate and unsupported flags', () => {
    expect(regexInputSchema.safeParse({ source: 'x', flags: 'ii' }).success).toBe(false)
    expect(regexInputSchema.safeParse({ source: 'x', flags: 'q' }).success).toBe(false)
  })
})
