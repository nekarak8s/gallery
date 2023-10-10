import React, { useState, useEffect, useRef, useCallback } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import throttle from 'lodash/throttle'
import { routes } from '@/App'
import BurgerLogo from '@/assets/svgs/burger.svg'
import Modal from '@/atoms/ui/Modal'
import LoginForm from '@/features/members/components/LoginForm'

import './Navbar.scss'
import { CURSOR_SCALE } from '@/constants'
import { useRecoilValue } from 'recoil'
import { expDateState, isLoginState } from '@/stores/auth.store'

const BLACK_PATHNAME = ['/guide', '/mypage']

function Navbar() {
  const navbarRef = useRef<HTMLDivElement>(null)
  const navbarMenuRef = useRef<HTMLUListElement>(null)

  /**
   * handle login button click
   */
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const handleLoginClick = function () {
    setIsLoginOpen(true)
  }

  /**
   * handle toggle button click in mobile device size
   */
  const handleToggleClick = useCallback(() => {
    navbarMenuRef.current?.classList.toggle('open')
  }, [])

  /**
   * Show navbar when scrolled down
   */
  useEffect(() => {
    const navbarEle = navbarRef.current as HTMLElement

    // Watch scroll position
    let prevScrollY = window.scrollY
    const handleScroll = () => {
      const curScrollY = window.scrollY
      if (prevScrollY > window.scrollY) {
        navbarEle.style.transform = `translate(0, 0)`
      } else {
        navbarEle.style.transform = `translate(0, -120%)`
      }
      prevScrollY = curScrollY
    }

    const throttledHandleScroll = throttle(handleScroll, 100)
    window.addEventListener('scroll', throttledHandleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
    }
  }, [])

  const location = useLocation()
  const isLogin = useRecoilValue(isLoginState)
  return (
    <>
      <div className="navbar-layout">
        <nav
          className={`navbar ${
            BLACK_PATHNAME.includes(location.pathname) ? 'dark' : ''
          }`}
          ref={navbarRef}
        >
          <div className="navbar__logo" data-cursor-scale={CURSOR_SCALE}>
            <NavLink to={routes['Home'].path}>The Gallery</NavLink>
          </div>
          <ul className="navbar__menu" ref={navbarMenuRef}>
            <li>
              <NavLink
                data-cursor-scale={CURSOR_SCALE}
                to={routes['Guide'].path}
              >
                Guide
              </NavLink>
            </li>
            <li>
              {!isLogin ? (
                <NavLink
                  data-cursor-scale={CURSOR_SCALE}
                  to={routes['MyPage'].path}
                >
                  MyPage
                </NavLink>
              ) : (
                <button
                  data-cursor-scale={CURSOR_SCALE}
                  onClick={handleLoginClick}
                >
                  Login
                </button>
              )}
            </li>
          </ul>
          <button
            className="navbar__toggle"
            onClick={handleToggleClick}
            data-cursor-scale="3"
          >
            <BurgerLogo />
          </button>
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
