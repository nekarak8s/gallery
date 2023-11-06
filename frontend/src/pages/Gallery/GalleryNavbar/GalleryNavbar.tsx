import { useNavigate } from 'react-router-dom'
import './GalleryNavbar.scss'
import { CURSOR_SCALE } from '@/constants'

const GalleryNavbar = () => {
  const navgiate = useNavigate()

  return (
    <nav className="gallery-navbar">
      <button data-cursor-scale={CURSOR_SCALE} onClick={() => navgiate(-1)}>
        Go back
      </button>
      <div>?</div>
    </nav>
  )
}

export default GalleryNavbar
