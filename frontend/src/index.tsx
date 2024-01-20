import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRoot } from 'react-dom/client'
import App from '@/App'

// React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      retryDelay: 1000,
      refetchOnWindowFocus: false, // prevent refetch when focused
    },
  },
})

// Mock Service Worker
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

// Sentry
Sentry.init({
  dsn: 'https://e8c6928fc95d837b6034b9c119b9bdfe@o4506580719304704.ingest.sentry.io/4506580722057216',
  integrations: [
    new Sentry.BrowserTracing({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ['localhost', /^https:\/\/nekarak8s.github.io\/gallery\/api/],
    }),
    new Sentry.Replay({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
})

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
