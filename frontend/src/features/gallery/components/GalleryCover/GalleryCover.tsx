import { MouseEventHandler, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { GalleryData } from '../../types'
import Button from '@/atoms/ui/Button'
import useAutoFocus from '@/hooks/useAutoFocus'
import useFocusTrap from '@/hooks/useFocusTrap'
import toFrame from '@/utils/toFrame'
import './GalleryCover.scss'

type GalleryCoverProps = {
  gallery: GalleryData
  onClickEnter: MouseEventHandler
}

const GalleryCover = ({ gallery, onClickEnter }: GalleryCoverProps) => {
  const { t } = useTranslation()
  const focusRef = useRef<HTMLDivElement>(null)

  useFocusTrap(focusRef)
  useAutoFocus(focusRef)

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

    const handleMouseOut = () => {
      content.style.transform = `rotate3d(0, 0, 0,0deg)`
      content.style.boxShadow = `0px 0px 20px rgba(0, 0, 0, 0.3)`
      contentLight.style.backgroundImage = `
          radial-gradient(
            circle at 0px 0px, #ffffff00, #ffffff00, #ffffff00
          )
        `
    }

    const optimizedHandleMousemove = toFrame(handleMousemove)

    content.addEventListener('mousemove', optimizedHandleMousemove)
    content.addEventListener('mouseout', handleMouseOut)
    return () => {
      content.removeEventListener('mousemove', optimizedHandleMousemove)
      content.removeEventListener('mouseout', handleMouseOut)
    }
  }, [])

  return (
    <div className="gallery-cover" ref={focusRef}>
      <article className="gallery-cover__content" ref={contentRef}>
        <h1>{gallery.name}</h1>
        <p>{gallery.content}</p>
        <Button text={t('buttons.enter')} onClick={onClickEnter} direction="center" />
        <div className="gallery-cover__content--light" ref={contentLightRef} />
      </article>
      <div className="gallery-cover__back" />
    </div>
  )
}

export default GalleryCover
