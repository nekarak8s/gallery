import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MyPage from './pages/MyPage'
import Cursor from '@/atoms/ui/Cursor'
import Loading from '@/atoms/ui/Loading'
import useMobile from '@/hooks/useMobile'
import NavbarLayout from '@/layouts/NavbarLayout'
import Login from '@/pages/Login'
import OAuth from '@/pages/OAuth'
import '@/styles/_reset.scss'
import '@/styles/_global.scss'

import './App.scss'

const Guide = lazy(() => import('@/pages/Guide'))
const Gallery = lazy(() => import('@/pages/Gallery'))

const navbarRoutes: Record<string, RouteElement> = {
  Home: { path: '/', element: <Home /> },
  Guide: { path: '/guide', element: <Guide /> },
  MyPage: { path: '/mypage', element: <MyPage /> },
  Login: { path: '/login', element: <Login /> },
}

const plainRoutes: Record<string, RouteElement> = {
  OAuth: { path: '/oauth/:type', element: <OAuth /> },
  Gallery: { path: '/gallery/:galleryId', element: <Gallery /> },
}

export const routes = { ...navbarRoutes, ...plainRoutes }

function App() {
  const isMobile = useMobile()

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="" element={<NavbarLayout />}>
          {Object.values(navbarRoutes).map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
        {Object.values(plainRoutes).map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
      {!isMobile && <Cursor />}
    </Suspense>
  )
}
export default App
