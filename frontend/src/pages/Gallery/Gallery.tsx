import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import GalleryNavbar from './GalleryNavbar'
import { PORTFOLIO_GALLERY_ID } from '../ExampleGallery/ExampleGallery'
import galleryBgm from '@/assets/audios/MapleStory-Pantheon.mp3'
import greenaryBgm from '@/assets/audios/MapleStory-Raindrop-Flower.mp3'
import kyotoBgm from '@/assets/audios/Tokyo-Music-Walker-Colorful-Flowers.mp3'
import CSSTransition from '@/atoms/ui/CSSTransition'
import Fallback from '@/atoms/ui/Fallback'
import Music from '@/atoms/ui/Music'
import ControlSelection from '@/features/gallery/components/ControlSelection'
import GalleryCanvas from '@/features/gallery/components/GalleryCanvas'
import { TControlType } from '@/features/gallery/hooks/useControlsStrategy'
import { useGalleryQuery } from '@/features/gallery/services'
import { usePostListQuery } from '@/features/post/services'
import './Gallery.scss'

const MUSIC_TYPE = [
  { src: '', title: '' },
  {
    src: greenaryBgm,
    title: 'MapleStory - Raindrop Flower (ver. Piano)',
  },
  {
    src: galleryBgm,
    title: 'MapleStory - Phantheon (ver. Piano)',
  },
  {
    src: kyotoBgm,
    title: 'Tokyo Music Walker - Colorful Flowers',
  },
]

const Gallery = () => {
  /**
   * Get Data
   */
  const { galleryId } = useParams()

  const { data: gallery, isLoading: isGalleryLoading, isError: isGalleryError } = useGalleryQuery(parseInt(galleryId as string))
  const { data: postList, isLoading: isPostLoading, isError: isPostError } = usePostListQuery(parseInt(galleryId as string))

  // Redirect if it's portfolio
  const navigate = useNavigate()

  useEffect(() => {
    const portfolioKeys = Object.keys(PORTFOLIO_GALLERY_ID)
    const portfolioKey = portfolioKeys.find((key) => PORTFOLIO_GALLERY_ID[key] === parseInt(galleryId as string))
    if (portfolioKey) {
      navigate(`/portfolio/${portfolioKey}`, { replace: true })
    }
  }, [galleryId])

  /**
   * Select controller
   */
  const [controlType, setControlType] = useState<TControlType | null>(null)

  const selectControl = (type: TControlType) => {
    setControlType(type)
  }

  /**
   * Disable scroll
   */
  useEffect(() => {
    const body = document.body
    body.style.overflow = 'hidden'

    return () => {
      body.style.overflow = 'auto'
    }
  }, [])

  if (isGalleryError || isPostError) return

  if (isGalleryLoading || isPostLoading) return <Fallback />

  return (
    <div className="gallery">
      <CSSTransition isShow={controlType == null} className="gallery__selection" duration={500}>
        <ControlSelection onSelect={selectControl} />
      </CSSTransition>
      {controlType && (
        <>
          <div className="gallery__music">
            <Music id="gallery-audio" src={MUSIC_TYPE[gallery.place.placeId].src} title={MUSIC_TYPE[gallery.place.placeId].title} color="white" />
          </div>
          <div className="gallery__navbar">
            <GalleryNavbar />
          </div>
          <div className="gallery__canvas">
            <GalleryCanvas controlType={controlType} gallery={gallery} postList={postList} />
          </div>
        </>
      )}
    </div>
  )
}

export default Gallery
