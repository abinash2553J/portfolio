import { useCallback, useEffect, useRef, useState } from 'react'
import './ipod.css'

/* ---------- Data ---------- */

type Song = {
  title: string
  artist: string
  album: string
  duration: number
  src: string
}

const PLAYLIST: Song[] = [
  {
    title: 'Feel Good Inc.',
    artist: 'Gorillaz',
    album: 'Demon Days',
    duration: 222,
    src: '/audio/feel-good-inc.mp3',
  },
  {
    title: 'Montagem Diamante Rosa',
    artist: 'VT do Trem & DJ VZLA',
    album: 'Phonk Remix',
    duration: 200,
    src: '/audio/montagem-diamante-rosa.mp3',
  },
]

type Screen = 'menu' | 'songs' | 'nowplaying' | 'about' | 'settings'

type MenuItem = { label: string; action: Screen | 'shuffle' }

const MAIN_MENU: MenuItem[] = [
  { label: 'Music', action: 'songs' },
  { label: 'Now Playing', action: 'nowplaying' },
  { label: 'Settings', action: 'settings' },
  { label: 'Shuffle Songs', action: 'shuffle' },
  { label: 'About', action: 'about' },
]

/* ---------- Helpers ---------- */

const fmtTime = (s: number) => {
  if (isNaN(s) || s < 0) return '0:00'
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

/* ---------- iPod Classic ---------- */

export function IpodClassic({ onClose }: { onClose: () => void }) {
  const [screen, setScreen] = useState<Screen>('menu')
  const [menuSel, setMenuSel] = useState(0)
  const [songSel, setSongSel] = useState(0)
  const [songIdx, setSongIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [duration, setDuration] = useState(PLAYLIST[0].duration)
  const [volume, setVolume] = useState(0.8)
  const [flash, setFlash] = useState(0)
  const history = useRef<Screen[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize and manage real audio playback
  useEffect(() => {
    const audio = new Audio(PLAYLIST[songIdx].src)
    audio.volume = volume
    audioRef.current = audio

    const onTimeUpdate = () => {
      setElapsed(audio.currentTime)
    }

    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration)
      }
    }

    const onEnded = () => {
      // Auto-advance to next song
      setSongIdx((i) => (i + 1) % PLAYLIST.length)
      setElapsed(0)
    }

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)

    if (playing) {
      audio.play().catch(() => setPlaying(false))
    }

    return () => {
      audio.pause()
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
      audio.src = ''
    }
  }, [songIdx])

  // Sync play/pause with audio element
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.play().catch(() => {
        setPlaying(false)
      })
    } else {
      audio.pause()
    }
  }, [playing])

  // Volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const doFlash = () => setFlash((f) => f + 1)

  const goBack = useCallback(() => {
    const prev = history.current.pop()
    if (prev) setScreen(prev)
  }, [])

  const nextSong = useCallback(() => {
    setSongIdx((i) => (i + 1) % PLAYLIST.length)
    setElapsed(0)
    setPlaying(true)
  }, [])

  const prevSong = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0
      setElapsed(0)
    } else {
      setSongIdx((i) => (i - 1 + PLAYLIST.length) % PLAYLIST.length)
      setElapsed(0)
      setPlaying(true)
    }
  }, [])

  const wheelTick = useCallback((dir: number) => {
    doFlash()
    if (screen === 'menu') {
      setMenuSel((s) => Math.max(0, Math.min(MAIN_MENU.length - 1, s + dir)))
    } else if (screen === 'songs') {
      setSongSel((s) => Math.max(0, Math.min(PLAYLIST.length - 1, s + dir)))
    } else if (screen === 'nowplaying') {
      setVolume((v) => Math.max(0, Math.min(1, Math.round((v + dir * 0.05) * 100) / 100)))
    }
  }, [screen])

  const selectAction = useCallback(() => {
    if (screen === 'menu') {
      const item = MAIN_MENU[menuSel]
      if (item.action === 'shuffle') {
        const next = Math.floor(Math.random() * PLAYLIST.length)
        setSongIdx(next)
        setElapsed(0)
        setPlaying(true)
        history.current.push('menu')
        setScreen('nowplaying')
      } else {
        history.current.push('menu')
        setScreen(item.action)
      }
    } else if (screen === 'songs') {
      setSongIdx(songSel)
      setElapsed(0)
      setPlaying(true)
      history.current.push('songs')
      setScreen('nowplaying')
    } else if (screen === 'nowplaying') {
      setPlaying((p) => !p)
    }
  }, [screen, menuSel, songSel])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      const k = e.key.toLowerCase()
      if (k === 'arrowup') {
        e.preventDefault()
        wheelTick(-1)
      } else if (k === 'arrowdown') {
        e.preventDefault()
        wheelTick(1)
      } else if (k === 'arrowright') {
        e.preventDefault()
        if (screen === 'nowplaying') {
          nextSong()
        } else {
          wheelTick(1)
        }
      } else if (k === 'arrowleft') {
        e.preventDefault()
        if (screen === 'nowplaying') {
          prevSong()
        } else {
          wheelTick(-1)
        }
      } else if (k === 'enter' || k === ' ') {
        e.preventDefault()
        selectAction()
      } else if (k === 'backspace' || k === 'm') {
        e.preventDefault()
        goBack()
      }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [wheelTick, selectAction, goBack, nextSong, prevSong, screen, onClose])

  // Click-wheel rotation tracking
  const wheelRef = useRef<HTMLDivElement>(null)
  const lastAngle = useRef<number | null>(null)
  const accum = useRef(0)

  const getAngle = (e: { clientX: number; clientY: number }) => {
    const rect = wheelRef.current!.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    return Math.atan2(e.clientY - cy, e.clientX - cx)
  }

  const onPointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('.ipod__select')) return
    wheelRef.current!.setPointerCapture(e.pointerId)
    lastAngle.current = getAngle(e)
    accum.current = 0
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (lastAngle.current === null) return
    const a = getAngle(e)
    let delta = a - lastAngle.current
    if (delta > Math.PI) delta -= 2 * Math.PI
    if (delta < -Math.PI) delta += 2 * Math.PI
    accum.current += delta
    lastAngle.current = a
    const THRESHOLD = 0.45 // radians per tick
    if (Math.abs(accum.current) >= THRESHOLD) {
      const dir = accum.current > 0 ? 1 : -1
      wheelTick(dir)
      accum.current = 0
    }
  }

  const onPointerUp = () => {
    lastAngle.current = null
  }

  // Wheel quadrant clicks
  const onWheelClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('.ipod__select')) return
    const rect = wheelRef.current!.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    const innerR = rect.width * 0.18

    if (dist < innerR) return

    if (Math.abs(dy) > Math.abs(dx)) {
      if (dy < 0) {
        // Top — MENU
        goBack()
      } else {
        // Bottom — Play/Pause
        setPlaying((p) => !p)
      }
    } else {
      if (dx > 0) {
        // Right — Next track (or skip)
        nextSong()
      } else {
        // Left — Previous track (or rewind)
        prevSong()
      }
    }
    doFlash()
  }

  const song = PLAYLIST[songIdx]

  return (
    <div
      className="ipod-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <button className="ipod-close" onClick={onClose} aria-label="Close iPod" title="Escape">
        ×
      </button>
      <div className="ipod">
        {/* Screen */}
        <div className="ipod__screen">
          <div className="ipod__header">
            <span style={{ width: 16 }}>{playing ? '▶' : ''}</span>
            <span className="ipod__header-title">
              {screen === 'menu' && 'iPod'}
              {screen === 'songs' && 'Songs'}
              {screen === 'nowplaying' && 'Now Playing'}
              {screen === 'about' && 'About'}
              {screen === 'settings' && 'Settings'}
            </span>
            <div className="ipod__battery">
              <div className="ipod__battery-fill" />
            </div>
          </div>

          {/* Menu */}
          {screen === 'menu' && (
            <div className="ipod__menu">
              {MAIN_MENU.map((item, i) => (
                <div key={item.label} className="ipod__menu-item" data-sel={i === menuSel || undefined}>
                  <span>{item.label}</span>
                  <span className="ipod__menu-arrow">▸</span>
                </div>
              ))}
            </div>
          )}

          {/* Songs list */}
          {screen === 'songs' && (
            <div className="ipod__menu">
              {PLAYLIST.map((s, i) => (
                <div key={i} className="ipod__menu-item" data-sel={i === songSel || undefined}>
                  <span>{s.title}</span>
                  <span className="ipod__menu-arrow" style={{ fontSize: 8, opacity: 0.6 }}>
                    {fmtTime(s.duration)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Now Playing */}
          {screen === 'nowplaying' && (
            <div className="ipod__now-playing">
              <div className="ipod__song-num">
                {songIdx + 1} of {PLAYLIST.length}
              </div>
              <div className="ipod__song-title">{song.title}</div>
              <div className="ipod__song-artist">{song.artist}</div>
              <div className="ipod__song-album">{song.album}</div>
              <div className="ipod__progress-bar">
                <div
                  className="ipod__progress-fill"
                  style={{ width: `${Math.min(100, (elapsed / (duration || 1)) * 100)}%` }}
                />
              </div>
              <div className="ipod__time-row">
                <span>{fmtTime(elapsed)}</span>
                <span>{playing ? '▶' : '❚❚'}</span>
                <span>-{fmtTime(Math.max(0, duration - elapsed))}</span>
              </div>
            </div>
          )}

          {/* About */}
          {screen === 'about' && (
            <div className="ipod__about">
              <div className="ipod__about-line">Abinash Karan</div>
              <div className="ipod__about-line">
                <em>Software Engineer</em>
              </div>
              <div className="ipod__about-line">
                <em>IIT Madras · BITS Pilani</em>
              </div>
              <div className="ipod__about-line" style={{ marginTop: 4 }}>
                Songs: {PLAYLIST.length} tracks
              </div>
              <div className="ipod__about-line">
                <em>Now: {song.title}</em>
              </div>
              <div className="ipod__about-line">
                <em>v1.0 · Made with ♥</em>
              </div>
            </div>
          )}

          {/* Settings */}
          {screen === 'settings' && (
            <div className="ipod__about">
              <div className="ipod__about-line" style={{ fontWeight: 700 }}>
                Volume
              </div>
              <div className="ipod__progress-bar" style={{ width: '70%', marginTop: 4 }}>
                <div className="ipod__progress-fill" style={{ width: `${Math.round(volume * 100)}%` }} />
              </div>
              <div className="ipod__about-line" style={{ marginTop: 2 }}>
                <em>{Math.round(volume * 100)}%</em>
              </div>
              <div className="ipod__about-line" style={{ marginTop: 4 }}>
                <em>Wheel controls volume on Now Playing</em>
              </div>
            </div>
          )}
        </div>

        {/* Click Wheel */}
        <div
          ref={wheelRef}
          className="ipod__wheel"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClick={onWheelClick}
        >
          <div className="ipod__wheel-labels">
            <span className="ipod__wheel-label ipod__wheel-label--menu">MENU</span>
            <span className="ipod__wheel-label ipod__wheel-label--fwd">▸▸</span>
            <span className="ipod__wheel-label ipod__wheel-label--rev">◂◂</span>
            <span className="ipod__wheel-label ipod__wheel-label--play">▶❚❚</span>
          </div>
          {flash > 0 && <div key={flash} className="ipod__wheel-flash" />}
          <button className="ipod__select" onClick={selectAction} aria-label="Select" />
        </div>
      </div>
    </div>
  )
}
