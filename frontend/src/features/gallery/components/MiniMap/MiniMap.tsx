import { useEffect, useRef, useState } from 'react'
import galleryImg from '@/assets/images/minimap/gallery.png?format=png'
import galleryWebp from '@/assets/images/minimap/gallery.png?format=webp'
import greenaryImg from '@/assets/images/minimap/greenary.png?format=png'
import greenaryWebp from '@/assets/images/minimap/greenary.png?format=webp'
import kyotoImg from '@/assets/images/minimap/kyoto.png?format=png'
import kyotoWebp from '@/assets/images/minimap/kyoto.png?format=webp'
import CloseSvg from '@/assets/svgs/close.svg'
import DragSvg from '@/assets/svgs/drag.svg'
import OpenSvg from '@/assets/svgs/open.svg'
import WaterDropSvg from '@/assets/svgs/water-drop.svg'
import StaticImage from '@/atoms/ui/StaticImage'
import { CURSOR_SCALE } from '@/constants'
import { TERRAIN_WIDTH as GALLERY_WIDTH } from '@/features/gallery/utils/terrainStrategies/galleryStrategy/galleryTerrain'
import { TERRAIN_WIDTH as GREENARY_WIDTH } from '@/features/gallery/utils/terrainStrategies/greenaryStrategy/greenaryTerrain'
import { TERRAIN_WIDTH as KYOTO_WIDTH } from '@/features/gallery/utils/terrainStrategies/kyotoStrategy/kyotoTerrain'
import useDnd from '@/hooks/useDnd'
import { IControls } from '@/libs/three-custom/controls'
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

const DESKTOP_MINIMAP_WIDTH = 250 // width of the minimap. px
const LAPTOP_MINIMAP_WIDTH = 200 // width of the minimap. px
const MOBILE_MINIMAP_WIDTH = 150 // width of the minimap. px

type MiniMapProps = {
  galleryType: number
  controlsRef: React.RefObject<IControls>
  defaultPosition?: { top?: string; right?: string; left?: string; bottom?: string }
}

function MiniMap({ galleryType, controlsRef, defaultPosition }: MiniMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(true)

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

  useEffect(() => {
    const container = containerRef.current
    const controls = controlsRef.current

    if (!container || !controls) return

    let MINIMAP_WIDTH = DESKTOP_MINIMAP_WIDTH

    // update position & rotation data
    const width = TERRAIN_WIDTH[galleryType]
    const setPostion = () => {
      container.style.setProperty('--data-x', `${(controls.position.x * MINIMAP_WIDTH) / width}px`)
      container.style.setProperty('--data-y', `${(controls.position.z * MINIMAP_WIDTH) / width}px`)
      container.style.setProperty('--data-rad', `${controls.rotationY}rad`)
    }

    const handleResize = () => {
      MINIMAP_WIDTH = DESKTOP_MINIMAP_WIDTH
      if (window.innerWidth < 1280) MINIMAP_WIDTH = LAPTOP_MINIMAP_WIDTH
      if (window.innerWidth < 640) MINIMAP_WIDTH = MOBILE_MINIMAP_WIDTH
      container.style.setProperty('--data-width', `${MINIMAP_WIDTH}px`)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    const intervalID = setInterval(setPostion, 16)

    return () => {
      window.removeEventListener('resize', handleResize)
      clearInterval(intervalID)
    }
  }, [galleryType, controlsRef.current])

  return (
    <section className={`mini-map ${!isOpen ? 'close' : ''}`} ref={containerRef}>
      <div className="mini-map__bar" data-cursor-scale={CURSOR_SCALE}>
        <div>
          <DragSvg />
          <span>미니맵</span>
        </div>
        <button className="mini-map__bar-icons" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? '미니맵 닫기' : '미니맵 닫기'}>
          <CloseSvg />
          <OpenSvg />
        </button>
      </div>
      <div className="mini-map__map">
        <StaticImage imgSrc={TERRAIN_IMAGE[galleryType][0]} webpSrc={TERRAIN_IMAGE[galleryType][1]} alt="미니맵" sizes="200px" />
        <WaterDropSvg />
      </div>
    </section>
  )
}

export default MiniMap
