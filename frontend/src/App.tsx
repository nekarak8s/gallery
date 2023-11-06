import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Cursor from '@/atoms/ui/Cursor'
import Loading from '@/atoms/ui/Loading'
import useMobile from '@/hooks/useMobile'
import Navbar from '@/layouts/Navbar/Navbar'
import Login from '@/pages/Login'
import OAuth from '@/pages/OAuth'
import '@/styles/_reset.scss'
import '@/styles/_global.scss'
import './App.scss'

const Home = lazy(() => import('@/pages/Home'))
const Guide = lazy(() => import('@/pages/Guide'))
const MyPage = lazy(() => import('@/pages/MyPage'))
const Gallery = lazy(() => import('@/pages/Gallery'))
const Aquarium = lazy(() => import('./pages/Aquarium'))

export const navbarRoutes: Record<string, RouteElement> = {
  Home: { path: '/', element: <Home /> },
  Guide: { path: '/guide', element: <Guide /> },
  MyPage: { path: '/mypage', element: <MyPage /> },
  Login: { path: '/login', element: <Login /> },
}

export const routes: Record<string, RouteElement> = {
  OAuth: { path: '/oauth/:type', element: <OAuth /> },
  Aquarium: { path: '/aquarium', element: <Aquarium /> },
  Gallery: { path: '/gallery', element: <Gallery /> },
}

function App() {
  const isMobile = useMobile()

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Navbar />}>
          {Object.values(navbarRoutes).map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
        {Object.values(routes).map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
      {!isMobile && <Cursor />}
    </Suspense>
  )
}
export default App
