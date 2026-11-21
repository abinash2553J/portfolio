import { useSyncExternalStore } from 'react'

export type PlaybackTrack = { title: string; artist: string }
type PlaybackSnapshot = { playing: boolean; track: PlaybackTrack | null }
let snapshot: PlaybackSnapshot = { playing: false, track: null }
const listeners = new Set<() => void>()

export function publishPlayback(playing: boolean, track: PlaybackTrack | null) {
  snapshot = { playing, track }
  listeners.forEach((listener) => listener())
}
export function getPlaybackSnapshot() { return snapshot }
export function subscribePlayback(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
export function usePlayback() {
  return useSyncExternalStore(subscribePlayback, getPlaybackSnapshot, getPlaybackSnapshot)
}
