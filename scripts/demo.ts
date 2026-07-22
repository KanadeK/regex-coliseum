import { challenges } from '../src/core/challenges'
import { evaluateRegex } from '../src/core/regex'

const result = evaluateRegex(challenges[0], '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$')
console.log(JSON.stringify({ challenge: challenges[0].title, visibleCorrect: result.visibleCorrect, hiddenCorrect: result.hiddenCorrect, score: result.score, elapsedMs: Number(result.elapsedMs.toFixed(2)) }, null, 2))
