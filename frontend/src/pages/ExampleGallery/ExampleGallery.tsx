import { useEffect, useState } from 'react'
import GallerySelection from './GallerySelection'
import GalleryNavbar from '../Gallery/GalleryNavbar'
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
import './ExampleGallery.scss'

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

const ExampleGallery = () => {
  /**
   * Get Data: gallery 1
   */
  const { data: gallery, isLoading: isGalleryLoading, isError: isGalleryError } = useGalleryQuery(1)
  const { data: postList, isLoading: isPostLoading, isError: isPostError } = usePostListQuery(1)

  /**
   * Select gallery
   */
  const [placeId, setPlaceId] = useState<number | null>(null)

  const selectGallery = (placeId: number) => {
    if (!gallery) return

    gallery.place.placeId = placeId
    setPlaceId(placeId)
  }

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
    <div className="example-gallery">
      <CSSTransition isShow={placeId == null} className="example-gallery__selection" duration={500}>
        <GallerySelection onSelect={selectGallery} />
      </CSSTransition>
      <CSSTransition isShow={placeId !== null && controlType == null} className="example-gallery__selection" duration={500}>
        <ControlSelection onSelect={selectControl} />
      </CSSTransition>
      {placeId && controlType && (
        <div className="example-gallery__gallery">
          <div className="example-gallery__music">
            <Music id="gallery-audio" src={MUSIC_TYPE[gallery.place.placeId].src} title={MUSIC_TYPE[gallery.place.placeId].title} color="white" />
          </div>
          <div className="example-gallery__navbar">
            <GalleryNavbar />
          </div>
          <div className="example-gallery__canvas">
            <GalleryCanvas controlType={controlType} gallery={gallery} postList={postList} />
          </div>
        </div>
      )}
    </div>
  )
}

export default ExampleGallery