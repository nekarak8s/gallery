import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Fallback from './atoms/ui/Fallback'
import useUrlLang from './hooks/useUrlLang'
import ExampleGallery from './pages/ExampleGallery'
import Cursor from '@/atoms/ui/Cursor'
import useMobile from '@/hooks/useMobile'
import NavbarLayout from '@/layouts/NavbarLayout'
import Login from '@/pages/Login'
import OAuth from '@/pages/OAuth'
import '@/styles/_reset.scss'
import '@/styles/_global.scss'
import './App.scss'

const Home = lazy(() => import('@/pages/Home'))
const MyPage = lazy(() => import('@/pages/MyPage'))
const Guide = lazy(() => import('@/pages/Guide'))
const Gallery = lazy(() => import('@/pages/Gallery'))

const navbarRoutes: Record<string, RouteElement> = {
  Home: { path: '/', element: <Home /> },
  Guide: { path: '/guide', element: <Guide /> },
  MyPage: { path: '/mypage', element: <MyPage /> },
  Login: { path: '/login', element: <Login /> },
  Default: { path: '*', element: <Home /> },
}

const plainRoutes: Record<string, RouteElement> = {
  OAuth: { path: '/oauth/:type', element: <OAuth /> },
  Gallery: { path: '/gallery/:galleryId', element: <Gallery /> },
  Portfolio: { path: '/portfolio/:developer', element: <ExampleGallery /> },
  Example: { path: '/gallery/example', element: <ExampleGallery /> },
}

export const routes = { ...plainRoutes, ...navbarRoutes }

function App() {
  const isMobile = useMobile()
  useUrlLang()

  return (
    <Suspense fallback={<Fallback />}>
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
