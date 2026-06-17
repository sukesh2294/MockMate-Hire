import { Navigate, useLocation } from 'react-router-dom'

/** Redirect legacy /login and /signup paths to canonical /auth/* routes, preserving query params. */
export function AuthRedirect({ to }) {
  const location = useLocation()
  return <Navigate to={{ pathname: to, search: location.search }} replace />
}
