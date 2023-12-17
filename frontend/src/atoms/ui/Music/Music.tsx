import React, { useRef, useEffect } from 'react'
import MusicIcon from '@/assets/svgs/music.svg'
import { CURSOR_SCALE } from '@/constants'

import './Music.scss'

interface Props {
  src: string
  title: string
  id?: string
  color?: 'black' | 'white'
}

const Music: React.FC<Props> = ({ src, title, id = 'audio', color = 'black' }) => {
  const audioRef = useRef<HTMLAudioElement>(null)

  /**
   * Track audio playing state
   */
  const isPlaying = useRef<boolean>(false)

  useEffect(() => {
    const audio = audioRef.current!

    audio.addEventListener('play', () => {
      isPlaying.current = true
    })
    audio.addEventListener('pause', () => {
      isPlaying.current = false
    })
    return () => {}
  }, [])

  /**
   * Toggle audio with clicking
   */
  const handleClick = function toggleAudio() {
    const audio = audioRef.current!

    if (isPlaying.current) {
      audio.pause()
    } else {
      audio.play()
    }
  }

  return (
    <button
      className={`music ${color}`}
      onClick={handleClick}
      aria-label={isPlaying ? '음악 일시정지' : '음악 재생'}
    >
      <MusicIcon />
      <span data-cursor-scale={CURSOR_SCALE}>{title}</span>
      <audio ref={audioRef} id={id} src={src} loop></audio>
    </button>
  )
}

export default Music
