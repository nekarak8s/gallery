import React from 'react'
import { Routes, Route } from 'react-router-dom'
import useAxiosInterceptor from './hooks/useAxiosInterceptor'
import Navbar from './layouts/Navbar/Navbar'
import Guide from './pages/Guide'
import Home from './pages/Home'
import MyPage from './pages/MyPage'
import OAuth from './pages/OAuth'

import '@/styles/_reset.scss'
import '@/styles/_global.scss'
import './App.scss'
import Cursor from './atoms/ui/Cursor'

export const routes: Record<string, RouteElement> = {
  Home: { path: '/', element: <Home /> },
  Guide: { path: '/guide', element: <Guide /> },
  MyPage: { path: '/mypage', element: <MyPage /> },
  OAuth: { path: '/oauth/:type', element: <OAuth /> },
}

function App() {
  useAxiosInterceptor()

  return (
    <>
      <Routes>
        <Route path="/" element={<Navbar />}>
          {Object.values(routes).map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Routes>
      <Cursor />
    </>
  )
}
export default App
