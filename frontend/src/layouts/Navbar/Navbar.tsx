import React, { useState, useEffect, useRef, useCallback } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { routes } from '@/App'
import Modal from '@/atoms/ui/Modal'
import { CURSOR_SCALE } from '@/constants'
import LoginForm from '@/features/members/components/LoginForm'
import { useLoginStore } from '@/stores/auth.store'
import throttle from '@/utils/throttle'

import './Navbar.scss'

const WHITE_PATHNAME = ['/', '/login']

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
  const isLogin = useLoginStore((state) => state.isLogin())
  return (
    <>
      <div className="navbar-layout">
        <nav
          className={`navbar ${
            WHITE_PATHNAME.includes(location.pathname) ? 'white' : ''
          }`}
          ref={navbarRef}
        >
          <NavLink
            to={routes['Home'].path}
            onFocus={showNavbar}
            data-cursor-scale={CURSOR_SCALE}
          >
            The Gallery
          </NavLink>
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
              {isLogin ? (
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
