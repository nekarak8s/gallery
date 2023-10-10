import React, { useState, useEffect, useRef, useCallback } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { routes } from '@/App'
import BurgerLogo from '@/assets/svgs/burger.svg'
import Modal from '@/atoms/ui/Modal'
import LoginForm from '@/features/members/components/LoginForm'

import './Navbar.scss'
import { CURSOR_SCALE } from '@/constants'
import { useRecoilValue } from 'recoil'
import { expDateState, isLoginState } from '@/stores/auth.store'
import { throttle } from 'lodash'

const WHITE_PATHNAME = ['/']

function Navbar() {
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
   * Toggle Mmenu open modal
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
   * Toggle login modal
   */
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  const handleLoginClick = useCallback(() => {
    setIsLoginOpen(true)
  }, [])

  /**
   * Show navbar for web accessibility
   */
  const showNavbar = useCallback(() => {
    const navbar = navbarRef.current!

    navbar.classList.remove('hide')
  }, [])

  /**
   * Read hooks
   */
  const location = useLocation() // navbar color
  const isLogin = useRecoilValue(isLoginState) // mypage & login
  return (
    <>
      <div className="navbar-layout">
        <nav
          className={`navbar ${
            WHITE_PATHNAME.includes(location.pathname) ? 'white' : ''
          }`}
          ref={navbarRef}
        >
          <div data-cursor-scale={CURSOR_SCALE}>
            <NavLink to={routes['Home'].path} onFocus={showNavbar}>
              The Gallery
            </NavLink>
          </div>
          <button
            className="navbar__toggle"
            ref={toggleRef}
            onClick={handleToggleClick}
            onFocus={showNavbar}
            data-cursor-scale={CURSOR_SCALE}
          >
            <span data-cursor-scale={CURSOR_SCALE} />
            <span data-cursor-scale={CURSOR_SCALE} />
            <span data-cursor-scale={CURSOR_SCALE} />
          </button>
          <ul className="navbar__menu" ref={menuRef}>
            <li>
              <NavLink
                to={routes['Guide'].path}
                onFocus={showNavbar}
                data-cursor-scale={CURSOR_SCALE}
              >
                Guide
              </NavLink>
            </li>
            <li>
              {!isLogin ? (
                <NavLink
                  to={routes['MyPage'].path}
                  onFocus={showNavbar}
                  data-cursor-scale={CURSOR_SCALE}
                >
                  MyPage
                </NavLink>
              ) : (
                <button
                  onClick={handleLoginClick}
                  onFocus={showNavbar}
                  data-cursor-scale={CURSOR_SCALE}
                >
                  Login
                </button>
              )}
            </li>
          </ul>
        </nav>
        <Outlet />
      </div>
      {/* Login Modal */}
      <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
        <LoginForm />
      </Modal>
    </>
  )
}

export default Navbar
