import { useEffect, useRef } from 'react'
import galleryImg from '@/assets/images/minimap/gallery.jpg?format=png'
import galleryWebp from '@/assets/images/minimap/gallery.jpg?format=webp'
import greenaryImg from '@/assets/images/minimap/greenary.jpg?format=png'
import greenaryWebp from '@/assets/images/minimap/greenary.jpg?format=webp'
import kyotoImg from '@/assets/images/minimap/kyoto.jpg?format=png'
import kyotoWebp from '@/assets/images/minimap/kyoto.jpg?format=webp'
import WaterDropSvg from '@/assets/svgs/water-drop.svg'
import StaticImage from '@/atoms/ui/StaticImage'
import { TERRAIN_WIDTH as GALLERY_WIDTH } from '@/features/gallery/utils/terrainStrategies/galleryStrategy/galleryTerrain'
import { TERRAIN_WIDTH as GREENARY_WIDTH } from '@/features/gallery/utils/terrainStrategies/greenaryStrategy/greenaryTerrain'
import { TERRAIN_WIDTH as KYOTO_WIDTH } from '@/features/gallery/utils/terrainStrategies/kyotoStrategy/kyotoTerrain'
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

const DESKTOP_MINIMAP_WIDTH = 200 // width of the minimap. px
const MOBILE_MINIMAP_WIDTH = 150 // width of the minimap. px

type MiniMapProps = {
  galleryType: number
  controlsRef: React.RefObject<IControls>
}

function MiniMap({ galleryType, controlsRef }: MiniMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const controls = controlsRef.current

    if (!container || !controls) return

    let MINIMAP_WIDTH = window.innerWidth < 640 ? MOBILE_MINIMAP_WIDTH : DESKTOP_MINIMAP_WIDTH
    container.style.setProperty('--data-width', `${MINIMAP_WIDTH}px`)

    // update position & rotation data
    const width = TERRAIN_WIDTH[galleryType]
    const setPostion = () => {
      container.style.setProperty('--data-x', `${(controls.position.x * MINIMAP_WIDTH) / width}px`)
      container.style.setProperty('--data-y', `${(controls.position.z * MINIMAP_WIDTH) / width}px`)
      container.style.setProperty('--data-rad', `${controls.rotationY}rad`)
    }

    const handleResize = () => {
      MINIMAP_WIDTH = window.innerWidth < 640 ? MOBILE_MINIMAP_WIDTH : DESKTOP_MINIMAP_WIDTH
      container.style.setProperty('--data-width', `${MINIMAP_WIDTH}px`)
    }

    window.addEventListener('resize', handleResize)
    const intervalID = setInterval(setPostion, 13)

    return () => {
      clearInterval(intervalID)
      window.removeEventListener('resize', handleResize)
    }
  }, [galleryType, controlsRef.current])

  return (
    <div className="mini-map" ref={containerRef}>
      <StaticImage imgSrc={TERRAIN_IMAGE[galleryType][0]} webpSrc={TERRAIN_IMAGE[galleryType][1]} alt="미니맵" sizes="200px" />
      <WaterDropSvg />
    </div>
  )
}

export default MiniMap
