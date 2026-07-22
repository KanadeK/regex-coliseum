export type TestCase = { input: string; matches: boolean; label?: string }
export type Challenge = {
  id: string
  title: string
  category: 'extract' | 'validate' | 'log' | 'refactor'
  prompt: string
  hints: string[]
  visible: TestCase[]
  hidden: TestCase[]
  performance: string[]
  recommendedFlags?: string
}

export type CaseResult = TestCase & { actual: boolean; passed: boolean }
export type Evaluation = {
  cases: CaseResult[]
  visibleCorrect: number
  hiddenCorrect: number
  elapsedMs: number
  score: number
  timedOut: boolean
  error?: string
}
