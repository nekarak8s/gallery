import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import Locale from '../Locale'
import { routes } from '@/App'
import SearchIcon from '@/assets/svgs/magnify.svg'
import Modal from '@/atoms/ui/Modal'
import { CURSOR_SCALE } from '@/constants'
import GallerySearch from '@/features/gallery/components/GallerySearch'
import LoginForm from '@/features/member/components/LoginForm'
import throttle from '@/utils/throttle'
import './Navbar.scss'

type NavbarProps = {
  whitePathname: string[]
  isLogin: boolean
}

function Navbar({ whitePathname, isLogin }: NavbarProps) {
  const { t, i18n } = useTranslation()

  /**
   * Scroll responsive navbar
   */
  const navbarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const navbar = navbarRef.current as HTMLElement

    // Watch scroll position
    let prevScrollY = window.scrollY

    const handleScroll = () => {
      const curScrollY = window.scrollY
      if (curScrollY < 1 || prevScrollY > curScrollY) {
        navbar.classList.remove('hide')
      } else {
        navbar.classList.add('hide')
      }
      prevScrollY = curScrollY
    }

    const throttledHandleScroll = throttle(handleScroll, 16)
    window.addEventListener('scroll', throttledHandleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
    }
  }, [])

  /**
   * Toggle Menu open modal (mobile)
   */
  const menuRef = useRef<HTMLUListElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  const handleToggleClick = () => {
    const menu = menuRef.current!
    const toggle = toggleRef.current!

    menu.classList.toggle('open')
    toggle.classList.toggle('open')
  }

  /**
   * Close Modal when click outside (mobile)
   */
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const navbar = navbarRef.current!
      const menu = menuRef.current!
      const toggle = toggleRef.current!

      if (!navbar.contains(e.target as Node)) {
        menu.classList.remove('open')
        toggle.classList.remove('open')
      }
    }

    window.addEventListener('click', handleOutsideClick)

    return () => {
      window.removeEventListener('click', handleOutsideClick)
    }
  }, [])

  /**
   * Toggle Search
   */
  const [isSearchShow, setIsSearchShow] = useState(false)

  const handleSearchClick = () => {
    setIsSearchShow(true)
    handleToggleClick()
  }

  /**
   * Toggle login modal
   */
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  const handleLoginClick = () => {
    setIsLoginOpen(true)
    handleToggleClick()
  }

  /**
   * Show navbar on focus for web accessibility
   */
  const showNavbar = () => {
    const navbar = navbarRef.current!

    navbar.classList.remove('hide')
  }
  return (
    <>
      <nav className={`navbar ${whitePathname.includes(location.pathname) ? 'white' : ''}`} ref={navbarRef}>
        <NavLink to={routes['Home'].path} onFocus={showNavbar} data-cursor-scale={CURSOR_SCALE} title={'홈 페이지'}>
          The Gallery
        </NavLink>
        <ul className="navbar__menu" ref={menuRef}>
          <li>
            <button onClick={handleSearchClick} data-cursor-scale={CURSOR_SCALE} aria-label="갤러리 검색">
              <SearchIcon />
            </button>
          </li>
          <li>
            <NavLink
              to={routes['Guide'].path}
              onFocus={showNavbar}
              data-cursor-scale={CURSOR_SCALE}
              onClick={handleToggleClick}
              title="가이드 페이지"
            >
              {t('navbar.guide')}
            </NavLink>
          </li>
          {process.env.REACT_APP_BASE_URL !== '/gallery' &&
            (isLogin ? (
              <li>
                <NavLink
                  to={routes['MyPage'].path}
                  onFocus={showNavbar}
                  data-cursor-scale={CURSOR_SCALE}
                  onClick={handleToggleClick}
                  title="마이페이지"
                >
                  {t('navbar.mypage')}
                </NavLink>
              </li>
            ) : (
              <li>
                <button onClick={handleLoginClick} onFocus={showNavbar} data-cursor-scale={CURSOR_SCALE}>
                  {t('navbar.login')}
                </button>
              </li>
            ))}
          {process.env.REACT_APP_BASE_URL === '/gallery' && (
            <li>
              <NavLink
                to={routes['MyPage'].path}
                onFocus={showNavbar}
                data-cursor-scale={CURSOR_SCALE}
                onClick={handleToggleClick}
                title="마이페이지"
              >
                {t('navbar.mypage')}
              </NavLink>
            </li>
          )}
          <li>
            <Locale isWhite={whitePathname.includes(location.pathname)} />
          </li>
        </ul>
        <button
          className="navbar__toggle"
          ref={toggleRef}
          onClick={handleToggleClick}
          onFocus={showNavbar}
          data-cursor-scale={CURSOR_SCALE}
          aria-label="메뉴바 토글"
        >
          <span data-cursor-scale={CURSOR_SCALE} />
          <span data-cursor-scale={CURSOR_SCALE} />
          <span data-cursor-scale={CURSOR_SCALE} />
        </button>
      </nav>
      {/* Search Modal */}
      <GallerySearch isShow={isSearchShow} onClose={() => setIsSearchShow(false)} />
      {/* Login Modal */}
      <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
        <LoginForm />
      </Modal>
    </>
  )
}

export default Navbar
