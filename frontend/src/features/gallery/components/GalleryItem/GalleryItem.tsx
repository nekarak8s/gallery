import { useEffect, useMemo, useRef } from 'react'
import { GalleryData } from '../../types'
import EditIcon from '@/assets/svgs/edit.svg'
import PlayIcon from '@/assets/svgs/play.svg'
import ShareIcon from '@/assets/svgs/share.svg'
import { CURSOR_SCALE } from '@/constants'

import './GalleryItem.scss'

interface GalleryItemProps {
  gallery: GalleryData
}

const GalleryItem = ({ gallery }: GalleryItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<HTMLUListElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const date = useMemo(() => {
    return gallery.createdDate.split(' ')[0]
  }, [gallery.createdDate])

  useEffect(() => {
    const item = itemRef.current!
    const buttons = buttonsRef.current!.querySelectorAll('button')
    const content = contentRef.current!

    const total = gallery.content.length
    let index = 0
    let typingInterval: NodeJS.Timeout | null = null

    const handleMouseEnter = function typeGalleryContent() {
      item.classList.add('selected')

      if (typingInterval) return
      typingInterval = setInterval(() => {
        content.textContent += gallery.content.charAt(index)
        index += 1
      }, 20)
    }
    const handleMouseLeave = function eraseGalleryContent() {
      item.classList.remove('selected')

      typingInterval && clearInterval(typingInterval)
      typingInterval = null
      content.textContent = ''
      index = 0
    }

    item.addEventListener('mouseenter', handleMouseEnter)
    item.addEventListener('mouseleave', handleMouseLeave)
    buttons.forEach((button) => {
      button.addEventListener('focus', handleMouseEnter)
      button.addEventListener('blur', handleMouseLeave)
    })

    return () => {
      item.removeEventListener('mouseenter', handleMouseEnter)
      item.removeEventListener('mouseleave', handleMouseLeave)
      buttons.forEach((button) => {
        button.removeEventListener('focus', handleMouseEnter)
        button.removeEventListener('blur', handleMouseLeave)
      })
      typingInterval && clearInterval(typingInterval)
    }
  }, [])

  return (
    <div className="gallery-item" ref={itemRef}>
      <h2 className="gallery-item__title">{gallery.name}</h2>
      <ul className="gallery-item__icons" ref={buttonsRef}>
        <li>
          <button data-cursor-scale={CURSOR_SCALE}>
            <PlayIcon />
          </button>
        </li>
        <li>
          <button data-cursor-scale={CURSOR_SCALE}>
            <EditIcon />
          </button>
        </li>
        <li>
          <button data-cursor-scale={CURSOR_SCALE}>
            <ShareIcon />
          </button>
        </li>
      </ul>
      <div className="gallery-item__content">
        <div ref={contentRef}></div>
        <p>{gallery.content}</p>
      </div>
      <time className="gallery-item__date">{date}</time>
      <div className="gallery-item__borders">
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  )
}

export default GalleryItem
