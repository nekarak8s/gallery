import React, { useState, useEffect, useRef, useCallback } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import LogoIcon from '@/assets/svgs/gallery-logo.svg'
import { routes } from '@/App'
import './Navbar.scss'
import throttle from 'lodash/throttle'
import BurgerLogo from '@/assets/svgs/burger.svg'

import { useLogin } from '@/features/members/services'

function Navbar() {
  const navbarRef = useRef<HTMLDivElement>(null)
  const navbarMenuRef = useRef<HTMLUListElement>(null)

  const { mutate: login } = useLogin('kakao')

  const handleClick = function () {
    login()
  }

  // 토글 버튼 눌렀을때 작동
  const handleToggleClick = useCallback(() => {
    navbarMenuRef.current?.classList.toggle('open')
  }, [])

  /*
  Show navbar when scrolled down
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
  return (
    <div className="navbar--layout">
      <nav className="navbar" ref={navbarRef}>
        <NavLink to={routes['Home'].path}>
          <div className="navbar__logo">
            <LogoIcon />
            Gallery
          </div>
        </NavLink>
        <ul className="navbar__menu" ref={navbarMenuRef}>
          <li>
            <div onClick={handleClick}>Login</div>
          </li>
          <li>
            <NavLink to={routes['Guide'].path}>Guide</NavLink>
          </li>
          <li>
            <NavLink to={routes['MyPage'].path}>MyPage</NavLink>
          </li>
        </ul>
        <button className="navbar__toggle" onClick={handleToggleClick}>
          <BurgerLogo />
        </button>
      </nav>
      <Outlet />
    </div>
  )
}

export default Navbar
