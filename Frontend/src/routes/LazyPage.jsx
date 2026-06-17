import { Suspense } from 'react'
import { LoadingScreen } from '../components/ui/Spinner'

export function LazyPage({ children }) {
  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
}
