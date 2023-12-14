import { useEffect, useRef } from 'react'
import GalleryNavbar from './GalleryNavbar'
import GalleryCanvas from '@/features/gallery/components/GalleryCanvas'
import './Gallery.scss'

const Gallery = () => {
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

  return (
    <div className="gallery">
      {/* <div className="gallery__cover">
        <GalleryCover />
      </div> */}
      <div className="gallery__navbar">
        <GalleryNavbar />
      </div>
      <div className="gallery__canvas">
        <GalleryCanvas />
      </div>
    </div>
  )
}

export default Gallery
