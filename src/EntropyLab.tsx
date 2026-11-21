import { useMemo, useState } from 'react'

function shannonEntropy(value: string) {
  if (!value.length) return 0
  const counts = new Map<string, number>()
  for (const char of value) counts.set(char, (counts.get(char) ?? 0) + 1)
  let entropy = 0
  for (const count of counts.values()) {
    const probability = count / value.length
    entropy -= probability * Math.log2(probability)
  }
  return entropy
}

export function EntropyLab() {
  const [sample, setSample] = useState('')
  const score = useMemo(() => shannonEntropy(sample), [sample])
  const theoreticalMax = sample.length > 1 ? Math.log2(Math.min(sample.length, 256)) : 1
  const percent = sample.length ? Math.min(100, (score / theoreticalMax) * 100) : 0
  const level = !sample ? 'Waiting for input' : score < 2.5 ? 'Low variation' : score < 3.8 ? 'Moderate variation' : 'High variation'
  const mask = sample.length >= 20 && score >= 3.5
  const preview = mask ? `${sample.slice(0, 4)}••••••••••••${sample.slice(-3)}` : sample

  return (
    <section className="entropy-lab" aria-labelledby="entropy-title">
      <div className="entropy-lab__head">
        <div><p className="label">Interactive heuristic</p><h2 id="entropy-title">Entropy, in real time</h2></div>
        <span className="entropy-lab__privacy">Local only · never sent</span>
      </div>
      <label className="entropy-lab__label" htmlFor="entropy-input">Sample string</label>
      <input
        id="entropy-input"
        className="entropy-lab__input"
        type="text"
        autoComplete="off"
        spellCheck={false}
        value={sample}
        onChange={(event) => setSample(event.target.value)}
        placeholder="Use a made-up sample, never a real credential"
      />
      <div className="entropy-lab__meter" role="meter" aria-label="Character distribution entropy" aria-valuemin={0} aria-valuemax={5} aria-valuenow={Math.min(5, score)}>
        <span style={{ width: `${percent}%` }} />
      </div>
      <div className="entropy-lab__metrics"><strong>{score.toFixed(2)} bits / character</strong><span>{level}</span></div>
      <div className="entropy-lab__preview"><span>Preview</span><code>{preview || '—'}</code></div>
      <p className="entropy-lab__note">This measures character-distribution entropy only. It is not a credential detector: high entropy does not prove a string is a secret, and low entropy does not prove it is safe. LeakLens combines entropy with provider patterns, sensitive variable names and other checks. Your input stays in this browser tab.</p>
      <button className="entropy-lab__clear" type="button" onClick={() => setSample('')}>Clear sample</button>
    </section>
  )
}
