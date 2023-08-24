import React from 'react'

import './App.scss'
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import MyPage from './pages/MyPage'
import Navbar from './layouts/Navbar/Navbar'

export const routes: Record<string, RouteElement> = {
  Home: { path: '/', element: <Home /> },
  MyPage: { path: '/mypage', element: <MyPage /> },
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navbar />}>
        {Object.values(routes).map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>
    </Routes>
  )
}
export default App
