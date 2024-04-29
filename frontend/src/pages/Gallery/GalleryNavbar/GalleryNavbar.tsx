import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { routes } from '@/App'
import { CURSOR_SCALE } from '@/constants'
import './GalleryNavbar.scss'

const GalleryNavbar = () => {
  const { t } = useTranslation()
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
          <button data-cursor-scale={CURSOR_SCALE} onClick={handleClick} aria-label="페이지 뒤로가기">
            {t('galleryNav.goBack')}
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default GalleryNavbar
