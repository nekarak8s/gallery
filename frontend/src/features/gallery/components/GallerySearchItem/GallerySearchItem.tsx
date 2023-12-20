import { NavLink } from 'react-router-dom'
import { GallerySearchItemData } from '../../types'
import './GallerySearchItem.scss'

type GallerySearchItemProps = {
  gallery: GallerySearchItemData
}

const GallerySearchItem = ({ gallery }: GallerySearchItemProps) => {
  return (
    <NavLink to={`/gallery/${gallery.galleryId}`} className="gallery-search-item">
      {gallery.title}
    </NavLink>
  )
}

export default GallerySearchItem
