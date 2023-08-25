import React, { useState, useEffect, useRef } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import LogoIcon from '@/assets/svgs/gallery-logo.svg'
import { routes } from '@/App'
import './Navbar.scss'
import { throttle } from 'lodash'
import { useLogin } from '@/features/members/services'

function Navbar() {
  const navbarRef = useRef<HTMLDivElement>(null)

  const { mutate: login } = useLogin('kakao')

  const handleClick = function () {
    console.log('kakao')
    login()
  }

  /*
  Show navbar when scrolled down
  */
  useEffect(() => {
    const navbarEle = navbarRef.current
    if (!navbarEle) return

    // Watch scroll position
    let prevScrollY = window.scrollY
    const handleScroll = () => {
      const curScrollY = window.scrollY
      // Set the poistion
      if (prevScrollY > window.scrollY) {
        navbarEle.style.transform = `translate(0, 0)`
      } else {
        navbarEle.style.transform = `translate(0, -120%)`
      }
      prevScrollY = curScrollY
    }

    // Optimize the scroll event
    const throttledHandleScroll = throttle(handleScroll, 100)
    window.addEventListener('scroll', throttledHandleScroll)

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
    }
  }, [])
  return (
    <div className="navbar--layout">
      <nav className="navbar" ref={navbarRef}>
        <div className="navbar__logo">
          <NavLink to={routes['Home'].path}>
            <LogoIcon />
          </NavLink>
        </div>
        <ul className="navbar__menu">
          <li>
            <div onClick={handleClick}>로그인</div>
          </li>
          <li>
            <NavLink to={routes['Guide'].path}>Guide</NavLink>
          </li>
          <li>
            <NavLink to={routes['MyPage'].path}>MyPage</NavLink>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  )
}

export default Navbar
