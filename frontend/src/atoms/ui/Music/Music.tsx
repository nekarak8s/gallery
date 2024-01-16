import React, { useEffect } from 'react'
import MusicIcon from '@/assets/svgs/music.svg'
import { CURSOR_SCALE } from '@/constants'
import musicManager from '@/utils/musicManager'
import './Music.scss'

interface Props {
  src: string
  title: string
  id?: string
  color?: 'black' | 'white'
}

const Music: React.FC<Props> = ({ src, title, id = 'audio', color = 'black' }) => {
  /**
   * Set the audio
   */
  useEffect(() => {
    musicManager.setAudio(id)
  }, [])

  /**
   * Toggle the audio
   */
  const handleClick = function toggleAudio() {
    musicManager.toggleAudio()
  }

  return (
    <button className={`music ${color}`} onClick={handleClick} aria-label={title}>
      <MusicIcon />
      <span data-cursor-scale={CURSOR_SCALE}>{title}</span>
      <audio id={id} src={src} loop></audio>
    </button>
  )
}

export default Music
