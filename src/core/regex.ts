import { z } from 'zod'
import { makeEvaluation } from './scoring'
import type { CaseResult, Challenge, Evaluation } from './types'

const flagsSchema = z.string().regex(/^[dgimsuvy]*$/, 'Unsupported regex flag').refine((flags) => new Set(flags).size === flags.length, 'Duplicate regex flag')
export const regexInputSchema = z.object({ source: z.string().min(1, 'Enter a pattern').max(300, 'Pattern is limited to 300 characters'), flags: flagsSchema })

export const evaluateRegex = (challenge: Challenge, source: string, flags = ''): Evaluation => {
  const started = performance.now()
  const input = regexInputSchema.safeParse({ source, flags })
  if (!input.success) return makeEvaluation(challenge, source, [], 0, false, input.error.issues[0]?.message)
  try {
    const regex = new RegExp(input.data.source, input.data.flags.replace(/[gy]/g, ''))
    const cases: CaseResult[] = [...challenge.visible, ...challenge.hidden].map((test) => {
      const actual = regex.test(test.input)
      return { ...test, actual, passed: actual === test.matches }
    })
    for (const corpus of challenge.performance) regex.test(corpus)
    return makeEvaluation(challenge, source, cases, performance.now() - started)
  } catch (cause) {
    return makeEvaluation(challenge, source, [], performance.now() - started, false, cause instanceof Error ? cause.message : 'Invalid regular expression')
  }
}
