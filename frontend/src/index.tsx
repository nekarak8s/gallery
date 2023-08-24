import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from '@/App'

const rootElement = document.getElementById('root') as HTMLElement

createRoot(rootElement).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
