import { useNavigate } from 'react-router-dom'
import './GalleryNavbar.scss'
import { routes } from '@/App'
import { CURSOR_SCALE } from '@/constants'
import ControlNotice from '@/features/gallery/components/ControlNotice'

const GalleryNavbar = () => {
  const navigate = useNavigate()

  /**
   * Go back button
   * 1. The same application: go back
   * 2. Other sites: to home page
   */
  const handleClick = () => {
    const previousUrl = document.referrer

    // Direct Access
    if (!previousUrl || window.history.length < 2) {
      navigate(routes['Home'].path)
      return
    }

    // The same application
    if (new URL(previousUrl).host === window.location.host) {
      navigate(-1)
      return
    }

    navigate(routes['Home'].path)
  }

  return (
    <nav className="gallery-navbar">
      <ul>
        <li>
          <button
            data-cursor-scale={CURSOR_SCALE}
            onClick={handleClick}
            aria-label="페이지 뒤로가기"
          >
            뒤로가기
          </button>
        </li>
        <li className="gallery-navbar__notice">
          <button
            data-cursor-scale={CURSOR_SCALE}
            aria-label="
          조작법 열기"
          >
            조작법
          </button>
          <ControlNotice />
        </li>
      </ul>
    </nav>
  )
}

export default GalleryNavbar
