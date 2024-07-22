import { MouseEventHandler, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import galleryImg from '@/assets/images/gallery/mini-map/gallery.png?format=png'
import galleryWebp from '@/assets/images/gallery/mini-map/gallery.png?format=webp'
import greenaryImg from '@/assets/images/gallery/mini-map/greenary.png?format=png'
import greenaryWebp from '@/assets/images/gallery/mini-map/greenary.png?format=webp'
import kyotoImg from '@/assets/images/gallery/mini-map/kyoto.png?format=png'
import kyotoWebp from '@/assets/images/gallery/mini-map/kyoto.png?format=webp'
import CloseSvg from '@/assets/svgs/close.svg'
import DragSvg from '@/assets/svgs/drag.svg'
import OpenSvg from '@/assets/svgs/open.svg'
import StaticImage from '@/atoms/ui/StaticImage'
import { CURSOR_SCALE } from '@/constants'
import { TERRAIN_WIDTH as GALLERY_WIDTH } from '@/features/gallery/utils/terrainStrategies/galleryStrategy/galleryTerrain'
import { TERRAIN_WIDTH as GREENARY_WIDTH } from '@/features/gallery/utils/terrainStrategies/greenaryStrategy/greenaryTerrain'
import { TERRAIN_WIDTH as KYOTO_WIDTH } from '@/features/gallery/utils/terrainStrategies/kyotoStrategy/kyotoTerrain'
import useDnd from '@/hooks/useDnd'
import { IControls } from '@/libs/three-custom/controls'
import { DEVICE_BREAKPOINT } from '@/styles/responsive'
import './MiniMap.scss'

const TERRAIN_WIDTH: Record<number, number> = {
  1: GREENARY_WIDTH,
  2: GALLERY_WIDTH,
  3: KYOTO_WIDTH,
}

const TERRAIN_IMAGE: Record<number, [ResponsiveImageOutput, ResponsiveImageOutput]> = {
  1: [greenaryImg, greenaryWebp],
  2: [galleryImg, galleryWebp],
  3: [kyotoImg, kyotoWebp],
}

const DEVICE_MINIMAP_WIDTH = {
  desktop: 250,
  laptop: 240,
  tablet: 230,
  mobile: 170,
}

type MiniMapProps = {
  galleryType: number
  controls: IControls
  defaultPosition?: { top?: string; right?: string; left?: string; bottom?: string }
}

function MiniMap({ galleryType, controls, defaultPosition }: MiniMapProps) {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(true)

  const handleClick: MouseEventHandler = (e) => {
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  // Set the initial position
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.style.inset = `
      ${defaultPosition?.top || 'auto'} 
      ${defaultPosition?.right || 'auto'} 
      ${defaultPosition?.bottom || 'auto'} 
      ${defaultPosition?.left || 'auto'}
    `
  }, [])

  // Drag and droppable component
  useDnd({ ref: containerRef })

  /**
   * Set the position of the minimap
   * Set time interval to update current svg position
   */
  const markerCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const markerCanvas = markerCanvasRef.current

    if (!container || !markerCanvas) return

    let MINIMAP_WIDTH = DEVICE_MINIMAP_WIDTH.desktop

    const offscreen = markerCanvas.transferControlToOffscreen()
    const worker = new Worker(new URL('./minimapWorker.ts', import.meta.url))
    worker.postMessage({ canvas: offscreen }, [offscreen])

    // update position & rotation data
    const terrainWidth = TERRAIN_WIDTH[galleryType]

    const setPosition = () => {
      worker.postMessage({
        type: 'mark',
        x: (controls.position.x * MINIMAP_WIDTH) / terrainWidth,
        y: (controls.position.z * MINIMAP_WIDTH) / terrainWidth,
        angle: controls.rotationY,
      })
    }

    const handleResize = () => {
      MINIMAP_WIDTH = DEVICE_MINIMAP_WIDTH.desktop
      if (window.innerWidth < DEVICE_BREAKPOINT.laptop) MINIMAP_WIDTH = DEVICE_MINIMAP_WIDTH.laptop
      if (window.innerWidth < DEVICE_BREAKPOINT.tablet) MINIMAP_WIDTH = DEVICE_MINIMAP_WIDTH.tablet
      if (window.innerWidth < DEVICE_BREAKPOINT.mobile) MINIMAP_WIDTH = DEVICE_MINIMAP_WIDTH.mobile
      worker.postMessage({ type: 'resize', width: MINIMAP_WIDTH })
      container.style.setProperty('--data-width', `${MINIMAP_WIDTH}px`)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    const intervalId = setInterval(setPosition, 16)

    return () => {
      worker.postMessage({ type: 'stop' })
      window.removeEventListener('resize', handleResize)
      intervalId && clearInterval(intervalId)
    }
  }, [galleryType])

  return (
    <section className={`mini-map ${!isOpen ? 'close' : ''}`} ref={containerRef}>
      <div className="mini-map__bar" data-cursor-scale={CURSOR_SCALE}>
        <div>
          <DragSvg />
          <span>{t('minimap')}</span>
        </div>
        <button className="mini-map__bar-icons" onClick={handleClick} aria-label={isOpen ? '미니맵 닫기' : '미니맵 닫기'}>
          <CloseSvg />
          <OpenSvg />
        </button>
      </div>
      <div className="mini-map__map">
        <StaticImage imgSrc={TERRAIN_IMAGE[galleryType][0]} webpSrc={TERRAIN_IMAGE[galleryType][1]} alt="미니맵" sizes="200px" />
        <canvas ref={markerCanvasRef} />
      </div>
    </section>
  )
}

export default MiniMap
