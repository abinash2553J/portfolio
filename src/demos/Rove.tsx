import { Bar, Button, Collapse, Count, Field, Icon, Row, Stage, Text, Window, type Act } from '../kit'
import type { Theme } from '../App'
import './rove.css'

// Rove: a one-line request becomes a time-blocked day on a map. Beats: the
// request is typed, Plan is pressed, the day's stops arrive top to bottom as
// their pins drop and the route draws between them, the estimate rolls up.
// Plays once in view; the poster is the planned day.

const Q = '3 days in Kyoto, temples and food'
const STOPS = [
  { time: '08:00', name: 'Fushimi Inari Taisha', x: 22, y: 30 },
  { time: '12:30', name: 'Nishiki Market', x: 52, y: 58 },
  { time: '17:30', name: 'Gion & Hanamikoji', x: 74, y: 34 },
]
const BUDGET = 38400

type S = { draft: string; planning: boolean; stops: number; budget: number }
const initial: S = { draft: '', planning: false, stops: 0, budget: 0 }
const poster: S = { draft: Q, planning: false, stops: 3, budget: BUDGET }

async function script(a: Act<S>) {
  await a.wait(600)
  a.mark('type')
  await a.type('draft', Q, { interval: 34 })
  await a.wait(250)
  await a.move('plan')
  a.mark('plan')
  await a.click()
  await a.set({ planning: true })
  await a.wait(900)
  a.mark('stops')
  for (let i = 1; i <= STOPS.length; i++) {
    a.put({ stops: i })
    await a.wait(420)
  }
  a.mark('budget')
  await a.set({ planning: false, budget: BUDGET })
  await a.wait(3200)
}

const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`

export function RoveDemo({ theme }: { theme: Theme }) {
  return (
    <div className="tile rv">
      <Stage
        width={680}
        height={380}
        compact={{ below: 560, width: 358, height: 340 }}
        initial={initial}
        poster={poster}
        script={script}
        play="once"
        theme={theme}
        accent="#d4622c"
        cursor={{ at: { wide: { x: 300, y: 330 }, compact: { x: 250, y: 300 } } }}
      >
        {(s) => (
          <Window url="rove-rust.vercel.app" urlShape="pill" className="rv-win">
            <div className="rv-body">
              <div className="rv-plan">
                <Field
                  className="rv-field"
                  value={s.draft}
                  placeholder="Where to?"
                  focused={!s.planning && s.stops === 0}
                  leading={<Icon name="search" />}
                />
                <div className="rv-head">
                  <div className="rv-days">
                    <Text className="rv-day">Day 1</Text>
                    <Text filler className="rv-day rv-day--off">Day 2</Text>
                    <Text filler className="rv-day rv-day--off">Day 3</Text>
                  </div>
                  <Button variant="primary" size="small" data-target="plan">
                    {s.planning ? 'Planning' : 'Plan'}
                  </Button>
                </div>
                <div className="rv-day-plan">
                <div className="rv-list">
                  {STOPS.map((stop, i) => (
                    <Collapse key={stop.name} open={s.stops > i}>
                      <Row
                        pad={8}
                        className="rv-row"
                        lead={<span className="rv-num">{i + 1}</span>}
                        title={<Text className="rv-name">{stop.name}</Text>}
                        subtitle={<Bar w={[72, 56, 84][i]} h={5} tone={2} />}
                        meta={<Text className="rv-time">{stop.time}</Text>}
                      />
                    </Collapse>
                  ))}
                </div>
                <div className="rv-total" data-on={s.budget > 0 || undefined}>
                  <Text className="rv-total__label">Estimated</Text>
                  <Count className="rv-total__value" value={s.budget} format={inr} duration={900} />
                </div>
                </div>
              </div>
              <div className="rv-map" aria-hidden>
                <svg className="rv-map__base" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path className="rv-river" d="M60 -5 C 58 20, 66 40, 62 60 S 58 90, 64 110" />
                  <path className="rv-road" d="M-5 22 L 105 30" />
                  <path className="rv-road" d="M-5 70 L 105 64" />
                  <path className="rv-road" d="M30 -5 L 36 105" />
                  <path className="rv-road rv-road--minor" d="M-5 46 L 105 48" />
                  <path className="rv-road rv-road--minor" d="M82 -5 L 86 105" />
                  <path className="rv-road rv-road--minor" d="M12 -5 L 8 105" />
                </svg>
                <svg className="rv-map__route" viewBox="0 0 100 100" preserveAspectRatio="none" data-on={s.stops >= 3 || undefined}>
                  <path
                    className="rv-route"
                    d={`M${STOPS[0].x} ${STOPS[0].y} C 34 ${STOPS[0].y + 26}, 42 ${STOPS[1].y}, ${STOPS[1].x} ${STOPS[1].y} S 66 ${STOPS[2].y + 6}, ${STOPS[2].x} ${STOPS[2].y}`}
                  />
                </svg>
                <span className="rv-park" style={{ left: '8%', top: '62%' }} />
                <span className="rv-park rv-park--sm" style={{ left: '70%', top: '70%' }} />
                {STOPS.map((stop, i) => (
                  <span key={stop.name} className="rv-pin" data-on={s.stops > i || undefined} style={{ left: `${stop.x}%`, top: `${stop.y}%` }}>
                    {i + 1}
                  </span>
                ))}
              </div>
            </div>
          </Window>
        )}
      </Stage>
    </div>
  )
}
