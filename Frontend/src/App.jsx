import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ToastProvider } from './context/ToastContext'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import BackendKeepAlive from './components/system/BackendKeepAlive'
import { router } from './routes'
import { queryClient } from './api/queryClient'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BackendKeepAlive />
      <ToastProvider>
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </ToastProvider>
    </QueryClientProvider>
  )
}

export default App
