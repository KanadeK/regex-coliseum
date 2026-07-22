import { challenges } from '../core/challenges'
import { evaluateRegex } from '../core/regex'

type Request = { id: number; challengeId: string; source: string; flags: string }
self.onmessage = ({ data }: MessageEvent<Request>) => {
  const challenge = challenges.find((candidate) => candidate.id === data.challengeId)
  if (!challenge) { self.postMessage({ id: data.id, error: 'Challenge not found' }); return }
  self.postMessage({ id: data.id, evaluation: evaluateRegex(challenge, data.source, data.flags) })
}
