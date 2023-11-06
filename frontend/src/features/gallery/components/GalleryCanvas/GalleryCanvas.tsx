import { useRef } from 'react'
import useGreenary from './CanvasType/useGreenary'
import { frameListData, galleryItemData } from '../../data'
import './GalleryCanvas.scss'

const GalleryCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const gallery = galleryItemData
  const frameList = frameListData

  useGreenary({ placeId: 1, canvasRef, gallery, frameList })

  return <canvas className="gallery-canvas" ref={canvasRef} />
}

export default GalleryCanvas
