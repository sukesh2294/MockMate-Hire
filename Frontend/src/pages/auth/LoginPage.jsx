import { SignIn, SignedIn, SignedOut } from '@clerk/clerk-react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { AuthLayout } from '../../layouts/AuthLayout'
import { Badge } from '../../components/ui/Badge'
import { buildAuthPath, getRedirectUrlForRole, getRoleLabel, parseRoleFromSearch } from '../../utils/authRole'

const SIGN_IN_PATH = '/auth/login'

export default function LoginPage() {
  const location = useLocation()
  const role = parseRoleFromSearch(location.search)
  const roleLabel = getRoleLabel(role)
  const redirectUrl = getRedirectUrlForRole(role)

  return (
    <AuthLayout
      title="Welcome back"
      subtitle={roleLabel ? `Sign in as ${roleLabel}` : 'Sign in to your MockMate account'}
    >
      {roleLabel && <Badge variant="primary" className="mb-4">{roleLabel}</Badge>}

      <SignedIn>
        <Navigate to={redirectUrl} replace />
      </SignedIn>

      <SignedOut>
        <SignIn
          routing="path"
          path={SIGN_IN_PATH}
          signUpUrl={buildAuthPath('/auth/signup', role)}
          fallbackRedirectUrl={redirectUrl}
          forceRedirectUrl={redirectUrl}
        />
      </SignedOut>

      <p className="text-center text-sm text-text-muted mt-6">
        Don&apos;t have an account?{' '}
        <Link to={buildAuthPath('/auth/signup', role)} className="text-brand-primary font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  )
}
