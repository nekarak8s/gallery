import React, { MouseEventHandler, useEffect, useRef } from 'react'
import { GalleryData } from '../../types'
import Button from '@/atoms/ui/Button'
import toFrame from '@/libs/toFrame'
import './GalleryCover.scss'

type GalleryCoverProps = {
  gallery: GalleryData
  onClickEnter: MouseEventHandler
}

const GalleryCover = ({ gallery, onClickEnter }: GalleryCoverProps) => {
  /**
   * Handle Mousemove Event
   * 1. Tilt content
   * 2. Move content shadow
   * 3. Move content light
   */

  const contentRef = useRef<HTMLDivElement>(null)
  const contentLightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const content = contentRef.current!
    const contentLight = contentLightRef.current!

    const handleMousemove = function tiltArtWork(e: MouseEvent) {
      const { x, y, width, height } = content.getBoundingClientRect()
      const left = e.clientX - x
      const top = e.clientY - y
      const centerX = left - width / 2
      const centerY = top - height / 2
      const d = Math.sqrt(centerX ** 2 + centerY ** 2)

      // Tilt content
      content.style.transform = `
          rotate3d(
            ${-centerY / 170},  ${centerX / 170}, 0, ${d / 17}deg
          )
        `
      // Move content shadow
      content.style.boxShadow = `
          ${-centerX / 10}px  ${-centerY / 10}px 20px rgba(0, 0, 0, 0.3)
        `
      // Move content light
      contentLight.style.backgroundImage = `
          radial-gradient(
            circle at ${left}px ${top}px, #00000010, #ffffff00, #ffffff70
          )
        `
    }

    const optimizedHandleMousemove = toFrame(handleMousemove)

    content.addEventListener('mousemove', optimizedHandleMousemove)
    return () => {
      content.removeEventListener('mousemove', optimizedHandleMousemove)
    }
  }, [])

  return (
    <div className="gallery-cover">
      <article className="gallery-cover__content" ref={contentRef}>
        <h1>{gallery.name}</h1>
        <p>{gallery.content}</p>

        <Button text="입장하기" onClick={onClickEnter} direction="center" />
        <div className="gallery-cover__content--light" ref={contentLightRef} />
      </article>
      <div className="gallery-cover__back" />
    </div>
  )
}

export default GalleryCover
