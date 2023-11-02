import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import App from '@/App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AxiosResponse } from 'axios'

const rootElement = document.getElementById('root') as HTMLElement

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      retryDelay: 1000,
      refetchOnWindowFocus: false, // prevent refetch when focused
    },
  },
})

createRoot(rootElement).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter
      basename={
        process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL : ''
      }
    >
      <App />
    </BrowserRouter>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
)
