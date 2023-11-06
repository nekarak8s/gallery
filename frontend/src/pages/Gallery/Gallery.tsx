import GalleryNavbar from './GalleryNavbar'
import GalleryCanvas from '@/features/gallery/components/GalleryCanvas'
import './Gallery.scss'

const Gallery = () => {
  GalleryCanvas
  return (
    <div className="gallery">
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
