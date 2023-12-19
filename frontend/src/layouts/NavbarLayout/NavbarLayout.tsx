import { Outlet, useLocation } from 'react-router-dom'
import Footer from '@/atoms/ui/Footer'
import Navbar from '@/atoms/ui/Navbar/Navbar'
import { useLoginStore } from '@/stores/auth.store'
import './NavbarLayout.scss'

const WHITE_PATHNAME = [
  process.env.REACT_APP_BASE_URL + '',
  process.env.REACT_APP_BASE_URL + '/',
  process.env.REACT_APP_BASE_URL + '/login',
  process.env.REACT_APP_BASE_URL + '/guide',
]

const NavbarLayout = () => {
  /**
   * Read hooks
   */
  const location = useLocation() // navbar color
  const isLogin = useLoginStore((state) => state.isLogin())

  return (
    <div className="navbar-layout">
      <Navbar whitePathname={WHITE_PATHNAME} isLogin={isLogin} />
      <Outlet />
      <Footer />
    </div>
  )
}

export default NavbarLayout
