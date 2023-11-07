import { useRef } from 'react'
import useGreenary from './CanvasType/useGreenary'
import { frameListData, galleryItemData } from '../../data'
import './GalleryCanvas.scss'

const GalleryCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const gallery = galleryItemData
  const frameList = frameListData

  useGreenary({ placeId: 1, containerRef, canvasRef, gallery, frameList })

  return (
    <div className="gallery-canvas" ref={containerRef}>
      <canvas ref={canvasRef} />
    </div>
  )
}

export default GalleryCanvas
