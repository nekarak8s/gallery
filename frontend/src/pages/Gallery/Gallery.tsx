import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import GalleryNavbar from './GalleryNavbar'
import CSSTransition from '@/atoms/ui/CSSTransition'
import Fallback from '@/atoms/ui/Fallback'
import GalleryCanvas from '@/features/gallery/components/GalleryCanvas'
import GalleryCover from '@/features/gallery/components/GalleryCover'
import { useGalleryQuery } from '@/features/gallery/services'
import { usePostListQuery } from '@/features/post/services'
import useMobile from '@/hooks/useMobile'
import toastManager from '@/utils/toastManager'
import './Gallery.scss'

const Gallery = () => {
  /**
   * Get Data
   */
  const { galleryId } = useParams()

  const {
    data: gallery,
    isLoading: isGalleryLoading,
    isError: isGalleryError,
  } = useGalleryQuery(parseInt(galleryId as string))
  const {
    data: postList,
    isLoading: isPostLoading,
    isError: isPostError,
  } = usePostListQuery(parseInt(galleryId as string))

  /**
   * Recommend page rotation
   */
  const isMobile = useMobile()

  useEffect(() => {
    // rotate page
    if (isMobile) {
      toastManager.addToast('info', '가로모드로 플레이하면 더욱 좋습니다', 6000)
    }

    // Reset
    return () => {}
  }, [isMobile])

  /**
   * Delete cover when clicked
   */
  const [isCoverShow, setIsCoverShow] = useState(true)

  /**
   * Stat.js: check frame per second for deveopment
   */
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    /* eslint-disable */
    if (process.env.NODE_ENV === 'production') return

    const Stats = require('stats-js')
    const stats = new Stats()
    stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom)

    function animate() {
      stats.begin()
      // monitored code goes here
      stats.end()
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      document.body.removeChild(stats.dom)
      animationRef.current && cancelAnimationFrame(animationRef.current)
    }
    /* eslint-enable */
  }, [])

  if (isGalleryError || isPostError) return

  if (isGalleryLoading || isPostLoading) return <Fallback />

  return (
    <div className="gallery">
      <CSSTransition className="gallery__cover" isShow={isCoverShow} duration={1300}>
        <GalleryCover gallery={gallery} onEnter={() => setIsCoverShow(false)} />
      </CSSTransition>
      <div className="gallery__navbar">
        <GalleryNavbar />
      </div>
      <div className="gallery__canvas">
        <GalleryCanvas gallery={gallery} postList={postList} />
      </div>
    </div>
  )
}

export default Gallery
