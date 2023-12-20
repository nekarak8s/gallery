import { NavLink } from 'react-router-dom'
import { GallerySearchItemData } from '../../types'
import './GallerySearchItem.scss'

type GallerySearchItemProps = {
  gallery: GallerySearchItemData
}

const GallerySearchItem = ({ gallery }: GallerySearchItemProps) => {
  return (
    <article className="gallery-search-item">
      <NavLink to={`/gallery/${gallery.galleryId}`} title={`${gallery.title} 갤러리`}>
        <div className="gallery-search-item__info">
          <h1>{gallery.title}</h1>
          <p>{gallery.nickname}</p>
        </div>
        <p className="gallery-search-item__content">{gallery.content}</p>
      </NavLink>
    </article>
  )
}

export default GallerySearchItem
