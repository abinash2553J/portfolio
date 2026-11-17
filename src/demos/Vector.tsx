import { Badge, Bar, Count, Meter, Row, Stage, States, Stream, Text, Window, type Act } from '../kit'
import type { Theme } from '../App'
import './vector.css'

// Vector: matches scored by the career graph, explained on demand. Beats:
// Data Engineer is open; the cursor picks ML Engineer; the detail pane
// changes in place, its score rolls, the explanation streams and the skill
// meters settle to the new gaps. Plays once; the poster is ML Engineer open.

type Role = 'ml' | 'data'
const ROLES: Record<Role, { name: string; score: number; why: string; skills: [string, number][] }> = {
  ml: {
    name: 'ML Engineer',
    score: 92,
    why: 'Strong Python and model-building projects. The gap that matters is serving models in production.',
    skills: [
      ['PyTorch', 0.86],
      ['Model serving', 0.34],
    ],
  },
  data: {
    name: 'Data Engineer',
    score: 84,
    why: 'Solid SQL and pipeline work. Streaming systems are the main thing to build experience in.',
    skills: [
      ['SQL & modeling', 0.78],
      ['Stream processing', 0.4],
    ],
  },
}

type S = { role: Role; words: number }
const initial: S = { role: 'data', words: 0 }
const poster: S = { role: 'ml', words: ROLES.ml.why.split(' ').length }

async function script(a: Act<S>) {
  await a.wait(900)
  await a.move('ml')
  a.mark('pick')
  await a.click()
  await a.set({ role: 'ml' })
  await a.wait(350)
  a.mark('stream')
  const n = ROLES.ml.why.split(' ').length
  for (let i = 1; i <= n; i++) {
    a.put({ words: i })
    await a.wait(45)
  }
  await a.wait(3200)
}

const pct = (n: number) => `${Math.round(n)}%`

export function VectorDemo({ theme }: { theme: Theme }) {
  return (
    <div className="tile vc">
      <Stage
        width={680}
        height={330}
        compact={{ below: 560, width: 358, height: 340 }}
        initial={initial}
        poster={poster}
        script={script}
        play="once"
        theme={theme}
        accent="#3c6ee0"
        cursor={{ at: { wide: { x: 250, y: 280 }, compact: { x: 280, y: 300 } } }}
      >
        {(s) => {
          const r = ROLES[s.role]
          return (
            <Window title="Matches" className="vc-win">
              <div className="vc-body">
                <div className="vc-list">
                  {(['ml', 'data'] as Role[]).map((k) => (
                    <Row
                      key={k}
                      pad={10}
                      selected={s.role === k}
                      className="vc-row"
                      data-target={k}
                      title={<Text className="vc-role">{ROLES[k].name}</Text>}
                      meta={<Text className="vc-score">{pct(ROLES[k].score)}</Text>}
                    />
                  ))}
                  {[64, 82, 56].map((w, i) => (
                    <Row key={i} pad={10} className="vc-row" title={<Bar w={w} tone={3} />} meta={<Bar w={22} tone={2} />} />
                  ))}
                </div>
                <div className="vc-detail">
                  <div className="vc-detail__head">
                    <States
                      align="start"
                      value={s.role}
                      states={{ ml: <Text className="vc-title">{ROLES.ml.name}</Text>, data: <Text className="vc-title">{ROLES.data.name}</Text> }}
                    />
                    <Badge tone="accent">
                      <Count value={r.score} format={pct} /> match
                    </Badge>
                  </div>
                  <States
                    align="start"
                    className="vc-why-states"
                    value={s.role}
                    states={{
                      ml: <Stream className="vc-why" text={ROLES.ml.why} count={s.words} />,
                      data: <Stream className="vc-why" text={ROLES.data.why} count={ROLES.data.why.split(' ').length} />,
                    }}
                  />
                  <div className="vc-skills">
                    {r.skills.map(([, v], i) => (
                      <div key={i} className="vc-skill">
                        <States
                          align="start"
                          value={s.role}
                          states={{ ml: <Text className="vc-skill__name">{ROLES.ml.skills[i][0]}</Text>, data: <Text className="vc-skill__name">{ROLES.data.skills[i][0]}</Text> }}
                        />
                        <Meter value={v} tone={v < 0.5 ? 'warning' : 'accent'} />
                      </div>
                    ))}
                    <div className="vc-skill">
                      <Bar w={58} h={5} tone={2} />
                      <Bar w="100%" h={4} r={2} tone={1} />
                    </div>
                  </div>
                </div>
              </div>
            </Window>
          )
        }}
      </Stage>
    </div>
  )
}
