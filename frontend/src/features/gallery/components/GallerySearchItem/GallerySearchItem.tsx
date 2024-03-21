import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { GallerySearchItemData } from '../../types'
import { CURSOR_SCALE } from '@/constants'
import throttle from '@/libs/throttle'
import './GallerySearchItem.scss'

type GallerySearchItemProps = {
  gallery: GallerySearchItemData
}

const RIPPLE_RADIUS = 300 // px

const GallerySearchItem = ({ gallery }: GallerySearchItemProps) => {
  /**
   * Ripple on Mouse Event & Focus
   */
  const itemRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const item = itemRef.current!
    if (!item) return

    item.style.setProperty('--diameter', `${RIPPLE_RADIUS * 2}px`)
  }, [])

  const handleMouseMove = throttle((e: MouseEvent) => {
    const item = itemRef.current!
    if (!item) return

    const { x, y } = item.getBoundingClientRect()
    const { clientX, clientY } = e
    const top = `${clientY - y - RIPPLE_RADIUS}px`
    const left = `${clientX - x - RIPPLE_RADIUS}px`
    item.style.setProperty('--top', top)
    item.style.setProperty('--left', left)
  }, 15)

  const handleFous = () => {
    const item = itemRef.current!
    if (!item) return

    const { width, height } = item.getBoundingClientRect()
    item.style.setProperty('--top', `${height / 2 - RIPPLE_RADIUS}px`)
    item.style.setProperty('--left', `${width / 2 - RIPPLE_RADIUS}px`)
  }

  return (
    <NavLink
      className="gallery-search-item"
      to={`/gallery/${gallery.galleryId}`}
      data-cursor-scale={CURSOR_SCALE}
      title={`${gallery.title} 갤러리`}
      onFocus={handleFous}
    >
      <article onMouseMove={handleMouseMove} ref={itemRef}>
        <h2>{gallery.title}</h2>
        <p>{gallery.content}</p>
        <span>by {gallery.nickname}</span>
      </article>
    </NavLink>
  )
}

export default GallerySearchItem
