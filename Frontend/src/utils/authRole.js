/** Valid roles selected from the landing role modal. */
export const AUTH_ROLES = ['recruiter', 'candidate']

const AUTH_ROLE_STORAGE_KEY = 'mockmate-auth-role'

/** Remember role across Clerk multi-step auth (query params can drop). */
export function persistAuthRole(role) {
  if (AUTH_ROLES.includes(role)) {
    sessionStorage.setItem(AUTH_ROLE_STORAGE_KEY, role)
  }
}

export function clearAuthRole() {
  sessionStorage.removeItem(AUTH_ROLE_STORAGE_KEY)
}

function readStoredRole() {
  const stored = sessionStorage.getItem(AUTH_ROLE_STORAGE_KEY)
  return AUTH_ROLES.includes(stored) ? stored : null
}

/**
 * Parse role from URL search params, falling back to session storage.
 */
export function parseRoleFromSearch(search) {
  const role = new URLSearchParams(search).get('role')
  if (AUTH_ROLES.includes(role)) return role
  return readStoredRole()
}

/** Post-auth destination for each role. */
export function getRedirectUrlForRole(role) {
  if (role === 'candidate') return '/candidate/dashboard'
  return '/recruiter/dashboard'
}

/** Human-readable label shown on auth screens. */
export function getRoleLabel(role) {
  if (role === 'candidate') return 'Candidate'
  if (role === 'recruiter') return 'Recruiter / HR'
  return null
}

/** Preserve role when linking between login and signup. */
export function buildAuthPath(basePath, role) {
  return role ? `${basePath}?role=${role}` : basePath
}
