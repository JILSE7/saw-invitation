import { useCallback, useEffect, useRef, useState } from 'react'
import { tracks } from '../../content/music'

export type PlayerStatus = 'idle' | 'playing' | 'paused' | 'blocked' | 'error'

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [index, setIndex] = useState(0)
  const [status, setStatus] = useState<PlayerStatus>('idle')

  const current = tracks[index]
  const isPlaying = status === 'playing'

  const play = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return
    try {
      await audio.play()
      setStatus('playing')
    } catch {
      // play() rejects when it is not tied to a user gesture and when the
      // file cannot be decoded. Surfacing it beats a button that appears to
      // work and produces silence.
      setStatus('blocked')
    }
  }, [])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    setStatus('paused')
  }, [])

  const toggle = useCallback(() => {
    if (isPlaying) pause()
    else void play()
  }, [isPlaying, pause, play])

  const next = useCallback(() => {
    if (tracks.length === 0) return
    setIndex((i) => (i + 1) % tracks.length)
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onEnded = () => next()
    const onError = () => setStatus('error')

    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)
    return () => {
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
    }
  }, [next])

  // Carries playback across a track change. It never starts on its own:
  // the first play has to come from a tap, or the browser rejects it.
  useEffect(() => {
    if (status === 'playing') void play()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  return { audioRef, current, index, status, isPlaying, toggle, next }
}
