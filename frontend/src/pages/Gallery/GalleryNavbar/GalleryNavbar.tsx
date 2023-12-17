import { useNavigate } from 'react-router-dom'
import './GalleryNavbar.scss'
import { CURSOR_SCALE } from '@/constants'
import ControlNotice from '@/features/gallery/components/ControlNotice'

const GalleryNavbar = () => {
  const navgiate = useNavigate()

  return (
    <nav className="gallery-navbar">
      <ul>
        <li>
          <button data-cursor-scale={CURSOR_SCALE} onClick={() => navgiate(-1)}>
            뒤로가기
          </button>
        </li>
        <li className="gallery-navbar__notice">
          <button data-cursor-scale={CURSOR_SCALE}>조작법</button>
          <ControlNotice />
        </li>
      </ul>
    </nav>
  )
}

export default GalleryNavbar
