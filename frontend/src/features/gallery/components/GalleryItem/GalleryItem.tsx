import { MouseEventHandler, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GalleryData } from '../../types'
import GalleryUpdateForm from '../GalleryUpdateForm'
import EnterIcon from '@/assets/svgs/enter.svg'
import ShareIcon from '@/assets/svgs/share.svg'
import Modal from '@/atoms/ui/Modal'
import { CURSOR_SCALE } from '@/constants'
import toastManager from '@/utils/toastManager'
import './GalleryItem.scss'

interface GalleryItemProps {
  gallery: GalleryData
}

const GalleryItem = ({ gallery }: GalleryItemProps) => {
  /**
   * Update modal
   */
  const [isUpdateShow, setIsUpdateShow] = useState(false)

  /**
   * Enter the gallery
   */
  const navigate = useNavigate()

  const handleEnterClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation()
    navigate(`/gallery/${gallery.galleryId}`)
  }

  /**
   * Share the url
   */
  const handleShareClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation()

    // 1. Use web share api
    if (navigator.canShare()) {
      navigator.share({
        title: `${gallery.name}`,
        text: `${gallery.name} 전시회에 초대합니다`,
        url: `${window.location.protocol}://${window.location.hostname}:${window.location.port}${process.env.REACT_APP_BASE_URL}/gallery/${gallery.galleryId}`,
      })
      return
    }

    // 2. Use clipboard api
    navigator.clipboard
      .writeText(
        `${window.location.protocol}://${window.location.hostname}:${window.location.port}${process.env.REACT_APP_BASE_URL}/gallery/${gallery.galleryId}`
      )
      .then(() => {
        toastManager.addToast('success', '클립보드에 복사되었습니다')
      })
      .catch(() => {
        toastManager.addToast('error', '클립보드 복사에 실패했습니다')
      })
  }

  /**
   * Hover Animation
   * 1. CSS animation: border + menu buttons
   * 2. Type the content
   */
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

    // CSS animation  & Type the content
    const handleMouseEnter = function typeGalleryContent() {
      item.classList.add('selected')

      if (typingInterval) return
      typingInterval = setInterval(() => {
        content.textContent += gallery.content.charAt(index)
        index += 1
      }, 20)
    }

    // CSS animation  & Delete the type content
    const handleMouseLeave = function eraseGalleryContent() {
      item.classList.remove('selected')

      typingInterval && clearInterval(typingInterval)
      typingInterval = null
      content.textContent = ''
      index = 0
    }

    item.addEventListener('mouseenter', handleMouseEnter)
    item.addEventListener('mouseleave', handleMouseLeave)
    item.addEventListener('focus', handleMouseEnter)
    item.addEventListener('blur', handleMouseLeave)
    buttons.forEach((button) => {
      button.addEventListener('focus', handleMouseEnter)
      button.addEventListener('blur', handleMouseLeave)
    })

    return () => {
      item.removeEventListener('mouseenter', handleMouseEnter)
      item.removeEventListener('mouseleave', handleMouseLeave)
      item.addEventListener('focus', handleMouseEnter)
      item.addEventListener('blur', handleMouseLeave)
      buttons.forEach((button) => {
        button.removeEventListener('focus', handleMouseEnter)
        button.removeEventListener('blur', handleMouseLeave)
      })
      typingInterval && clearInterval(typingInterval)
    }
  }, [])

  return (
    <>
      <article
        tabIndex={0}
        className="gallery-item"
        ref={itemRef}
        data-cursor-scale={CURSOR_SCALE}
        onClick={() => setIsUpdateShow(true)}
      >
        <h2 className="gallery-item__title" data-cursor-scale={CURSOR_SCALE}>
          {gallery.name}
        </h2>
        <ul className="gallery-item__icons" ref={buttonsRef} data-cursor-scale={CURSOR_SCALE}>
          <li>
            <button
              data-cursor-scale={CURSOR_SCALE}
              aria-label={`${gallery.name} 갤러리 입장`}
              onClick={handleEnterClick}
            >
              <EnterIcon />
            </button>
          </li>
          <li>
            <button
              data-cursor-scale={CURSOR_SCALE}
              aria-label={`${gallery.name} 갤러리 공유`}
              onClick={handleShareClick}
            >
              <ShareIcon />
            </button>
          </li>
        </ul>
        <div className="gallery-item__content" data-cursor-scale={CURSOR_SCALE}>
          <div ref={contentRef} data-cursor-scale={CURSOR_SCALE}></div>
          <p data-cursor-scale={CURSOR_SCALE}>{gallery.content}</p>
        </div>
        <time className="gallery-item__date" data-cursor-scale={CURSOR_SCALE}>
          {new Date(gallery.createdDate).toLocaleDateString()}
        </time>
        <div className="gallery-item__borders">
          <div />
          <div />
          <div />
          <div />
        </div>
      </article>
      <Modal isOpen={isUpdateShow} onClose={() => setIsUpdateShow(false)}>
        <GalleryUpdateForm galleryId={gallery.galleryId} onSuccess={() => setIsUpdateShow(false)} />
      </Modal>
    </>
  )
}

export default GalleryItem
