import React, { useEffect, useRef } from 'react'
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

  const musicBarRef = useRef<HTMLDivElement>(null)

  const handleClick = function toggleAudio() {
    musicManager.toggleAudio()

    const musicBar = musicBarRef.current
    if (!musicBar) return

    // toggle the class
    if (musicManager.isPlaying) {
      musicBar.classList.remove('stop')
    } else {
      musicBar.classList.add('stop')
    }
  }

  return (
    <button
      className={`music ${color}`}
      onClick={handleClick}
      aria-label={title}
      data-cursor-scale={CURSOR_SCALE}
    >
      <div className="music__bar" ref={musicBarRef}>
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <span>{title}</span>
      <audio id={id} src={src} loop></audio>
    </button>
  )
}

export default Music
