import React, { useEffect, useMemo, useRef } from 'react'
import './GalleryItem.scss'
import { CURSOR_SCALE } from '@/constants'
import PlayIcon from '@/assets/svgs/play.svg'
import ShareIcon from '@/assets/svgs/share.svg'
import EditIcon from '@/assets/svgs/edit.svg'

interface props {
  gallery: Gallery
}

const GalleryItem: React.FC<props> = ({ gallery }) => {
  const itemRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const date = useMemo(() => {
    return gallery.createdDate.split(' ')[0]
  }, [gallery.createdDate])

  useEffect(() => {
    const item = itemRef.current!
    const content = contentRef.current!
    const total = gallery.content.length

    let index = 0
    let typingInterval: NodeJS.Timeout | null = null

    const handleMouseEnter = function typeGalleryContent() {
      typingInterval = setInterval(() => {
        content.textContent += gallery.content.charAt(index)
        index += 1
      }, 20)
    }
    const handleMouseLeave = function eraseGalleryContent() {
      typingInterval && clearInterval(typingInterval)
      content.textContent = ''
      index = 0
    }

    item.addEventListener('mouseenter', handleMouseEnter)
    item.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      item.removeEventListener('mouseenter', handleMouseEnter)
      item.removeEventListener('mouseleave', handleMouseLeave)
      typingInterval && clearInterval(typingInterval)
    }
  }, [])

  return (
    <div ref={itemRef} className="gallery-item">
      <svg>
        <rect></rect>
      </svg>
      <span>{gallery.name}</span>
      <div className="gallery-item__icons">
        <button data-cursor-scale={CURSOR_SCALE}>
          <PlayIcon />
        </button>
        <button data-cursor-scale={CURSOR_SCALE}>
          <EditIcon />
        </button>
        <button data-cursor-scale={CURSOR_SCALE}>
          <ShareIcon />
        </button>
      </div>
      <span ref={contentRef}></span>
      <span>{date}</span>
    </div>
  )
}

export default GalleryItem
