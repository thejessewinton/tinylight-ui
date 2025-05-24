'use client'

import './styles.css'
import React from 'react'
import { PauseIcon, PlayIcon } from './assets'
import { getTime } from './helpers'

interface MediaState {
  ref: React.RefObject<HTMLVideoElement | null>
  isPlaying: boolean
  togglePlay: () => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  duration: number
  setDuration: (newDuration: number) => void
  currentTime: number
  volume: number
  setVolume: (newVolume: number) => void
  isMuted: boolean
  toggleMuted: () => void
  seekTo: (e: React.MouseEvent<HTMLDivElement>) => void
}

const MediaContext = React.createContext<MediaState | null>(null)

export const useMediaPlayer = () => {
  const context = React.useContext(MediaContext)
  if (!context) {
    throw new Error('useMediaPlayer must be used within a MediaProvider')
  }
  return context
}

interface MediaPlayerRootProps extends React.ComponentPropsWithRef<'div'> {}

const Root = ({ children, ...props }: MediaPlayerRootProps) => {
  const ref = React.useRef<HTMLVideoElement | null>(null)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [duration, setDuration] = React.useState(0)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [volume, setVolume] = React.useState(1)
  const [isMuted, setIsMuted] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    if (!ref.current) return
    const video = ref.current

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    if (video.readyState >= 1) {
      setDuration(video.duration)
    }

    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)
    video.addEventListener('durationchange', updateDuration)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
      video.removeEventListener('durationchange', updateDuration)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [])

  const togglePlay = React.useCallback(() => {
    if (!ref.current) return
    if (ref.current.paused) {
      ref.current.play()
    } else {
      ref.current.pause()
    }
  }, [])

  const toggleMuted = React.useCallback(() => {
    if (!ref.current) return
    ref.current.muted = !isMuted
    setIsMuted(!isMuted)
  }, [isMuted])

  const seekTo = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const clickPosition = e.clientX - rect.left
    const percentage = clickPosition / rect.width
    ref.current.currentTime = percentage * ref.current.duration
  }, [])

  const value = React.useMemo(
    () => ({
      ref,
      isPlaying,
      togglePlay,
      isLoading,
      setIsLoading,
      duration,
      setDuration,
      currentTime,
      volume,
      setVolume,
      isMuted,
      toggleMuted,
      seekTo,
    }),
    [
      isPlaying,
      duration,
      currentTime,
      volume,
      isMuted,
      isLoading,
      seekTo,
      toggleMuted,
      togglePlay,
    ],
  )

  return (
    <div data-tinylight-player="" {...props}>
      <MediaContext.Provider value={value}>{children}</MediaContext.Provider>
      <div data-tinylight-scrim="" />
    </div>
  )
}

const PlaybackControl = (props: React.ComponentPropsWithRef<'button'>) => {
  const { isPlaying, togglePlay } = useMediaPlayer()

  return (
    <button onClick={togglePlay} {...props} data-tinylight-button="">
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </button>
  )
}

const Elapsed = () => {
  const { currentTime } = useMediaPlayer()
  const { string, epoch } = getTime(currentTime)

  return (
    <time dateTime={epoch} data-tinylight-elapsed="">
      {string}
    </time>
  )
}

const Remaining = () => {
  const { currentTime, duration } = useMediaPlayer()
  const { string } = getTime(duration - currentTime)

  return <div data-tinylight-remaining="">-{string}</div>
}

const Video = ({ ...props }: React.VideoHTMLAttributes<HTMLVideoElement>) => {
  const { ref, togglePlay } = useMediaPlayer()

  return (
    <video
      onClick={() => {
        togglePlay()
      }}
      ref={ref}
      data-tinylight-video=""
      {...props}
    />
  )
}

export const MediaPlayer = {
  Root,
  Video,
  PlaybackControl,
  Elapsed,
  Remaining,
}
