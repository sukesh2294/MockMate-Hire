import { Navigate } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn, useAuth } from '@clerk/clerk-react'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { LoadingScreen } from '../components/ui/Spinner'

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isLoaded, isSignedIn } = useAuth()
  const { data: currentUser, isLoading } = useCurrentUser()

  if (!isLoaded || isLoading) {
    return <LoadingScreen message="Checking authentication..." />
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />
  }

  if (allowedRoles.length && currentUser && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/not-found" replace />
  }

  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
