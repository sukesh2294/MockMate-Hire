import { useEffect } from 'react'
import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import { Outlet, useNavigate } from 'react-router-dom'
import { clerkConfig } from '../config/clerk'
import { setAuthTokenProvider } from '../api/axios'

function ClerkTokenProvider() {
  const { getToken } = useAuth()

  setAuthTokenProvider(async () => {
    try {
      return await getToken()
    } catch (error) {
      console.debug('Clerk token provider failed to get token', error)
      return null
    }
  })

  return <Outlet />
}

/**
 * Clerk must sit inside React Router so path-based auth steps
 * (e.g. /auth/login/factor-one) sync via navigate instead of breaking back.
 */
export function ClerkRootLayout() {
  const navigate = useNavigate()

  return (
    <ClerkProvider
      publishableKey={clerkConfig.publishableKey}
      signInUrl={clerkConfig.signInUrl}
      signUpUrl={clerkConfig.signUpUrl}
      signInFallbackRedirectUrl={clerkConfig.signInFallbackRedirectUrl}
      signUpFallbackRedirectUrl={clerkConfig.signUpFallbackRedirectUrl}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
    >
      <ClerkTokenProvider />
    </ClerkProvider>
  )
}
