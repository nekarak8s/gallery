import { useState, useEffect, useRef, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import { routes } from '@/App'
import SearchIcon from '@/assets/svgs/magnify.svg'
import Modal from '@/atoms/ui/Modal'
import { CURSOR_SCALE } from '@/constants'
import GallerySearch from '@/features/gallery/components/GallerySearch'
import LoginForm from '@/features/member/components/LoginForm'
import throttle from '@/libs/throttle'
import './Navbar.scss'

type NavbarProps = {
  whitePathname: string[]
  isLogin: boolean
}

function Navbar({ whitePathname, isLogin }: NavbarProps) {
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
      if (prevScrollY > curScrollY) {
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

  const handleToggleClick = useCallback(() => {
    const menu = menuRef.current!
    const toggle = toggleRef.current!

    menu.classList.toggle('open')
    toggle.classList.toggle('open')
  }, [])

  /**
   * Toggle Search
   */
  const [isSearchShow, setIsSearchShow] = useState(false)

  const handleSearchClick = useCallback(() => {
    setIsSearchShow(true)
    handleToggleClick()
  }, [])

  /**
   * Toggle login modal
   */
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  const handleLoginClick = useCallback(() => {
    setIsLoginOpen(true)
    handleToggleClick()
  }, [])

  /**
   * Show navbar for web accessibility
   */
  const showNavbar = useCallback(() => {
    const navbar = navbarRef.current!

    navbar.classList.remove('hide')
  }, [])

  return (
    <>
      <nav
        className={`navbar ${whitePathname.includes(location.pathname) ? 'white' : ''}`}
        ref={navbarRef}
      >
        <NavLink
          to={routes['Home'].path}
          onFocus={showNavbar}
          data-cursor-scale={CURSOR_SCALE}
          title={'홈 페이지'}
        >
          The Gallery
        </NavLink>
        <ul className="navbar__menu" ref={menuRef}>
          <li>
            <button
              onClick={handleSearchClick}
              data-cursor-scale={CURSOR_SCALE}
              aria-label="갤러리 검색"
            >
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
              Guide
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
                  MyPage
                </NavLink>
              </li>
            ) : (
              <li>
                <button
                  onClick={handleLoginClick}
                  onFocus={showNavbar}
                  data-cursor-scale={CURSOR_SCALE}
                >
                  Login
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
                MyPage
              </NavLink>
            </li>
          )}
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
