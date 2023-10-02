import React, { useRef, useState, useEffect } from 'react'
import MusicIcon from '@/assets/svgs/music.svg'

import styles from './Music.module.scss'
import { CURSOR_SCALE } from '@/constants'

interface Props {
  src: string
  title: string
  id?: string
  color?: 'black' | 'white'
}

const Music: React.FC<Props> = ({
  src,
  title,
  id = 'audio',
  color = 'black',
}) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleClick = function toggleAudio() {
    const audio = audioRef.current!

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
  }

  useEffect(() => {
    const audio = audioRef.current!

    audio.addEventListener('play', () => {
      setIsPlaying(true)
    })

    audio.addEventListener('pause', () => {
      setIsPlaying(false)
    })

    return () => {}
  }, [])

  return (
    <div
      className={`${styles.container} ${styles[color]}`}
      onClick={handleClick}
    >
      <MusicIcon />
      <span data-cursor-scale={CURSOR_SCALE}>{title}</span>
      <audio ref={audioRef} id={id} src={src} loop></audio>
    </div>
  )
}

export default Music
