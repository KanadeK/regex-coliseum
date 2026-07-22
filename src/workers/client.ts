import type { Evaluation } from '../core/types'

type WorkerResponse = { id: number; evaluation?: Evaluation; error?: string }
export class RegexWorkerClient {
  private worker = this.createWorker()
  private nextId = 1
  private createWorker() { return new Worker(new URL('./regex.worker.ts', import.meta.url), { type: 'module' }) }
  async evaluate(challengeId: string, source: string, flags: string, timeoutMs = 250): Promise<Evaluation> {
    const id = this.nextId++
    return new Promise((resolve) => {
      const timeout = window.setTimeout(() => {
        this.worker.terminate()
        this.worker = this.createWorker()
        resolve({ cases: [], visibleCorrect: 0, hiddenCorrect: 0, elapsedMs: timeoutMs, score: 0, timedOut: true, error: 'Evaluation stopped after 250 ms to protect the browser.' })
      }, timeoutMs)
      const listener = ({ data }: MessageEvent<WorkerResponse>) => {
        if (data.id !== id) return
        window.clearTimeout(timeout)
        this.worker.removeEventListener('message', listener)
        resolve(data.evaluation ?? { cases: [], visibleCorrect: 0, hiddenCorrect: 0, elapsedMs: 0, score: 0, timedOut: false, error: data.error ?? 'Worker failed' })
      }
      this.worker.addEventListener('message', listener)
      this.worker.postMessage({ id, challengeId, source, flags })
    })
  }
}
