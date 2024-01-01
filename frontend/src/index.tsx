import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRoot } from 'react-dom/client'
import App from '@/App'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      retryDelay: 1000,
      refetchOnWindowFocus: false, // prevent refetch when focused
    },
  },
})

async function enableMocking() {
  if (process.env.REACT_APP_BASE_URL !== '/gallery') {
    return
  }

  const { worker } = await import('./mocks/browser')

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start({
    serviceWorker: {
      url: '/gallery/mockServiceWorker.js',
    },
  })
}

const rootElement = document.getElementById('root') as HTMLElement

enableMocking().then(() => {
  createRoot(rootElement).render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter
        basename={process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL : ''}
      >
        <App />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
})
