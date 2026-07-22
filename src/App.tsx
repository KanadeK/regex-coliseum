import { useEffect, useMemo, useRef, useState } from 'react'
import { challenges } from './core/challenges'
import { createShareHash, readShareHash } from './core/share'
import type { Evaluation } from './core/types'
import { readScores, saveScore, type ScoreEntry } from './adapters/leaderboard'
import { RegexWorkerClient } from './workers/client'

const starterPatterns: Record<string, string> = { 'arena-01': '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', 'arena-02': '^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$', 'arena-03': '^\\d{4}-\\d{2}-\\d{2}$' }
const client = new RegexWorkerClient()

export function App() {
  const sharedId = readShareHash(window.location.hash)
  const [selectedId, setSelectedId] = useState(sharedId && challenges.some((c) => c.id === sharedId) ? sharedId : challenges[0].id)
  const challenge = useMemo(() => challenges.find((candidate) => candidate.id === selectedId)!, [selectedId])
  const [source, setSource] = useState(starterPatterns[selectedId] ?? '')
  const [flags, setFlags] = useState('')
  const [evaluation, setEvaluation] = useState<Evaluation | undefined>()
  const [running, setRunning] = useState(false)
  const [scores, setScores] = useState<ScoreEntry[]>(readScores)
  const [name, setName] = useState('Anonymous')
  const [notice, setNotice] = useState('')
  const sourceInput = useRef<HTMLInputElement>(null)

  useEffect(() => { setSource(starterPatterns[selectedId] ?? ''); setFlags(''); setEvaluation(undefined); setNotice('') }, [selectedId])
  async function run() {
    setRunning(true); setNotice('')
    const result = await client.evaluate(challenge.id, source, flags)
    setEvaluation(result); setRunning(false)
  }
  async function share() {
    const hash = createShareHash(challenge.id)
    const url = `${window.location.origin}${window.location.pathname}${hash}`
    window.history.replaceState({}, '', hash)
    try { await navigator.clipboard.writeText(url); setNotice('Challenge link copied — it contains the challenge id only.') }
    catch { setNotice(`Share this URL: ${url}`) }
  }
  function record() {
    if (!evaluation || evaluation.score === 0) return
    setScores(saveScore({ name: name.trim().slice(0, 24) || 'Anonymous', score: evaluation.score, challengeId: challenge.id, createdAt: new Date().toISOString() }))
    setNotice('Saved to this browser’s local leaderboard.')
  }
  return <main>
    <header><div><p className="eyebrow">Regex Coliseum · v0.1.0</p><h1>Make every match count.</h1></div><p className="lede">A local-first arena for learning regular expressions through correctness, performance, and readability.</p></header>
    <section className="summary" aria-label="Product facts"><span>30 original challenges</span><span>Worker-isolated evaluation</span><span>Hidden tests stay local</span></section>
    <div className="layout">
      <nav aria-label="Challenges"><h2>Challenge deck</h2><div className="challenge-list">{challenges.map((item, index) => <button key={item.id} className={item.id === selectedId ? 'selected' : ''} onClick={() => setSelectedId(item.id)}><b>{String(index + 1).padStart(2, '0')}</b><span>{item.title}<small>{item.category}</small></span></button>)}</div></nav>
      <section className="arena" aria-live="polite"><div className="arena-heading"><div><p className="eyebrow">{challenge.category}</p><h2>{challenge.title}</h2><p>{challenge.prompt}</p></div><button className="secondary" onClick={share}>Share challenge</button></div>
        <label>Pattern<input ref={sourceInput} value={source} onChange={(event) => setSource(event.target.value)} placeholder="Enter a JavaScript regex source" spellCheck="false" aria-describedby="pattern-help" /></label>
        <p id="pattern-help" className="hint">Enter the source only: no slash delimiters. Patterns run in a disposable Worker and stop after 250 ms.</p>
        <label>Flags<input value={flags} onChange={(event) => setFlags(event.target.value)} placeholder="e.g. i" maxLength={8} /></label>
        <div className="actions"><button className="primary" onClick={run} disabled={running}>{running ? 'Evaluating…' : 'Run challenge'}</button><button className="secondary" onClick={() => { setSource(''); sourceInput.current?.focus() }}>Clear</button></div>
        <div className="tests"><h3>Visible examples</h3>{challenge.visible.map((test, index) => <code key={`${test.input}-${index}`}><span>{test.matches ? 'must match' : 'must reject'}</span>{JSON.stringify(test.input)}</code>)}</div>
        {evaluation && <section className="result"><div className="score"><strong>{evaluation.score}</strong><span>/100</span></div><div><h3>{evaluation.error ?? (evaluation.timedOut ? 'Timed out' : 'Evaluation complete')}</h3><p>{evaluation.error ? 'Fix the pattern and try again.' : `${evaluation.visibleCorrect}/${challenge.visible.length} visible and ${evaluation.hiddenCorrect}/${challenge.hidden.length} hidden examples correct · ${evaluation.elapsedMs.toFixed(1)} ms`}</p></div><div className="result-actions"><input aria-label="Leaderboard name" value={name} onChange={(event) => setName(event.target.value)} maxLength={24} /><button className="secondary" onClick={record} disabled={evaluation.score === 0}>Save score</button></div></section>}
        {notice && <p className="notice">{notice}</p>}
      </section>
      <aside><h2>Local leaderboard</h2><p>Scores never leave your browser.</p><ol>{scores.length ? scores.slice(0, 8).map((score, index) => <li key={`${score.createdAt}-${index}`}><b>{score.name}</b><span>{score.score} <small>{score.challengeId}</small></span></li>) : <li className="empty">Run a challenge to set the first score.</li>}</ol><div className="hints"><h3>Hints</h3>{challenge.hints.map((hint) => <p key={hint}>{hint}</p>)}</div></aside>
    </div>
  </main>
}
