import { useEffect, useRef, useState } from 'react'
import { LoadingManager } from 'three'
import greenary from './gallery-types/greenary'
import { frameListData, galleryItemData } from '../../data'
import './GalleryCanvas.scss'
import CSSTransition from '@/atoms/ui/CSSTransition'
import Loading from '@/atoms/ui/Loading'

const CANVAS_TYPE: Record<number, (kwargs: GalleryTypeProps) => GalleryTypeReturns> = {
  1: greenary,
}

const GalleryCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  /**
   * Get Data
   */
  const gallery = galleryItemData
  const frameList = frameListData

  /**
   * Render the Three.js canvas
   */

  const [requiredCount, setRequiredCount] = useState(0)
  const [loadedCount, setLoadedCount] = useState(0)

  useEffect(() => {
    if (!gallery || !frameList) return

    const canvas = canvasRef.current!

    // loadingManager
    const loadingManager = new LoadingManager()
    loadingManager.onStart = function increaseLoadCount() {
      setRequiredCount((cnt) => cnt + 1)
    }
    loadingManager.onLoad = function decreaseLoadCount() {
      setLoadedCount((cnt) => cnt + 1)
    }

    // Render canvas
    const { dispose } = CANVAS_TYPE[gallery.place.placeId]({
      loadingManager,
      canvas,
      gallery,
      frameList,
    })

    // Free the resources
    return () => {
      setRequiredCount(0)
      setLoadedCount(0)
      dispose()
    }
  }, [gallery, frameList])

  /**
   * Stat.js
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
    <div className="gallery-canvas">
      <canvas ref={canvasRef} />
      <CSSTransition
        className="gallery-canvas__loading"
        isShow={requiredCount !== loadedCount}
        duration={1000}
        timingFunction="ease-in-out"
      >
        <Loading />
      </CSSTransition>
    </div>
  )
}

export default GalleryCanvas
