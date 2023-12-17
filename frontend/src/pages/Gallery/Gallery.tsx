import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import GalleryNavbar from './GalleryNavbar'
import Loading from '@/atoms/ui/Loading'
import GalleryCanvas from '@/features/gallery/components/GalleryCanvas'
import GalleryCover from '@/features/gallery/components/GalleryCover'
import { useGalleryQuery } from '@/features/gallery/services'
import { usePostListQuery } from '@/features/post/services'
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

  if (isGalleryLoading || isPostLoading) return <Loading />

  return (
    <div className="gallery">
      <div className="gallery__cover">
        <GalleryCover gallery={gallery} />
      </div>
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
