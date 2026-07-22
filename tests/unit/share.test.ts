import { describe, expect, it } from 'vitest'
import { createShareHash, readShareHash } from '../../src/core/share'

describe('share links', () => {
  it('round trips the challenge id without encoding a solution', () => {
    const hash = createShareHash('arena-04')
    expect(readShareHash(hash)).toBe('arena-04')
    expect(hash).not.toContain('pattern')
  })
  it('rejects corrupt payloads', () => expect(readShareHash('#challenge=not-base64')).toBeUndefined())
})
