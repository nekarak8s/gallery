import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import GalleryNavbar from './GalleryNavbar'
import galleryBgm from '@/assets/audios/MapleStory-Pantheon.mp3'
import greenaryBgm from '@/assets/audios/MapleStory-Raindrop-Flower.mp3'
import CSSTransition from '@/atoms/ui/CSSTransition'
import Fallback from '@/atoms/ui/Fallback'
import Music from '@/atoms/ui/Music'
import GalleryCanvas from '@/features/gallery/components/GalleryCanvas'
import GalleryCover from '@/features/gallery/components/GalleryCover'
import { useGalleryQuery } from '@/features/gallery/services'
import { usePostListQuery } from '@/features/post/services'
import musicManager from '@/utils/musicManager'
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
    src: greenaryBgm,
    title: 'MapleStory - Raindrop Flower (ver. Piano)',
  },
]

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
   * Handle click enter button
   * 1. Remove the cover
   * 2. Play the music
   */
  const [isCoverShow, setIsCoverShow] = useState(true)

  const onClickEnter = () => {
    setIsCoverShow(false)
    musicManager.playAudio()
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
      <CSSTransition className="gallery__cover" isShow={isCoverShow} duration={1300}>
        <GalleryCover gallery={gallery} onClickEnter={onClickEnter} />
      </CSSTransition>
      <div className="gallery__music">
        <Music
          id="gallery-audio"
          src={MUSIC_TYPE[gallery.place.placeId].src}
          title={MUSIC_TYPE[gallery.place.placeId].title}
          color="white"
        />
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
