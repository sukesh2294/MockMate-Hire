import { SignUp, SignedIn, SignedOut } from '@clerk/clerk-react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { AuthLayout } from '../../layouts/AuthLayout'
import { Badge } from '../../components/ui/Badge'
import { buildAuthPath, getRedirectUrlForRole, getRoleLabel, parseRoleFromSearch } from '../../utils/authRole'

const SIGN_UP_PATH = '/auth/signup'

export default function SignupPage() {
  const location = useLocation()
  const role = parseRoleFromSearch(location.search)
  const roleLabel = getRoleLabel(role)
  const redirectUrl = getRedirectUrlForRole(role)

  return (
    <AuthLayout
      title="Create your account"
      subtitle={roleLabel ? `Get started as ${roleLabel}` : 'Start hiring smarter with AI-powered interviews'}
    >
      {roleLabel && <Badge variant="primary" className="mb-4">{roleLabel}</Badge>}

      <SignedIn>
        <Navigate to={redirectUrl} replace />
      </SignedIn>

      <SignedOut>
        <SignUp
          routing="path"
          path={SIGN_UP_PATH}
          signInUrl={buildAuthPath('/auth/login', role)}
          fallbackRedirectUrl={redirectUrl}
          forceRedirectUrl={redirectUrl}
        />
      </SignedOut>

      <p className="text-center text-sm text-text-muted mt-6">
        Already have an account?{' '}
        <Link to={buildAuthPath('/auth/login', role)} className="text-brand-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
