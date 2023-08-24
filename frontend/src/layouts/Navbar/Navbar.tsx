import { routes } from '@/App'
import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

function Navbar() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <NavLink to={routes['Home'].path}>홈</NavLink>
          </li>
          <li>
            <NavLink to={routes['MyPage'].path}>마이페이지</NavLink>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  )
}

export default Navbar
