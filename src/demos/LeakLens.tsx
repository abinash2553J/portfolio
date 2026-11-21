import { Caret, Collapse, Count, Prompt, Stage, Window, type Act } from '../kit'
import type { Theme } from '../App'
import './leaklens.css'

// LeakLens: a scan in a terminal. Beats: the command is typed and run; the
// file count rolls; two findings arrive one by one; the summary lands with
// the next prompt. Plays once; the poster is the finished scan.

const CMD = 'leaklens scan .'
const FILES = 214
const FINDINGS = [
  { sev: 'HIGH', path: 'src/lib/supabase.ts:12', short: 'supabase.ts:12', rule: 'Supabase service key' },
  { sev: 'HIGH', path: '.env.example:3', short: '.env.example:3', rule: 'Gemini API key' },
]

type S = { cmd: string; ran: boolean; files: number; found: number; done: boolean }
const initial: S = { cmd: '', ran: false, files: 0, found: 0, done: false }
const poster: S = { cmd: CMD, ran: true, files: FILES, found: 2, done: true }

async function script(a: Act<S>) {
  await a.wait(700)
  a.mark('type')
  await a.type('cmd', CMD, { interval: 60 })
  await a.wait(350)
  a.mark('run')
  await a.set({ ran: true })
  await a.wait(150)
  a.put({ files: FILES })
  await a.wait(500)
  a.mark('found')
  a.put({ found: 1 })
  await a.wait(450)
  a.put({ found: 2 })
  await a.wait(600)
  a.mark('done')
  a.put({ done: true })
  await a.wait(3200)
}

export function LeakLensDemo({ theme }: { theme: Theme }) {
  return (
    <div className="tile ll">
      <Stage
        width={680}
        height={290}
        compact={{ below: 560, width: 358, height: 300 }}
        initial={initial}
        poster={poster}
        script={script}
        play="once"
        theme={theme}
      >
        {(s, _rect, layout) => {
          const wide = layout === 'wide'
          return (
            <Window chrome="terminal" lights="grey" title={wide ? 'rove — zsh' : undefined} className="ll-win" body={{ 'data-crop': '' }}>
              <div className="ss-term ll-term">
                <Collapse open={!s.ran}>
                  <div className="ll-history">
                    <Prompt path="~/rove">npm run build</Prompt>
                    <div className="ll-line dim">vite v6.3.5 building for production…</div>
                    <div className="ll-line">
                      <span className="ok">✓</span> <span className="dim">1,284 modules transformed</span>
                    </div>
                    <div className="ll-line dim">{wide ? 'dist/assets/index.js    412.80 kB' : 'dist/index.js  412.80 kB'}</div>
                    <div className="ll-line">
                      <span className="ok">✓</span> <span className="dim">built in 2.14s</span>
                    </div>
                  </div>
                </Collapse>
                <Prompt path="~/rove">
                  {s.cmd}
                  {!s.ran && <Caret />}
                </Prompt>
                <Collapse open={s.ran}>
                  <div className="ll-line">
                    <span className="dim">Scanning </span>
                    <Count value={s.files} duration={500} stagger={30} />
                    <span className="dim"> files</span>
                  </div>
                </Collapse>
                {FINDINGS.map((f, i) => (
                  <Collapse key={f.path} open={s.found > i}>
                    <div className="ll-line ll-find">
                      <span className="err">{f.sev}</span>
                      <span className="ll-path">{wide ? f.path : f.short}</span>
                      <span className="dim">{f.rule}</span>
                    </div>
                  </Collapse>
                ))}
                <Collapse open={s.done}>
                  <div className="ll-summary">
                    <div className="ll-line">
                      <span className="err">✗</span> 2 secrets <span className="dim">in 0.38s</span>
                    </div>
                    <div className="ll-line dim">{wide ? 'Move them to the environment and rotate both keys.' : 'Rotate both keys.'}</div>
                    <Prompt path="~/rove" className="ll-next">
                      <Caret />
                    </Prompt>
                  </div>
                </Collapse>
              </div>
            </Window>
          )
        }}
      </Stage>
    </div>
  )
}
